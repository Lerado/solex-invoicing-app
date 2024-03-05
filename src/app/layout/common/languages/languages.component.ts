import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LangDefinition, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'sia-languages',
    templateUrl: './languages.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'languages',
    standalone: true,
    imports: [MatMenuModule, MatButtonModule, MatIconModule],
})
export class LanguagesComponent {

    availableLangs = this._translocoService.getAvailableLangs() as LangDefinition[];
    activeLangId = toSignal(this._translocoService.langChanges$);
    activeLangLabel = computed(() => this.availableLangs.find(lang => lang.id === this.activeLangId()).label);

    /**
     * Constructor
     */
    constructor(
        private readonly _translocoService: TranslocoService,
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the active lang
     *
     * @param lang
     */
    setActiveLang(lang: string): void {
        // Set the active lang
        this._translocoService.setActiveLang(lang);
    }
}
