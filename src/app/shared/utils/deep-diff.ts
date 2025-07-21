import { transform, isObject, isEqual, isEmpty } from 'lodash-es';

export function deepDiff(obj1, obj2) {
  return transform(obj2, (result, value, key) => {
    const oldValue = obj1[key];

    if (isObject(value) && isObject(oldValue)) {
      const diff = deepDiff(oldValue, value);
      if (!isEmpty(diff)) {
        result[key] = diff;
      }
    } else if (!isEqual(value, oldValue)) {
      result[key] = value;
    }
  }, {});
}
