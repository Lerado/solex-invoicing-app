// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

// Create the command
#[tauri::command]
fn close_splashscreen(window: tauri::Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }

    // Show main window
    window.get_window("main").unwrap().show().unwrap();
}

use tauri_plugin_sql::Migration;
use tauri_plugin_sql::MigrationKind;

// Connection string
const DB_CONNECTION_STRING: &str = "sqlite:solex-invoicing.db";

fn main() {
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
                country TEXT NOT NULL,
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
                country TEXT NOT NULL,
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
                country TEXT NOT NULL,
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
        }
    ];

    tauri::Builder::default()
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
