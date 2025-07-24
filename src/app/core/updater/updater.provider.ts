import { Provider, EnvironmentProviders, provideEnvironmentInitializer } from '@angular/core';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export const provideAppUpdater = (): Array<Provider | EnvironmentProviders> => [
    provideEnvironmentInitializer(async () => {
        try {
            const update = await check();
            if (update) {
                console.log(
                    `Found update ${update.version} from ${update.date} with notes ${update.body}`
                );
                let downloaded = 0;
                let contentLength = 0;
                // alternatively we could also call update.download() and update.install() separately
                await update.downloadAndInstall((message) => {
                    switch (message.event) {
                        case 'Started':
                            contentLength = message.data.contentLength;
                            console.log(`Started downloading ${message.data.contentLength} bytes`);
                            break;
                        case 'Progress':
                            downloaded += message.data.chunkLength;
                            console.log(`Downloaded ${downloaded} from ${contentLength}`);
                            break;
                        case 'Finished':
                            console.log('Download finished');
                            break;
                    }
                });
                console.log('update installed');
                await relaunch();
            }
        } catch (error) {
            console.error(error);
        }
    })
];
