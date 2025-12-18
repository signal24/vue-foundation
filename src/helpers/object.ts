import { cloneDeep, isEqual, isMatch } from 'lodash';

export function cloneProp<T>(prop: T | undefined | null, fallback: T): T {
    if (prop !== undefined && prop !== null) {
        return cloneDeep(prop);
    } else {
        return fallback;
    }
}

export function nullifyEmptyInputs<T extends Record<string, unknown>, K extends keyof T>(obj: T, fields: K[]): T {
    const result = { ...obj };
    for (const key of fields) {
        if (result[key] === '') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            result[key] = null as any;
        }
    }
    return result;
}

export function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

export function objectKeys<T extends object>(object: T): (keyof T)[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Object.keys(object) as any[];
}

export function objectAssign<T extends object>(object: T, ...values: Partial<T>[]): T {
    return Object.assign(object, ...values);
}

type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];
export function objectEntries<T extends object>(object: T): Entries<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Object.entries(object) as any;
}

export function extractValues<T extends object, K extends readonly (keyof T)[]>(state: T, fields: K): Pick<T, K[number]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: Pick<T, K[number]> = {} as any;
    for (const key of fields) {
        if (state[key] !== undefined) {
            result[key] = state[key];
        }
    }
    return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function doesMatch(original: any, updated: any, method?: 'equals' | 'matches'): boolean {
    if (method === 'matches' && typeof original === 'object' && typeof updated === 'object') {
        return isMatch(original, updated);
    }
    return isEqual(original, updated);
}

export function extractUpdates<T extends object>(state: T, updates: Partial<T>, fields?: Array<keyof T>, method?: 'equals' | 'matches'): Partial<T> {
    const result: Partial<T> = {};
    const updateFields = fields ?? objectKeys(updates);
    for (const key of updateFields) {
        if (updates[key] !== undefined && !doesMatch(state[key], updates[key], method)) {
            result[key] = updates[key];
        }
    }
    return result;
}

export function patchObject<T extends object>(state: T, updates: Partial<T>, fields?: Array<keyof T>, method?: 'equals' | 'matches'): T {
    const effectiveUpdates = extractUpdates(state, updates, fields, method);
    objectAssign(state, effectiveUpdates);
    return state;
}

export function extractKV<T, K extends keyof T, V extends keyof T>(arr: T[], keyCol: K, valCol: V) {
    return arr.reduce(
        (acc, cur) => {
            acc[cur[keyCol] as string] = cur[valCol];
            return acc;
        },
        {} as Record<string, T[V]>
    );
}
