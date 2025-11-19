export class TreeStore {
  items = []
  constructor(items) {
    this.items = items
  }

  getAll() {
    return this.items
  }

  // --- 2. Получить 1 элемент по id
  getItem(id) {
    return this.items.find(item => item.id === id) || null
  }

  // --- 3. Получить прямых детей
  getChildren(id) {
    return this.items.filter(item => item.parent === id)
  }

  // --- 4. Получить всех потомков (глубина любая)
  getAllChildren(id) {
    const result = []
    const stack = [...this.getChildren(id)]

    while (stack.length > 0) {
      const child = stack.pop()
      result.push(child)

      const subChildren = this.getChildren(child.id)
      stack.push(...subChildren)
    }

    return result
  }

  // --- 5. Получить всех родителей (вверх к корню)
  getAllParents(id) {
    const result = []
    let current = this.getItem(id)

    while (current && current.parent !== null) {
      const parent = this.getItem(current.parent)
      if (!parent) break
      result.push(parent)
      current = parent
    }

    return result
  }

  // --- 6. Добавить элемент
  addItem(item) {
    this.items.push(item)
    return item
  }

  // --- 7. Удалить элемент и всех его детей
  removeItem(id) {
    const toDelete = new Set([id])

    // Добавляем всех потомков
    const children = this.getAllChildren(id)
    children.forEach(c => toDelete.add(c.id))

    // Фильтруем массив
    this.items = this.items.filter(item => !toDelete.has(item.id))

    return true
  }

  // --- 8. Обновить элемент
  updateItem(updatedItem) {
    const index = this.items.findIndex(item => item.id === updatedItem.id)
    if (index === -1) return false

    this.items[index] = { ...this.items[index], ...updatedItem }
    return this.items[index]
  }
}
