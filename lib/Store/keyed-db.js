// lib/Store/keyed-db.js

/**
 * A simple, in-memory, sorted database implementation.
 * Replicates the core functionality of @adiwajshing/keyed-db.
 */
export class KeyedDB {
    /**
     * @param {{ key: (item: any) => string, compare: (a: string, b: string) => number }} keyConfig
     * @param {(item: any) => string} getId
     */
    constructor(keyConfig, getId) {
        this.keyConfig = keyConfig;
        this.getId = getId;
        this.itemsById = new Map(); // For O(1) lookups by ID
        this.sortedItems = [];      // For maintaining sorted order
    }

    /**
     * Inserts an item, maintaining the sorted order.
     * @param {any} item
     */
    _insertSorted(item) {
        const key = this.keyConfig.key(item);
        let low = 0, high = this.sortedItems.length;

        // Binary search to find the insertion point
        while (low < high) {
            const mid = (low + high) >>> 1;
            if (this.keyConfig.compare(key, this.keyConfig.key(this.sortedItems[mid])) < 0) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        this.sortedItems.splice(low, 0, item);
        this.itemsById.set(this.getId(item), item);
    }

    /**
     * Updates an existing item in the sorted array.
     * @param {any} item
     */
    _updateSorted(item) {
        const oldItem = this.itemsById.get(this.getId(item));
        if (!oldItem) return;

        const oldKey = this.keyConfig.key(oldItem);
        const newKey = this.keyConfig.key(item);

        // If the key hasn't changed, we don't need to re-sort
        if (oldKey === newKey) {
            Object.assign(oldItem, item);
            return;
        }

        // Find and remove the old item
        const index = this.sortedItems.indexOf(oldItem);
        if (index > -1) {
            this.sortedItems.splice(index, 1);
        }
        // Insert the updated item in its new correct position
        this._insertSorted(item);
    }

    upsert(...items) {
        for (const item of items) {
            const id = this.getId(item);
            if (this.itemsById.has(id)) {
                this._updateSorted(item);
            } else {
                this._insertSorted(item);
            }
        }
    }

    insertIfAbsent(...items) {
        for (const item of items) {
            const id = this.getId(item);
            if (!this.itemsById.has(id)) {
                this._insertSorted(item);
            }
        }
    }

    update(id, updateFn) {
        const item = this.itemsById.get(id);
        if (item) {
            const updatedItem = { ...item };
            updateFn(updatedItem);
            this._updateSorted(updatedItem);
            return true;
        }
        return false;
    }

    get(id) {
        return this.itemsById.get(id);
    }

    delete(id) {
        const item = this.itemsById.get(id);
        if (item) {
            this.itemsById.delete(id);
            const index = this.sortedItems.indexOf(item);
            if (index > -1) {
                this.sortedItems.splice(index, 1);
            }
            return true;
        }
        return false;
    }
    
    deleteById(id) {
        return this.delete(id);
    }

    clear() {
        this.itemsById.clear();
        this.sortedItems.length = 0;
    }

    filter(predicate) {
        const filteredItems = this.sortedItems.filter(predicate);
        return new FilteredResult(filteredItems);
    }

    all() {
        return [...this.sortedItems];
    }

    get array() {
        return this.sortedItems;
    }
}

/**
 * A simple wrapper for filtered results, mimicking the original library's API.
 */
class FilteredResult {
    constructor(items) {
        this.items = items;
    }

    all() {
        return this.items;
    }
}
