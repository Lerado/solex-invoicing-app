// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

// Create the command
#[tauri::command]
fn close_splashscreen(window: tauri::Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_webview_window("splashscreen") {
        splashscreen.close().unwrap();
    }

    // Show main window
    window.get_webview_window("main").unwrap().show().unwrap();
}

use tauri_plugin_sql::Migration;
use tauri_plugin_sql::MigrationKind;

pub fn run() {
    // Connection string
    const DB_CONNECTION_STRING: &str = "sqlite:solex-invoicing.db";
    // Migrations
    let migrations: Vec<tauri_plugin_sql::Migration> = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_users_tables",
            sql: "
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                cashierReference TEXT,
                cashierName TEXT,
                rootPassword TEXT,
                createdAt INTEGER,
                updatedAt INTEGER,
                deletedAt INTEGER
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_cities_tables",
            sql: "
            CREATE TABLE cities (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                countryCode TEXT NOT NULL,
                createdAt INTEGER,
                updatedAt INTEGER,
                deletedAt INTEGER
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_shipments_tables",
            sql: "
            CREATE TABLE shipments (
                id INTEGER PRIMARY KEY,
                totalPrice REAL DEFAULT 0,
                number TEXT NOT NULL UNIQUE,
                pickupTime TEXT NOT NULL,
                pickupDate INTEGER NOT NULL,
                createdAt INTEGER,
                updatedAt INTEGER,
                deletedAt INTEGER
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create_shipments_from_tables",
            sql: "
            CREATE TABLE shipments_from (
                id INTEGER PRIMARY KEY,
                shipmentId INTEGER,
                cityId INTEGER NOT NULL,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                countryCode TEXT NOT NULL,
                contact TEXT NOT NULL,
                address TEXT,
                createdAt INTEGER,
                updatedAt INTEGER,
                deletedAt INTEGER,
                CONSTRAINT FK_shipments_from_shipments FOREIGN KEY (shipmentId) REFERENCES shipments (id) ON DELETE CASCADE,
                CONSTRAINT FK_shipments_from_cities FOREIGN KEY (cityId) REFERENCES cities (id) ON DELETE SET NULL
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "create_shipments_to_tables",
            sql: "
            CREATE TABLE shipments_to (
                id INTEGER PRIMARY KEY,
                shipmentId INTEGER NOT NULL,
                cityId INTEGER NOT NULL,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                countryCode TEXT NOT NULL,
                contact TEXT NOT NULL,
                address TEXT,
                createdAt INTEGER,
                updatedAt INTEGER,
                deletedAt INTEGER,
                CONSTRAINT FK_shipments_to_shipments FOREIGN KEY (shipmentId) REFERENCES shipments (id) ON DELETE CASCADE,
                CONSTRAINT FK_shipments_to_cities FOREIGN KEY (cityId) REFERENCES cities (id) ON DELETE SET NULL
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 6,
            description: "create_shipments_packages_tables",
            sql: "
            CREATE TABLE shipments_packages (
                id INTEGER PRIMARY KEY,
                shipmentId INTEGER NOT NULL,
                totalPrice REAL DEFAULT 0,
                designation TEXT NOT NULL,
                quantity INTEGER DEFAULT 0,
                weight REAL NOT NULL DEFAULT 0,
                price REAL DEFAULT 0,
                createdAt INTEGER,
                updatedAt INTEGER,
                deletedAt INTEGER,
                CONSTRAINT FK_shipments_packages_shipments FOREIGN KEY (shipmentId) REFERENCES shipments (id) ON DELETE CASCADE
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 7,
            description: "rename_users_to_cashiers",
            sql: "
            ALTER TABLE users RENAME TO cashiers;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 8,
            description: "add_countrycode_and_citycode_to_cashiers",
            sql: "
            ALTER TABLE cashiers ADD COLUMN countryCode TEXT NOT NULL;
            ALTER TABLE cashiers ADD COLUMN cityCode TEXT NOT NULL;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 9,
            description: "add_cityCode_to_cities",
            sql: "
            ALTER TABLE cities ADD COLUMN cityCode TEXT NOT NULL DEFAULT '';
            CREATE INDEX idx_cities_cityCode ON cities(cityCode);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 10,
            description: "clients_and_shipment_clients_and_drop_shipments_from_to",
            sql: "
            -- Create clients table
            CREATE TABLE clients (
                id INTEGER PRIMARY KEY,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                contact TEXT NOT NULL,
                address TEXT,
                createdAt INTEGER,
                updatedAt INTEGER,
                deletedAt INTEGER
            );

            -- Create pivot table for many-to-many relationship
            CREATE TABLE shipment_clients (
                id INTEGER PRIMARY KEY,
                shipmentId INTEGER NOT NULL,
                clientId INTEGER NOT NULL,
                role TEXT NOT NULL, -- 'sender' or 'recipient'
                createdAt INTEGER,
                updatedAt INTEGER,
                deletedAt INTEGER,
                CONSTRAINT FK_shipment_clients_shipments FOREIGN KEY (shipmentId) REFERENCES shipments (id) ON DELETE CASCADE,
                CONSTRAINT FK_shipment_clients_clients FOREIGN KEY (clientId) REFERENCES clients (id) ON DELETE CASCADE
            );

            -- Drop old tables
            DROP TABLE IF EXISTS shipments_from;
            DROP TABLE IF EXISTS shipments_to;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 11,
            description: "make_contact_unique_in_clients",
            sql: "
            CREATE UNIQUE INDEX idx_clients_contact_unique ON clients(contact);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 12,
            description: "rename_shipment_packages_to_shipment_items",
            sql: "
            ALTER TABLE shipments_packages RENAME TO shipment_items;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 13,
            description: "remove_columns_from_shipment_items",
            sql: "
            ALTER TABLE shipment_items RENAME TO shipment_items_old;
            CREATE TABLE shipment_items (
                id INTEGER PRIMARY KEY,
                shipmentId INTEGER NOT NULL,
                designation TEXT NOT NULL,
                quantity INTEGER DEFAULT 0,
                createdAt INTEGER,
                updatedAt INTEGER,
                deletedAt INTEGER,
                CONSTRAINT FK_shipment_items_shipments FOREIGN KEY (shipmentId) REFERENCES shipments (id) ON DELETE CASCADE
            );
            INSERT INTO shipment_items (id, shipmentId, designation, createdAt, updatedAt, deletedAt)
                SELECT id, shipmentId, designation, createdAt, updatedAt, deletedAt FROM shipment_items_old;
            DROP TABLE shipment_items_old;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 14,
            description: "add_totalWeight_and_bundle_dimensions_to_shipments",
            sql: "
            ALTER TABLE shipments ADD COLUMN totalWeight REAL DEFAULT 0;
            ALTER TABLE shipments ADD COLUMN bundledLength REAL DEFAULT 0;
            ALTER TABLE shipments ADD COLUMN bundledWidth REAL DEFAULT 0;
            ALTER TABLE shipments ADD COLUMN bundledHeight REAL DEFAULT 0;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 15,
            description: "add_volumetricWeight_to_shipments",
            sql: "
            ALTER TABLE shipments ADD COLUMN volumetricWeight REAL DEFAULT 0;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 16,
            description: "add_delivery_fields_to_shipments",
            sql: "
            ALTER TABLE shipments ADD COLUMN deliveryCountry TEXT;
            ALTER TABLE shipments ADD COLUMN deliveryCity TEXT;
            ALTER TABLE shipments ADD COLUMN deliveryAddress TEXT;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 17,
            description: "add_finalWeight_to_shipments",
            sql: "
            ALTER TABLE shipments ADD COLUMN finalWeight REAL DEFAULT 0;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 18,
            description: "rename_delivery_columns_to_codes",
            sql: "
            ALTER TABLE shipments RENAME COLUMN deliveryCountry TO deliveryCountryCode;
            ALTER TABLE shipments RENAME COLUMN deliveryCity TO deliveryCityCode;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 19,
            description: "add_agency_contact_to_cashiers",
            sql: "
            ALTER TABLE cashiers ADD COLUMN agencyPhone TEXT;
            ",
            kind: MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        // SQLite plugin
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(DB_CONNECTION_STRING, migrations)
                .build(),
        )
        // Add close splashscreen command
        .invoke_handler(tauri::generate_handler![close_splashscreen])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
