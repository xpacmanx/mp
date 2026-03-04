<template>
  <div class="dashboard-container">
    <div class="toolbar mb-4 flex-between">
      <h2 class="page-title">ОБЗОР СИСТЕМЫ</h2>
    </div>

    <div class="dashboard-grid">
      <!-- SECTION 1: QUICK STATUS (TILES) -->
      <div class="tech-tile">
        <div class="tech-header flex-between">
          <span class="tech-meta">[SYS.01] システム</span>
          <span class="tech-icon">⚡</span>
        </div>
        <div class="tech-body">
          <span class="tech-label">СТАТУС</span>
          <span class="tech-value">ОНЛАЙН</span>
        </div>
        <div class="tech-footer">
          <div class="tech-line"></div>
          <span class="tech-trend">98% АПТАЙМ</span>
        </div>
        <div class="tech-corner top-left"></div>
        <div class="tech-corner bottom-right"></div>
      </div>

      <div class="tech-tile">
        <div class="tech-header flex-between">
          <span class="tech-meta">[QUE.02] 待機列</span>
          <span class="tech-icon">📥</span>
        </div>
        <div class="tech-body">
          <span class="tech-label">ОЧЕРЕДЬ</span>
          <span class="tech-value text-warning">1,248</span>
        </div>
        <div class="tech-footer">
          <div class="tech-line"></div>
          <span class="tech-trend text-warning">↗ +12%</span>
        </div>
        <div class="tech-corner top-left"></div>
        <div class="tech-corner bottom-right"></div>
      </div>

      <div class="tech-tile">
        <div class="tech-header flex-between">
          <span class="tech-meta">[SPD.03] 転送速度</span>
          <span class="tech-icon">🚀</span>
        </div>
        <div class="tech-body">
          <span class="tech-label">СКОРОСТЬ</span>
          <span class="tech-value">842</span>
        </div>
        <div class="tech-footer">
          <div class="tech-line"></div>
          <span class="tech-trend">ЭЛ/СЕК</span>
        </div>
        <div class="tech-corner top-left"></div>
        <div class="tech-corner bottom-right"></div>
      </div>

      <!-- SECTION 2: DETAILED METRICS (CARDS) -->
      <TacticalCard title="Статус Синхронизации" subtitle="ПРЯМОЕ ПОДКЛЮЧЕНИЕ">
        <div class="metric-large">
          <span class="value text-accent">ОНЛАЙН</span>
          <span class="label">98% АПТАЙМ</span>
        </div>
        <div class="progress-bar mt-4">
          <div class="progress-fill" style="width: 98%"></div>
        </div>
      </TacticalCard>

      <TacticalCard title="Очередь" subtitle="РАЗМЕР ОЧЕРЕДИ">
        <div class="metric-large">
          <span class="value text-warning">1,248</span>
          <span class="label">ЭЛЕМЕНТОВ</span>
        </div>
        <div class="trend-indicator up">
          ▲ 12% ЗА ПОСЛЕДНИЙ ЧАС
        </div>
      </TacticalCard>

      <TacticalCard title="Пропускная Способность" subtitle="ЭЛЕМЕНТОВ / СЕК">
        <div class="metric-large">
          <span class="value text-success">842</span>
          <span class="label">СКОРОСТЬ</span>
        </div>
        <div class="mini-chart">
          <div v-for="n in 10" :key="n" class="bar" :style="{ height: Math.random() * 100 + '%' }"></div>
        </div>
      </TacticalCard>

      <TacticalCard title="Ошибки" subtitle="ЗА 24 ЧАСА">
        <div class="metric-large">
          <span class="value text-danger">0.02%</span>
          <span class="label">КРИТИЧЕСКИЕ</span>
        </div>
        <div class="error-log">
          <div class="log-item">ERROR_TIMEOUT_0x4F</div>
          <div class="log-item">RETRY_PACKET_22</div>
        </div>
      </TacticalCard>

      <!-- Middle Row: Main Chart -->
      <div class="grid-col-span-2">
        <TacticalCard title="Трафик Синхронизации" subtitle="МОНИТОРИНГ В РЕАЛЬНОМ ВРЕМЕНИ">
          <template #actions>
            <div class="flex gap-2">
              <TacticalButton variant="outline" size="sm" @click="showModal = true">ТЕСТ МОДАЛ</TacticalButton>
              <TacticalBadge variant="primary" outline>1Ч</TacticalBadge>
              <TacticalBadge variant="neutral">24Ч</TacticalBadge>
              <TacticalBadge variant="neutral">7Д</TacticalBadge>
            </div>
          </template>
          <div class="chart-container" :class="{ 'compact-chart': viewMode === 'compact' }">
            <!-- Mock Chart SVG -->
            <svg viewBox="0 0 1000 200" class="line-chart">
              <defs>
                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="var(--color-accent-primary)" stop-opacity="0.2"/>
                  <stop offset="100%" stop-color="var(--color-accent-primary)" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,150 Q100,100 200,140 T400,100 T600,50 T800,120 T1000,80 V200 H0 Z" fill="url(#gradient)" />
              <path d="M0,150 Q100,100 200,140 T400,100 T600,50 T800,120 T1000,80" fill="none" stroke="var(--color-accent-primary)" stroke-width="2" />
              
              <!-- Grid Lines -->
              <line x1="0" y1="50" x2="1000" y2="50" stroke="var(--color-border-subtle)" stroke-dasharray="5,5" />
              <line x1="0" y1="100" x2="1000" y2="100" stroke="var(--color-border-subtle)" stroke-dasharray="5,5" />
              <line x1="0" y1="150" x2="1000" y2="150" stroke="var(--color-border-subtle)" stroke-dasharray="5,5" />
            </svg>
          </div>
        </TacticalCard>
      </div>

      <TacticalModal v-model="showModal" title="СИСТЕМНОЕ ОПОВЕЩЕНИЕ">
        <p>ТРЕБУЕТСЯ ПОДТВЕРЖДЕНИЕ</p>
        <p class="text-muted mt-2">Запустить полное диагностическое сканирование системы? Эта операция может повлиять на производительность.</p>
        <template #footer>
          <TacticalButton variant="secondary" @click="showModal = false">ОТМЕНА</TacticalButton>
          <TacticalButton variant="primary" @click="showModal = false">ПОДТВЕРДИТЬ</TacticalButton>
        </template>
      </TacticalModal>

      <TacticalCard title="Региональное Распределение" subtitle="АКТИВНЫЕ УЗЛЫ">
        <div class="region-list" :class="{ 'compact-list': viewMode === 'compact' }">
          <div class="region-item" v-for="region in regions" :key="region.name">
            <div class="flex-between mb-1">
              <span class="text-mono text-xs">{{ region.name }}</span>
              <span class="text-mono text-xs text-accent">{{ region.value }}%</span>
            </div>
            <div class="progress-bar sm">
              <div class="progress-fill" :style="{ width: region.value + '%' }"></div>
            </div>
          </div>
        </div>
      </TacticalCard>

      <!-- Bottom Row: Recent Activity -->
      <div class="grid-col-span-3">
        <TacticalCard title="Системные Логи" subtitle="ПОСЛЕДНИЕ СОБЫТИЯ">
          <TacticalTable :columns="logColumns" :data="logs">
            <template #status="{ value }">
              <TacticalBadge :variant="getLogVariant(value)">{{ value }}</TacticalBadge>
            </template>
          </TacticalTable>
        </TacticalCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TacticalCard from '@/components/TacticalCard.vue'
import TacticalBadge from '@/components/TacticalBadge.vue'
import TacticalTable from '@/components/TacticalTable.vue'
import TacticalButton from '@/components/TacticalButton.vue'
import TacticalModal from '@/components/TacticalModal.vue'

const showModal = ref(false)

const regions = [
  { name: 'СЕВЕРНАЯ_АМЕРИКА', value: 78 },
  { name: 'ЗАПАДНАЯ_ЕВРОПА', value: 62 },
  { name: 'АЗИАТСКО_ТИХООКЕАНСКИЙ', value: 45 },
  { name: 'ЮЖНАЯ_ЛАТАМ', value: 23 }
]

const logColumns = [
  { key: 'time', label: 'ВРЕМЯ', class: 'w-32' },
  { key: 'level', label: 'УРОВЕНЬ', class: 'w-24' },
  { key: 'module', label: 'МОДУЛЬ', class: 'w-32' },
  { key: 'message', label: 'СООБЩЕНИЕ' },
  { key: 'status', label: 'СТАТУС', class: 'w-24 text-right' }
]

const logs = [
  { time: '14:22:01', level: 'ИНФО', module: 'SYNC_CORE', message: 'Пакет #4922 успешно обработан', status: 'ЗАВЕРШЕНО' },
  { time: '14:21:45', level: 'ПРЕД', module: 'NET_LAYER', message: 'Высокая задержка на узле US-EAST-2', status: 'ВНИМАНИЕ' },
  { time: '14:20:12', level: 'ИНФО', module: 'AUTH_SVC', message: 'Сессия пользователя обновлена', status: 'ЗАВЕРШЕНО' },
  { time: '14:18:55', level: 'ОШИБКА', module: 'DB_SHARD', message: 'Тайм-аут соединения, повторная попытка...', status: 'СБОЙ' },
  { time: '14:15:30', level: 'ИНФО', module: 'SYNC_CORE', message: 'Пакет #4921 успешно обработан', status: 'ЗАВЕРШЕНО' }
]

const getLogVariant = (status) => {
  switch(status) {
    case 'ЗАВЕРШЕНО': return 'success'
    case 'ВНИМАНИЕ': return 'warning'
    case 'СБОЙ': return 'danger'
    default: return 'neutral'
  }
}
</script>

<style scoped>
.page-title {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-lg);
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--color-text-primary);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-6);
  transition: gap 0.3s ease;
}

.dashboard-grid.is-compact {
  gap: var(--spacing-3);
}

.grid-col-span-2 { grid-column: span 2; }
.grid-col-span-3 { grid-column: span 3; }

.metric-large {
  display: flex;
  flex-direction: column;
}

.metric-large.compact-metric {
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
}

.metric-large .value {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-3xl);
  font-weight: 700;
  line-height: 1;
}

.metric-large.compact-metric .value {
  font-size: var(--font-size-xl);
}

.metric-large .label {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  margin-top: var(--spacing-1);
  letter-spacing: 1px;
}

.progress-bar {
  height: 4px;
  background-color: var(--color-bg-tertiary);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar.sm { height: 2px; }

.progress-fill {
  height: 100%;
  background-color: var(--color-accent-primary);
  box-shadow: 0 0 10px var(--color-accent-primary);
}

.trend-indicator {
  font-size: var(--font-size-xs);
  color: var(--color-accent-success);
  margin-top: var(--spacing-2);
  font-family: var(--font-family-mono);
}

.mini-chart {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 30px;
  margin-top: var(--spacing-2);
}

.mini-chart .bar {
  flex: 1;
  background-color: var(--color-accent-success);
  opacity: 0.6;
}

.error-log {
  margin-top: var(--spacing-2);
  font-family: var(--font-family-mono);
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

.chart-container {
  height: 200px;
  width: 100%;
  transition: height 0.3s ease;
}

.chart-container.compact-chart {
  height: 120px;
}

.line-chart {
  width: 100%;
  height: 100%;
}

.region-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.region-list.compact-list {
  gap: var(--spacing-2);
}

/* Technical Label Tile Styles */
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

.tech-icon {
  font-size: 1rem;
  opacity: 0.8;
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
</style>
