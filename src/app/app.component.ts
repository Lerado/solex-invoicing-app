import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'sia-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styles: `
        :host {
            display: flex;
            flex: 1 1 auto;
            width: 100%;
            height: 100%;
        }
    `
})
export class AppComponent { }
