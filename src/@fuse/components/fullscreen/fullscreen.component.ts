import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FSDocument, FSDocumentElement } from '@fuse/components/fullscreen/fullscreen.types';

@Component({
    selector       : 'fuse-fullscreen',
    templateUrl    : './fullscreen.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'fuseFullscreen',
    standalone     : true,
    imports        : [MatButtonModule, MatTooltipModule, NgTemplateOutlet, MatIconModule],
})
export class FuseFullscreenComponent implements OnInit
{
    private _document = inject<Document>(DOCUMENT);

    @Input() iconTpl: TemplateRef<any>;
    @Input() tooltip: string;
    private _fsDoc: FSDocument;
    private _fsDocEl: FSDocumentElement;
    private _isFullscreen: boolean = false;

    /** Inserted by Angular inject() migration for backwards compatibility */
    constructor(...args: unknown[]);

    /**
     * Constructor
     */
    constructor()
    {
        const _document = this._document;

        this._fsDoc = _document as FSDocument;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._fsDocEl = document.documentElement as FSDocumentElement;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle the fullscreen mode
     */
    toggleFullscreen(): void
    {
        // Check if the fullscreen is open
        this._isFullscreen = this._getBrowserFullscreenElement() !== null;

        // Toggle the fullscreen
        if ( this._isFullscreen )
        {
            this._closeFullscreen();
        }
        else
        {
            this._openFullscreen();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get browser's fullscreen element
     *
     * @private
     */
    private _getBrowserFullscreenElement(): Element
    {
        if ( typeof this._fsDoc.fullscreenElement !== 'undefined' )
        {
            return this._fsDoc.fullscreenElement;
        }

        if ( typeof this._fsDoc.mozFullScreenElement !== 'undefined' )
        {
            return this._fsDoc.mozFullScreenElement;
        }

        if ( typeof this._fsDoc.msFullscreenElement !== 'undefined' )
        {
            return this._fsDoc.msFullscreenElement;
        }

        if ( typeof this._fsDoc.webkitFullscreenElement !== 'undefined' )
        {
            return this._fsDoc.webkitFullscreenElement;
        }

        throw new Error('Fullscreen mode is not supported by this browser');
    }

    /**
     * Open the fullscreen
     *
     * @private
     */
    private _openFullscreen(): void
    {
        if ( this._fsDocEl.requestFullscreen )
        {
            this._fsDocEl.requestFullscreen();
            return;
        }

        // Firefox
        if ( this._fsDocEl.mozRequestFullScreen )
        {
            this._fsDocEl.mozRequestFullScreen();
            return;
        }

        // Chrome, Safari and Opera
        if ( this._fsDocEl.webkitRequestFullscreen )
        {
            this._fsDocEl.webkitRequestFullscreen();
            return;
        }

        // IE/Edge
        if ( this._fsDocEl.msRequestFullscreen )
        {
            this._fsDocEl.msRequestFullscreen();
            return;
        }
    }

    /**
     * Close the fullscreen
     *
     * @private
     */
    private _closeFullscreen(): void
    {
        if ( this._fsDoc.exitFullscreen )
        {
            this._fsDoc.exitFullscreen();
            return;
        }

        // Firefox
        if ( this._fsDoc.mozCancelFullScreen )
        {
            this._fsDoc.mozCancelFullScreen();
            return;
        }

        // Chrome, Safari and Opera
        if ( this._fsDoc.webkitExitFullscreen )
        {
            this._fsDoc.webkitExitFullscreen();
            return;
        }

        // IE/Edge
        else if ( this._fsDoc.msExitFullscreen )
        {
            this._fsDoc.msExitFullscreen();
            return;
        }
    }
}
