import type { Item } from './types'

export class TreeStore {
  private items: Item[] = []
  private map: Map<Item['id'], Item> = new Map()
  private childrenMap: Map<Item['id'], Item[]> = new Map()

  private rebuildIndex() {
    this.map.clear()
    this.childrenMap.clear()

    for (const item of this.items) {
      this.map.set(item.id, item)

      if (item.parent !== null) {
        if (!this.childrenMap.has(item.parent)) {
          this.childrenMap.set(item.parent, [])
        }
        this.childrenMap.get(item.parent)!.push(item)
      }
    }
  }

  getAll() {
    return this.items
  }

  getItem(id: Item['id']) {
    return this.map.get(id) || null
  }

  getChildren(id: Item['id']) {
    return this.childrenMap.get(id) || []
  }

  getAllChildren(id: Item['id']) {
    const result: Item[] = []
    const stack = [...this.getChildren(id)]

    while (stack.length) {
      const child = stack.pop()!
      result.push(child)

      const sub = this.childrenMap.get(child.id)
      if (sub) stack.push(...sub)
    }

    return result
  }

  getAllParents(id: Item['id']) {
    const result: Item[] = []
    let current = this.map.get(id)

    while (current && current.parent !== null) {
      const parent = this.map.get(current.parent)
      if (!parent) break
      result.push(parent)
      current = parent
    }

    return result
  }

  addItem(item: Item) {
    this.items.push(item)
    this.map.set(item.id, item)

    if (item.parent !== null) {
      if (!this.childrenMap.has(item.parent)) {
        this.childrenMap.set(item.parent, [])
      }
      this.childrenMap.get(item.parent)!.push(item)
    }

    return item
  }

  removeItem(id: Item['id']) {
    const toDelete = new Set<Item['id']>([id])
    const stack = [...(this.childrenMap.get(id) || [])]

    while (stack.length) {
      const child = stack.pop()!
      toDelete.add(child.id)

      const sub = this.childrenMap.get(child.id)
      if (sub) stack.push(...sub)
    }

    this.items = this.items.filter(item => !toDelete.has(item.id))

    this.rebuildIndex()
    return true
  }

  updateItem(updatedItem: Partial<Item> & { id: Item['id'] }) {
    const old = this.map.get(updatedItem.id)
    if (!old) return false

    const oldParent = old.parent

    Object.assign(old, updatedItem)

    if (updatedItem.parent !== undefined && updatedItem.parent !== oldParent) {
      this.rebuildIndex()
    }

    return old
  }

  constructor(items: Item[]) {
    this.items = items
    this.rebuildIndex()
  }
}
