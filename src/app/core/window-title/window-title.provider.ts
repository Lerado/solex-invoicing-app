import { Provider, EnvironmentProviders, provideEnvironmentInitializer } from '@angular/core';
import { getName, getVersion } from '@tauri-apps/api/app';
import { getCurrentWindow } from '@tauri-apps/api/window';

export const provideWindowTitle = (): Array<Provider | EnvironmentProviders> => [
    provideEnvironmentInitializer(async () => {
        try {
            const [name, version] = await Promise.all([
                getName(),
                getVersion()
            ]);

            const currentWindow = await getCurrentWindow();
            currentWindow.setTitle(`${name} v${version}`);
        }
        catch (error) {
            console.error('Failed to set window title:', error);
        }
    })

];
