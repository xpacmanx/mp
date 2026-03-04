<template>
  <div class="system-health-container">
    <div class="toolbar mb-4 flex-between">
      <h2 class="page-title">СОСТОЯНИЕ СИСТЕМЫ <span class="jp-title">システム状態</span></h2>
      <div class="last-updated text-muted text-sm">
        ОБНОВЛЕНО: 14:42:05
      </div>
    </div>

    <div class="health-grid">
      <!-- 1. WB DATA -->
      <TacticalCard title="Данные WB" subtitle="WILDBERRIES API">
        <template #header-right>
          <span class="status-badge status-normal">NORMAL [正常]</span>
        </template>
        
        <div class="section-content">
          <div class="health-metric mb-4">
            <span class="label">ОШИБКИ API (24Ч)</span>
            <span class="value text-success">0%</span>
          </div>

          <h4 class="subsection-title">ВНУТРЕННИЕ ТАБЛИЦЫ</h4>
          <ul class="status-list mb-4">
            <li class="status-item">
              <span class="item-name">Товары (Products)</span>
              <span class="item-status text-success">SYNCED</span>
            </li>
            <li class="status-item">
              <span class="item-name">Заказы (Orders)</span>
              <span class="item-status text-success">SYNCED</span>
            </li>
            <li class="status-item">
              <span class="item-name">Склады (Warehouses)</span>
              <span class="item-status text-warning">SYNCING...</span>
            </li>
          </ul>

          <h4 class="subsection-title">АВТОМАТИЗАЦИЯ</h4>
          <ul class="status-list">
            <li class="status-item">
              <span class="item-name">Price Updater Bot</span>
              <span class="item-status text-accent">RUNNING</span>
            </li>
            <li class="status-item">
              <span class="item-name">Stock Sync Worker</span>
              <span class="item-status text-accent">RUNNING</span>
            </li>
          </ul>
        </div>
      </TacticalCard>

      <!-- 2. OZON DATA -->
      <TacticalCard title="Данные Ozon" subtitle="OZON SELLER API">
        <template #header-right>
          <span class="status-badge status-warning">WARNING [警告]</span>
        </template>
        
        <div class="section-content">
          <div class="health-metric mb-4">
            <span class="label">ОШИБКИ API (24Ч)</span>
            <span class="value text-warning">2.4%</span>
          </div>

          <h4 class="subsection-title">ВНУТРЕННИЕ ТАБЛИЦЫ</h4>
          <ul class="status-list mb-4">
            <li class="status-item">
              <span class="item-name">Товары (Products)</span>
              <span class="item-status text-success">SYNCED</span>
            </li>
            <li class="status-item">
              <span class="item-name">FBO Остатки</span>
              <span class="item-status text-danger">ERROR</span>
            </li>
          </ul>

          <h4 class="subsection-title">АВТОМАТИЗАЦИЯ</h4>
          <ul class="status-list">
            <li class="status-item">
              <span class="item-name">Ozon Order Fetcher</span>
              <span class="item-status text-accent">RUNNING</span>
            </li>
          </ul>
        </div>
      </TacticalCard>

      <!-- 3. MARKETING -->
      <TacticalCard title="Маркетинг" subtitle="ADVERTISING & PROMO">
        <template #header-right>
          <span class="status-badge status-normal">NORMAL [正常]</span>
        </template>
        
        <div class="section-content">
          <div class="health-metric mb-4">
            <span class="label">АКТИВНЫЕ КАМПАНИИ</span>
            <span class="value text-accent">12</span>
          </div>

          <h4 class="subsection-title">ВНУТРЕННИЕ ТАБЛИЦЫ</h4>
          <ul class="status-list mb-4">
            <li class="status-item">
              <span class="item-name">Рекламные Кабинеты</span>
              <span class="item-status text-success">CONNECTED</span>
            </li>
            <li class="status-item">
              <span class="item-name">Статистика (Stats)</span>
              <span class="item-status text-success">UPDATED</span>
            </li>
          </ul>

          <h4 class="subsection-title">АВТОМАТИЗАЦИЯ</h4>
          <ul class="status-list">
            <li class="status-item">
              <span class="item-name">Bid Manager (Biddr)</span>
              <span class="item-status text-muted">PAUSED</span>
            </li>
          </ul>
        </div>
      </TacticalCard>

      <!-- 4. PRODUCTION -->
      <TacticalCard title="Производство" subtitle="MANUFACTURING">
        <template #header-right>
          <span class="status-badge status-normal">NORMAL [正常]</span>
        </template>
        
        <div class="section-content">
          <div class="health-metric mb-4">
            <span class="label">ЗАГРУЗКА ЦЕХА</span>
            <span class="value text-success">85%</span>
          </div>

          <h4 class="subsection-title">ВНУТРЕННИЕ ТАБЛИЦЫ</h4>
          <ul class="status-list mb-4">
            <li class="status-item">
              <span class="item-name">Сырье (Raw Materials)</span>
              <span class="item-status text-success">OK</span>
            </li>
            <li class="status-item">
              <span class="item-name">План Производства</span>
              <span class="item-status text-success">APPROVED</span>
            </li>
          </ul>

          <h4 class="subsection-title">АВТОМАТИЗАЦИЯ</h4>
          <ul class="status-list">
            <li class="status-item">
              <span class="item-name">Supply Chain Alert</span>
              <span class="item-status text-accent">RUNNING</span>
            </li>
          </ul>
        </div>
      </TacticalCard>

      <!-- 5. FINANCE -->
      <TacticalCard title="Финансы" subtitle="FINANCIAL DATA">
        <template #header-right>
          <span class="status-badge status-danger">CRITICAL [危険]</span>
        </template>
        
        <div class="section-content">
          <div class="health-metric mb-4">
            <span class="label">РАСХОЖДЕНИЕ</span>
            <span class="value text-danger">₽ 142,000</span>
          </div>

          <h4 class="subsection-title">ВНУТРЕННИЕ ТАБЛИЦЫ</h4>
          <ul class="status-list mb-4">
            <li class="status-item">
              <span class="item-name">Транзакции (Bank)</span>
              <span class="item-status text-success">SYNCED</span>
            </li>
            <li class="status-item">
              <span class="item-name">Отчеты Реализации</span>
              <span class="item-status text-danger">MISMATCH</span>
            </li>
          </ul>

          <h4 class="subsection-title">АВТОМАТИЗАЦИЯ</h4>
          <ul class="status-list">
            <li class="status-item">
              <span class="item-name">Daily P&L Report</span>
              <span class="item-status text-danger">FAILED</span>
            </li>
          </ul>
        </div>
      </TacticalCard>
    </div>
  </div>
</template>

<script setup>
import TacticalCard from '@/components/TacticalCard.vue'
</script>

<style scoped>
.health-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-4);
}

.jp-title {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 0.8em;
  opacity: 0.6;
  margin-left: var(--spacing-2);
}

.status-badge {
  font-family: var(--font-family-mono);
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 2px;
  font-weight: 700;
}

.status-normal {
  color: var(--color-accent-success);
  border: 1px solid var(--color-accent-success);
  background: rgba(0, 255, 157, 0.1);
}

.status-warning {
  color: var(--color-accent-warning);
  border: 1px solid var(--color-accent-warning);
  background: rgba(255, 204, 0, 0.1);
}

.status-danger {
  color: var(--color-accent-danger);
  border: 1px solid var(--color-accent-danger);
  background: rgba(255, 59, 48, 0.1);
}

.health-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-2);
  border-bottom: 1px solid var(--color-border-subtle);
}

.health-metric .label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.health-metric .value {
  font-family: var(--font-family-mono);
  font-weight: 700;
}

.subsection-title {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  margin-bottom: var(--spacing-2);
  letter-spacing: 1px;
}

.status-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.status-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  padding: 4px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}

.status-item:last-child {
  border-bottom: none;
}

.item-name {
  color: var(--color-text-primary);
}

.item-status {
  font-family: var(--font-family-mono);
  font-size: 0.75rem;
}
</style>
