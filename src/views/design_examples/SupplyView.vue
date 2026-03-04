<template>
  <div class="supply-container">
    <div class="toolbar mb-6 flex-between">
      <div class="left-controls flex gap-4">
        <div class="control-group">
          <label class="control-label">СКЛАД</label>
          <select class="tactical-select">
            <option>СЕКТОР_7_ГЛАВНЫЙ</option>
            <option>АВАНПОСТ_АЛЬФА</option>
            <option>ОРБИТАЛЬНЫЙ_ДОК_3</option>
          </select>
        </div>
        <div class="control-group">
          <label class="control-label">КАТЕГОРИЯ</label>
          <select class="tactical-select">
            <option>ВСЕ_МАТЕРИАЛЫ</option>
            <option>ВООРУЖЕНИЕ</option>
            <option>РАСХОДНИКИ</option>
            <option>СЫРЬЕ</option>
          </select>
        </div>
      </div>
      
      <div class="right-controls flex gap-2">
        <TacticalButton variant="primary" size="sm">ЭКСПОРТ</TacticalButton>
        <TacticalButton variant="secondary" size="sm">СИНХРОНИЗАЦИЯ</TacticalButton>
      </div>
    </div>

    <TacticalCard class="table-card">
      <div class="table-wrapper">
        <table class="tactical-table-complex">
          <thead>
            <tr>
              <th v-for="col in columns" :key="col.key" :class="{ 'sticky-left': col.sticky }">
                {{ col.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data" :key="row.id">
              <td v-for="col in columns" :key="col.key" :class="{ 'sticky-left': col.sticky, 'text-mono': true }">
                <span v-if="col.key === 'status'">
                  <TacticalBadge :variant="getStatusVariant(row[col.key])">{{ row[col.key] }}</TacticalBadge>
                </span>
                <span v-else>{{ row[col.key] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </TacticalCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TacticalCard from '@/components/TacticalCard.vue'
import TacticalButton from '@/components/TacticalButton.vue'
import TacticalBadge from '@/components/TacticalBadge.vue'

// Generate 30+ columns
const columns = [
  { key: 'id', label: 'ID', sticky: true },
  { key: 'code', label: 'КОД', sticky: true },
  { key: 'offer', label: 'ПРЕДЛОЖЕНИЕ' },
  { key: 'status', label: 'СТАТУС' },
  { key: 'warehouse_a', label: 'СКЛАД_А' },
  { key: 'warehouse_b', label: 'СКЛАД_Б' },
  { key: 'warehouse_c', label: 'СКЛАД_В' },
  { key: 'region_n', label: 'РЕГ_СЕВЕР' },
  { key: 'region_s', label: 'РЕГ_ЮГ' },
  { key: 'region_e', label: 'РЕГ_ВОСТОК' },
  { key: 'region_w', label: 'РЕГ_ЗАПАД' },
  { key: 'sales_d', label: 'ПРОДАЖИ_ДЕНЬ' },
  { key: 'sales_w', label: 'ПРОДАЖИ_НЕД' },
  { key: 'sales_m', label: 'ПРОДАЖИ_МЕС' },
  { key: 'prod_q1', label: 'ПРОИЗВ_Q1' },
  { key: 'prod_q2', label: 'ПРОИЗВ_Q2' },
  { key: 'prod_q3', label: 'ПРОИЗВ_Q3' },
  { key: 'prod_q4', label: 'ПРОИЗВ_Q4' },
  { key: 'transit_in', label: 'В_ПУТИ_ВХ' },
  { key: 'transit_out', label: 'В_ПУТИ_ИСХ' },
  { key: 'reserved', label: 'РЕЗЕРВ' },
  { key: 'damaged', label: 'ПОВРЕЖДЕНО' },
  { key: 'returned', label: 'ВОЗВРАТ' },
  { key: 'margin', label: 'МАРЖА_%' },
  { key: 'cost', label: 'СЕБЕСТОИМОСТЬ' },
  { key: 'price', label: 'ЦЕНА' },
  { key: 'supplier', label: 'ПОСТАВЩИК' },
  { key: 'eta', label: 'ПРИБЫТИЕ' },
  { key: 'batch', label: 'ПАРТИЯ' },
  { key: 'exp', label: 'ГОДЕН_ДО' },
  { key: 'notes', label: 'ПРИМЕЧАНИЯ' }
]

const data = ref([])

onMounted(() => {
  // Generate mock data
  data.value = Array.from({ length: 50 }, (_, i) => ({
    id: `SUP-${1000 + i}`,
    code: `MAT-${Math.floor(Math.random() * 9000) + 1000}`,
    offer: `Партия Поставки #${i + 1}`,
    status: Math.random() > 0.8 ? 'МАЛО' : Math.random() > 0.9 ? 'КРИТИЧНО' : 'НОРМА',
    warehouse_a: Math.floor(Math.random() * 1000),
    warehouse_b: Math.floor(Math.random() * 1000),
    warehouse_c: Math.floor(Math.random() * 1000),
    region_n: Math.floor(Math.random() * 500),
    region_s: Math.floor(Math.random() * 500),
    region_e: Math.floor(Math.random() * 500),
    region_w: Math.floor(Math.random() * 500),
    sales_d: Math.floor(Math.random() * 50),
    sales_w: Math.floor(Math.random() * 300),
    sales_m: Math.floor(Math.random() * 1200),
    prod_q1: Math.floor(Math.random() * 5000),
    prod_q2: Math.floor(Math.random() * 5000),
    prod_q3: Math.floor(Math.random() * 5000),
    prod_q4: Math.floor(Math.random() * 5000),
    transit_in: Math.floor(Math.random() * 200),
    transit_out: Math.floor(Math.random() * 200),
    reserved: Math.floor(Math.random() * 100),
    damaged: Math.floor(Math.random() * 10),
    returned: Math.floor(Math.random() * 20),
    margin: (Math.random() * 30 + 10).toFixed(1),
    cost: (Math.random() * 100).toFixed(2),
    price: (Math.random() * 200 + 50).toFixed(2),
    supplier: `VEND-${Math.floor(Math.random() * 99)}`,
    eta: '2025-12-10',
    batch: `B-${Math.floor(Math.random() * 99999)}`,
    exp: '2026-01-01',
    notes: '-'
  }))
})

const getStatusVariant = (status) => {
  switch(status) {
    case 'НОРМА': return 'success'
    case 'МАЛО': return 'warning'
    case 'КРИТИЧНО': return 'danger'
    default: return 'neutral'
  }
}
</script>

<style scoped>
.control-group {
  display: flex;
  flex-direction: column;
}

.control-label {
  font-family: var(--font-family-mono);
  font-size: 0.65rem;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.tactical-select {
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-strong);
  color: var(--color-text-primary);
  padding: 6px 12px;
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  min-width: 200px;
  outline: none;
  cursor: pointer;
}

.tactical-select:focus {
  border-color: var(--color-accent-primary);
}

.table-card {
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.table-wrapper {
  overflow: auto;
  height: 100%;
  width: 100%;
}

.tactical-table-complex {
  border-collapse: separate; /* Required for sticky */
  border-spacing: 0;
  width: max-content;
  font-family: var(--font-family-mono);
  font-size: 0.8rem;
}

.tactical-table-complex th {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  padding: var(--spacing-3) var(--spacing-4);
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--color-border-strong);
  border-right: 1px solid var(--color-border-subtle);
  position: sticky;
  top: 0;
  z-index: 10;
  white-space: nowrap;
}

.tactical-table-complex td {
  padding: var(--spacing-2) var(--spacing-4);
  border-bottom: 1px solid var(--color-border-subtle);
  border-right: 1px solid var(--color-border-subtle);
  color: var(--color-text-primary);
  white-space: nowrap;
}

.tactical-table-complex tr:hover td {
  background-color: rgba(255, 255, 255, 0.03);
}

/* Sticky Columns */
.sticky-left {
  position: sticky;
  left: 0;
  z-index: 5;
  background-color: var(--color-bg-panel); /* Match card bg */
}

th.sticky-left {
  z-index: 15; /* Higher than normal th and td */
  background-color: var(--color-bg-tertiary);
}

/* Handle second sticky column offset if needed, 
   but for simplicity we just stick the first one or use a library for complex multi-sticky.
   Here we'll just stick the first two manually if we knew widths, 
   but CSS sticky stacks automatically if left is defined. 
   Actually, without defined 'left' values, multiple stickies overlap.
   For this demo, I'll just stick the first column (ID).
*/

.sticky-left:nth-child(1) {
  left: 0;
  border-right: 2px solid var(--color-border-strong);
}

.sticky-left:nth-child(2) {
  /* If we want 2nd column sticky, we need to know width of 1st. 
     Let's just stick the first one for simplicity/robustness in pure CSS demo.
     Or I can hardcode widths. Let's stick just ID.
  */
  position: static; 
  border-right: 1px solid var(--color-border-subtle);
}
</style>
