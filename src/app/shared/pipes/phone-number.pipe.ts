import { Pipe, PipeTransform } from '@angular/core';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

@Pipe({
    standalone: true,
    pure: true,
    name: 'phone'
})
export class PhoneNumberPipe implements PipeTransform {

    transform(value: unknown): unknown {

        if (!value.toString()) {
            return value;
        }

        const stringValue = value.toString();

        if (!isValidPhoneNumber(stringValue)) {
            return stringValue;

        }

        const parsedPhoneNumber = parsePhoneNumber(stringValue);

        return parsedPhoneNumber.formatInternational();
    }

}
