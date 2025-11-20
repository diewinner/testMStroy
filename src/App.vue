<template>
  <ag-grid-vue
    class="ag-theme-alpine"
    style="width: 100%; height: 600px"
    :columnDefs="columnDefs"
    :rowData="items"
    :treeData="true"
    :getDataPath="getDataPath"
    :autoGroupColumnDef="autoGroupColumnDef"
    :animateRows="true"
    :getRowId="getRowId"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import 'ag-grid-enterprise'
import { ColDef, ModuleRegistry } from 'ag-grid-community'
import { AllCommunityModule } from 'ag-grid-community'
import { AllEnterpriseModule } from 'ag-grid-enterprise'
import { AgGridVue } from 'ag-grid-vue3'
import { Item } from '@/types/main.types'

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule])

const items = ref<Item[]>([
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cee', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '91064cee', label: 'Айтем 4' },
  { id: 5, parent: '91064cee', label: 'Айтем 5' },
  { id: 6, parent: '91064cee', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
])

const columnDefs = ref<ColDef[]>([
  {
    headerName: '№ п/п',
    valueGetter: params => params.node.rowIndex + 1,
    pinned: 'left',
    width: 100,
  },
  {
    headerName: 'Категория',
    width: 150,
    valueGetter: params => {
      const hasChildren = items.value.some(i => i.parent === params.data?.id)
      return hasChildren ? 'Группа' : 'Элемент'
    },
  },
  {
    field: 'label',
    headerName: 'Наименование',
    hide: true,
    flex: 1,
  },
])

// Auto group column — отображает дерево
const autoGroupColumnDef = ref<ColDef>({
  headerName: 'Наименование',
  field: 'label',
  cellRendererParams: {
    suppressCount: true,
  },
})

const getDataPath = data => {
  const path = []
  const map = Object.fromEntries(items.value.map(i => [i.id, i]))
  let current = data

  while (current) {
    path.unshift(current.label)
    current = map[current.parent] || null
  }

  return path
}

const getRowId = params => params.data.id
</script>
