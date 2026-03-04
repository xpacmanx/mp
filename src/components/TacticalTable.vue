<template>
  <div class="tactical-table-container">
    <table class="tactical-table">
      <thead>
        <tr>
          <th 
            v-for="col in columns" 
            :key="col.key" 
            :class="[col.class, { 'cursor-pointer': col.sortable }]" 
            :style="col.style"
            @click="col.sortable && $emit('header-click', col.key)"
          >
            {{ col.label }}
            <slot name="header-icon" :column="col"></slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in data" :key="i">
          <td v-for="col in columns" :key="col.key" :class="col.class">
            <slot :name="col.key" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.tactical-table-container {
  width: 100%;
  overflow-x: auto;
  background-color: var(--color-bg-panel);
  border: 1px solid var(--color-border-subtle);
}

.tactical-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
}

th {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  padding: var(--spacing-3) var(--spacing-4);
  text-align: left;
  border-bottom: 1px solid var(--color-border-strong);
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
}

td {
  padding: var(--spacing-3) var(--spacing-4);
  border-bottom: 1px solid var(--color-border-subtle);
  color: var(--color-text-primary);
}

tr:hover td {
  background-color: rgba(255, 255, 255, 0.03);
}

tr:last-child td {
  border-bottom: none;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
}
</style>
