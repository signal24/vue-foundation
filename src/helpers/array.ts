type ArraySearchPredicate<T> = Parameters<T[]['findIndex']>[0];
export function replaceElement<T>(array: T[], oldElement: T | ArraySearchPredicate<T>, newElement: T) {
    const index = typeof oldElement === 'function' ? array.findIndex(oldElement as any) : array.indexOf(oldElement);
    if (index === -1) return false;
    array.splice(index, 1, newElement);
    return true;
}
