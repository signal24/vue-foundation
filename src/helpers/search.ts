import { unref } from 'vue';
import type { MaybeRef } from 'vue';

export interface SearchOptions<T> {
    items: MaybeRef<T[]>;
    searchText: MaybeRef<string>;
    searchFields?: (keyof T)[];
}

export function search<T>(options: SearchOptions<T>) {
    const items = unref(options.items);
    const searchText = unref(options.searchText);
    const searchFields = options.searchFields;

    if (!searchText) {
        return items;
    }

    const lowerCaseSearchText = searchText.toLowerCase();

    return items.filter(item => {
        if (searchFields) {
            return searchFields.some(field => {
                const value = item[field];
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(lowerCaseSearchText);
                }
                return false;
            });
        }

        if (typeof item === 'string') {
            return item.toLowerCase().includes(lowerCaseSearchText);
        }

        return false;
    });
}
