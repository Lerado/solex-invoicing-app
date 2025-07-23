import { isObject, isArray, every } from 'lodash-es';

export function hasOnlyKeysDeep(obj: unknown, allowedKeys: string[]): boolean {
    if (!isObject(obj)) return true;

    if (isArray(obj)) {
        return obj.every(item => hasOnlyKeysDeep(item, allowedKeys));
    }

    // Now we know obj is a plain object
    return every(obj, (value, key) => {
        if (!allowedKeys.includes(key)) return false;

        return hasOnlyKeysDeep(value, allowedKeys);
    });
}
