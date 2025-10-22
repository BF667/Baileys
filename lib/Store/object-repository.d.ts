import type { proto } from '../../WAProto/index.js';

export interface Comparable<T, K> {
    key: (item: T) => K
    compare: (k1: K, k2: K) => number
}

export declare class ObjectRepository<T extends object> {
    readonly entityMap: Map<string, T>
    constructor(entities?: Record<string, T>)
    findById(id: string): T | undefined
    findAll(): T[]
    upsertById(id: string, entity: T): Map<string, T>
    deleteById(id: string): boolean
    count(): number
    toJSON(): T[]
}