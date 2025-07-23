import { isArray, isEqual, isEmpty, isObject, transform } from 'lodash-es';

export function diffDeep<T extends object>(
    base: T,
    updated: T,
    alwaysInclude: string[] = []
): Partial<T> {
    // Handle arrays differently from objects
    if (isArray(updated) && isArray(base)) {
        const diffArray = updated.map((val, index) =>
            diffDeep(base[index], val, alwaysInclude)
        );

        // Include only if at least one element differs
        return diffArray.some(item => !isEmpty(item)) ? (diffArray as any) : {};
    }

    // If one is an array and the other is not, it's a full replace
    if (isArray(updated) || isArray(base)) {
        return !isEqual(updated, base) ? (updated as any) : {};
    }

    // For non-objects or mismatched types
    if (!isObject(updated) || !isObject(base)) {
        return !isEqual(updated, base) ? (updated as any) : {};
    }

    // Main object diff
    return transform(updated, (result, value, key) => {
        const baseValue = base[key as keyof T];
        const shouldAlwaysInclude = alwaysInclude.includes(key as string);

        const diff = diffDeep(baseValue as any, value as any, alwaysInclude);

        const shouldInclude =
            shouldAlwaysInclude || !isEmpty(diff) || !isEqual(value, baseValue);

        if (shouldInclude) {
            if (shouldAlwaysInclude && isEmpty(diff)) {
                // Just include the current value
                (result as any)[key] = value;
            } else {
                (result as any)[key] = diff;
            }
        }
    }, {} as Partial<T>);
}
