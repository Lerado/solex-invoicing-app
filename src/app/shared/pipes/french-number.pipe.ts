import { Pipe, PipeTransform } from '@angular/core';
import FrenchNumbersToWords from 'french-numbers-to-words';

@Pipe({
    name: 'frenchNumber',
    pure: true
})
export class FrenchNumberPipe implements PipeTransform {

    private readonly _converter = new FrenchNumbersToWords('fr');

    transform(value: number, locale: 'fr' | 'be' = 'fr', returnType: 'full' | 'parts' = 'full'): string | any {
        if (value === null || value === undefined || isNaN(value)) {
            return '';
        }

        try {
            let converter;
            // Create converter with specified locale if different from default
            if (locale !== 'fr') {
                converter = new FrenchNumbersToWords(locale);
            }
            else {
                converter = this._converter;
            }
            const result = converter.convert(value);
            return returnType === 'full' ? (result.fullText as string).replaceAll('-', ' ') : result;
        } catch (error) {
            console.error('Error converting number to French words:', error);
            return value.toString();
        }
    }
}
