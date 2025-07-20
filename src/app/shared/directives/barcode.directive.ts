/* eslint-disable @angular-eslint/directive-selector */
// barcode.directive.ts
import { Directive, ElementRef, input, effect, inject, booleanAttribute, numberAttribute } from '@angular/core';
import JsBarcode from 'jsbarcode'; // cspell:disable-line

export type BarcodeFormat = 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC' | 'ITF' | 'MSI' | 'pharmacode' | 'codabar'; // cspell:disable-line

@Directive({
    selector: '[barcode]',
    standalone: true
})
export class BarcodeDirective {

    // Required input
    barcode = input.required<string>();

    // Optional configuration inputs
    barcodeFormat = input<BarcodeFormat>('CODE128');
    barcodeWidth = input(2, { transform: numberAttribute });
    barcodeHeight = input(50, { transform: numberAttribute });
    barcodeDisplayValue = input(false, { transform: booleanAttribute });
    barcodeFontSize = input(10, { transform: numberAttribute });
    barcodeMargin = input(0, { transform: numberAttribute });
    barcodeBackground = input<string>('#ffffff');
    barcodeLineColor = input<string>('#000000');

    private readonly _el = inject(ElementRef);

    /**
     * Constructor
     */
    constructor() {
        // Generate barcode whenever inputs change
        effect(() => {
            this._generateBarcode();
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Generate bar code and attach it to current element
     */
    private _generateBarcode(): void {

        const value = this.barcode();
        const element = this._el.nativeElement;

        if (!value || !element) return;

        try {
            JsBarcode(element, value, {
                format: this.barcodeFormat(),
                width: this.barcodeWidth(),
                height: this.barcodeHeight(),
                displayValue: this.barcodeDisplayValue(),
                fontSize: this.barcodeFontSize(),
                margin: this.barcodeMargin(),
                background: this.barcodeBackground(),
                lineColor: this.barcodeLineColor(),
            });
        } catch (error) {
            console.error('Error generating barcode:', error);
        }
    }
}
