<template>
  <div class="dashboard-container">
    <div class="toolbar mb-6 flex-between">
      <h2 class="page-title">СЕРВИС ПОСТАВОК <span class="jp-title">供給サービス</span></h2>
      <div class="flex gap-2">
        <TacticalButton variant="outline" size="sm" @click="syncLegacyStock">
          <RefreshCw :class="{ 'animate-spin': stocks.sync }" class="mr-2" size="14" />
          СИНХР. РАСПРЕДЕЛЕНИЕ
        </TacticalButton>
        <router-link to="/supplytasks/dashboard">
          <TacticalButton variant="outline" size="sm">
            <List class="mr-2" size="14" />
            СПИСОК СКЛАДОВ
          </TacticalButton>
        </router-link>
        <router-link to="/newsupplytask2/">
          <TacticalButton variant="primary" size="sm">
            <Plus class="mr-2" size="14" />
            НОВАЯ ПОСТАВКА
          </TacticalButton>
        </router-link>
      </div>
    </div>

    <Notifications />

    <div class="dashboard-grid mb-8">
      <!-- SECTION 1: STATUS TILES -->
      
      <!-- Products -->
      <div class="tech-tile">
        <div class="tech-header flex-between">
          <span class="tech-meta">[PRD.01] 商品</span>
          <button @click="syncProducts" :disabled="products.sync" class="icon-btn">
            <RefreshCw :class="{ 'animate-spin': products.sync }" size="14" />
          </button>
        </div>
        <div class="tech-body">
          <span class="tech-label">ТОВАРЫ</span>
          <span class="tech-value">{{ products.qty }}</span>
        </div>
        <div class="tech-footer">
          <div class="tech-line"></div>
          <span class="tech-trend">{{ products.date }}</span>
        </div>
        <div class="tech-corner top-left"></div>
        <div class="tech-corner bottom-right"></div>
      </div>

      <!-- Warehouses -->
      <div class="tech-tile">
        <div class="tech-header flex-between">
          <span class="tech-meta">[WRH.02] 倉庫</span>
          <button @click="syncWarehouses" :disabled="warehouses.total.sync" class="icon-btn">
            <RefreshCw :class="{ 'animate-spin': warehouses.total.sync }" size="14" />
          </button>
        </div>
        <div class="tech-body">
          <span class="tech-label">СКЛАДЫ</span>
          <span class="tech-value text-accent">{{ warehouses.total.qty }}</span>
        </div>
        <div class="tech-footer">
          <div class="tech-line"></div>
          <span class="tech-trend">{{ warehouses.total.date }}</span>
        </div>
        <div class="tech-corner top-left"></div>
        <div class="tech-corner bottom-right"></div>
      </div>

      <!-- WB Stocks -->
      <div class="tech-tile">
        <div class="tech-header flex-between">
          <span class="tech-meta">[WBS.03] WB在庫</span>
          <button @click="syncStocks" :disabled="stocks.sync" class="icon-btn">
            <RefreshCw :class="{ 'animate-spin': stocks.sync }" size="14" />
          </button>
        </div>
        <div class="tech-body">
          <span class="tech-label">ОСТАТКИ WB</span>
          <span class="tech-value text-warning">{{ wbstocks.qty }}</span>
        </div>
        <div class="tech-footer">
          <div class="tech-line"></div>
          <span class="tech-trend">{{ wbstocks.date }}</span>
        </div>
        <div class="tech-corner top-left"></div>
        <div class="tech-corner bottom-right"></div>
      </div>

      <!-- Ozon Stocks -->
      <div class="tech-tile">
        <div class="tech-header flex-between">
          <span class="tech-meta">[OZS.04] OZON在庫</span>
          <button @click="syncStocks" :disabled="stocks.sync" class="icon-btn">
            <RefreshCw :class="{ 'animate-spin': stocks.sync }" size="14" />
          </button>
        </div>
        <div class="tech-body">
          <span class="tech-label">ОСТАТКИ OZON</span>
          <span class="tech-value text-blue-400">{{ ozonstocks.qty }}</span>
        </div>
        <div class="tech-footer">
          <div class="tech-line"></div>
          <span class="tech-trend">{{ ozonstocks.date }}</span>
        </div>
        <div class="tech-corner top-left"></div>
        <div class="tech-corner bottom-right"></div>
      </div>

      <!-- Goals -->
      <div class="tech-tile">
        <div class="tech-header flex-between">
          <span class="tech-meta">[GOL.05] 目標</span>
          <button @click="syncGoals" :disabled="stocks.sync" class="icon-btn">
            <RefreshCw :class="{ 'animate-spin': stocks.sync }" size="14" />
          </button>
        </div>
        <div class="tech-body">
          <span class="tech-label">ЦЕЛИ</span>
          <span class="tech-value text-success">{{ goals.qty }}</span>
        </div>
        <div class="tech-footer">
          <div class="tech-line"></div>
          <span class="tech-trend">{{ goals.date }}</span>
        </div>
        <div class="tech-corner top-left"></div>
        <div class="tech-corner bottom-right"></div>
      </div>
    </div>

    <!-- Unaccepted Tasks -->
    <TacticalCard title="Непринятые Задания" subtitle="ТРЕБУЕТСЯ ДЕЙСТВИЕ">
      <TacticalTable :columns="taskColumns" :data="supplytasks">
        <template #warehouse_name="{ row }">
          <router-link :to="'/supplytask/'+row.id" class="text-accent hover:underline">
            {{ row.warehouse_name }}
          </router-link>
        </template>
        <template #actions="{ row }">
          <div class="flex gap-2 justify-end">
            <router-link :to="'/supplytask/'+row.id" title="Открыть">
              <button class="icon-btn"><ExternalLink size="16" /></button>
            </router-link>
            <router-link :to="'/newsupplytask2/'+row.warehouse_id+'/'+row.id" title="Добавка">
              <button class="icon-btn"><PlusCircle size="16" /></button>
            </router-link>
            <button class="icon-btn text-danger" @click="deleteTask(row.id)" title="Удалить">
              <Trash2 size="16" />
            </button>
          </div>
        </template>
      </TacticalTable>
      
      <div v-if="supplytasks.length === 0" class="text-center py-8 text-muted font-mono">
        НЕТ АКТИВНЫХ ЗАДАНИЙ
      </div>
    </TacticalCard>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import mpr from '@/tools/mpr'
import moment from 'moment'
import Notifications from '@/components/Notifications.vue'
import TacticalButton from '@/components/TacticalButton.vue'
import TacticalCard from '@/components/TacticalCard.vue'
import TacticalTable from '@/components/TacticalTable.vue'
import { RefreshCw, List, Plus, ExternalLink, PlusCircle, Trash2 } from 'lucide-vue-next'

const store = useStore()

const products = reactive({ qty: '...', date: '', sync: false })
const warehouses = reactive({
  wb: { qty: '...', date: '' },
  ozon: { qty: '...', date: '' },
  total: { qty: '...', date: '', sync: false }
})
const stocks = reactive({ qty: '...', date: '', sync: false })
const wbstocks = reactive({ qty: '...', date: '', sync: false })
const ozonstocks = reactive({ qty: '...', date: '', sync: false })
const goals = reactive({ qty: '...', date: '', sync: false })
const supplytasks = ref([])

const taskColumns = [
  { key: 'id', label: '#', class: 'w-16' },
  { key: 'warehouse_name', label: 'СКЛАД' },
  { key: 'qty_amount', label: 'КОЛ-ВО', class: 'w-24' },
  { key: 'start_date', label: 'СОЗДАНО', class: 'w-32' },
  { key: 'finish_date', label: 'ПРИЕМКА', class: 'w-32' },
  { key: 'actions', label: 'ДЕЙСТВИЯ', class: 'w-32 text-right' }
]

const addNotification = (type, text) => {
  store.dispatch('add', { type, text })
}

const deleteTask = (id) => {
  if (confirm("Точно хотите удалить это задание к перемещению?")) {
    mpr({
      url: '/supplytask/'+id,
      method: 'delete',
    }).then(res => {
      getSupplytasks()
      addNotification('success', 'Задание успешно удалено')
    })
  }
}

const syncProducts = () => {
  products.sync = true
  mpr({ url: '/automation/products/sync' })
    .then(res => {
      updateDashboard()
      products.sync = false
    })
    .catch(error => {
      products.sync = false
      addNotification('error', 'Синхронизация затянулась: ' + JSON.stringify(error))
    })
}

const syncWarehouses = () => {
  warehouses.total.sync = true
  mpr({ url: '/automation/warehouses/sync' })
    .then(res => {
      updateDashboard()
      warehouses.total.sync = false
    })
    .catch(error => {
      warehouses.total.sync = false
      addNotification('error', 'Синхронизация затянулась: ' + JSON.stringify(error))
    })
}

const syncStocks = () => {
  stocks.sync = true
  mpr({ url: '/automation/stocks/sync' })
    .then(res => {
      updateDashboard()
      stocks.sync = false
    })
    .catch(error => {
      stocks.sync = false
      addNotification('error', 'Синхронизация затянулась: ' + JSON.stringify(error))
    })
}

const syncLegacyStock = () => {
  stocks.sync = true
  mpr({ url: '/automation/stockslegacy/sync' })
    .then(res => {
      addNotification('success', 'Запустил синхронизацию, скоро придет сообщение в телеграм')
    })
    .catch(error => {
      addNotification('error', 'Синхронизация затянулась: ' + JSON.stringify(error))
    })
}

const syncGoals = () => {
  stocks.sync = true
  mpr({ url: '/automation/goals/sync' })
    .then(res => {
      addNotification('success', 'Запустил синхронизацию, скоро придет сообщение в телеграм')
      updateDashboard()
      stocks.sync = false
    })
    .catch(error => {
      stocks.sync = false
      addNotification('error', 'Синхронизация затянулась: ' + JSON.stringify(error))
    })
}

const getSupplytasks = () => {
  mpr({ url: '/supplytasks/list' })
    .then(res => {
      supplytasks.value = res.data
    })
}

const updateDashboard = () => {
  getSupplytasks()
  mpr({ url: '/dashboard/' })
    .then(res => {
      if (res.data.dashboard !== undefined) {
        for (const item of res.data.dashboard) {
          let date = item.last_updated.split('z').length > 1 ? item.last_updated.slice(0,-5) : item.last_updated
          const formattedDate = moment(date).format('DD.MM.YYYY HH:mm')
          
          switch (item.name) {
            case 'warehouses': 
              warehouses.total.qty = item.qty
              warehouses.total.date = formattedDate
              break
            case 'ozon': 
              warehouses.ozon.qty = item.qty
              warehouses.ozon.date = formattedDate
              break
            case 'wb': 
              warehouses.wb.qty = item.qty
              warehouses.wb.date = formattedDate
              break
            case 'products':
              products.qty = item.qty
              products.date = formattedDate
              break
            case 'wbstocks':
              wbstocks.qty = item.qty
              wbstocks.date = formattedDate
              break
            case 'ozonstocks':
              ozonstocks.qty = item.qty
              ozonstocks.date = formattedDate
              break
            case 'goals':
              goals.qty = item.qty
              goals.date = formattedDate
              break
          }
        }
      }
    })
}

onMounted(() => {
  updateDashboard()
})
</script>

<style scoped>
.dashboard-container {
  padding-bottom: 40px;
}

.page-title {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-lg);
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--color-text-primary);
}

.jp-title {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 0.8em;
  opacity: 0.6;
  margin-left: var(--spacing-2);
  font-weight: normal;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-4);
}

/* Tech Tile Styles */
.tech-tile {
  position: relative;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: var(--spacing-3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 120px;
  transition: all 0.2s ease;
}

.tech-tile:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background-color: rgba(255, 255, 255, 0.02);
}

.tech-header {
  margin-bottom: var(--spacing-2);
}

.tech-meta {
  font-family: var(--font-family-mono);
  font-size: 0.6rem;
  color: var(--color-text-muted);
  letter-spacing: 1px;
}

.tech-body {
  display: flex;
  flex-direction: column;
  margin-bottom: auto;
}

.tech-label {
  font-family: var(--font-family-mono);
  font-size: 0.65rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.tech-value {
  font-family: var(--font-family-mono);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-text-primary);
}

.tech-footer {
  margin-top: var(--spacing-2);
}

.tech-line {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  width: 100%;
  margin-bottom: 4px;
}

.tech-trend {
  font-family: var(--font-family-mono);
  font-size: 0.6rem;
  color: var(--color-text-muted);
  float: right;
}

/* Tech Corners */
.tech-corner {
  position: absolute;
  width: 4px;
  height: 4px;
  border: 1px solid var(--color-text-primary);
  background-color: var(--color-bg-primary);
}

.tech-corner.top-left {
  top: -1px;
  left: -1px;
  border-right: none;
  border-bottom: none;
}

.tech-corner.bottom-right {
  bottom: -1px;
  right: -1px;
  border-left: none;
  border-top: none;
}

.icon-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.icon-btn:hover:not(:disabled) {
  color: var(--color-text-primary);
}

.icon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon-btn.text-danger:hover {
  color: var(--color-accent-danger);
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-accent { color: var(--color-accent-primary); }
.text-warning { color: var(--color-accent-warning); }
.text-success { color: var(--color-accent-success); }
.text-muted { color: var(--color-text-muted); }
.text-blue-400 { color: #60a5fa; }
</style>