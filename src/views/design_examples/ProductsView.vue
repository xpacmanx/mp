<template>
  <div class="products-container">
    <div class="toolbar mb-4 flex-between">
      <h2 class="page-title">КАТАЛОГ ТОВАРОВ <span class="jp-title">製品カタログ</span></h2>
      <div class="toolbar-actions flex gap-2">
        <div class="search-box">
          <input type="text" placeholder="Поиск по SKU или названию..." />
          <span class="search-icon"><Search size="16" /></span>
        </div>
        <TacticalButton variant="primary" size="sm">ДОБАВИТЬ</TacticalButton>
      </div>
    </div>

    <div class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-image">
          <div class="placeholder-img">IMG</div>
          <div class="product-badge" :class="product.stockStatus">{{ product.stockStatusLabel }}</div>
        </div>
        <div class="product-details">
          <div class="product-sku">{{ product.sku }}</div>
          <div class="product-name">{{ product.name }}</div>
          <div class="product-price">₽ {{ product.price.toLocaleString() }}</div>
        </div>
        <div class="product-actions">
          <button class="action-btn">EDIT</button>
          <button class="action-btn">VIEW</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TacticalButton from '@/components/TacticalButton.vue'
import { Search } from 'lucide-vue-next'

const products = ref([
  { id: 1, sku: 'TLQ-001', name: 'Quantum Processor Unit', price: 45000, stockStatus: 'in-stock', stockStatusLabel: 'В НАЛИЧИИ' },
  { id: 2, sku: 'TLQ-002', name: 'Neural Interface Kit', price: 12500, stockStatus: 'low-stock', stockStatusLabel: 'МАЛО' },
  { id: 3, sku: 'TLQ-003', name: 'Optical Sensor Array', price: 8900, stockStatus: 'in-stock', stockStatusLabel: 'В НАЛИЧИИ' },
  { id: 4, sku: 'TLQ-004', name: 'Haptic Feedback Glove', price: 21000, stockStatus: 'out-of-stock', stockStatusLabel: 'НЕТ В НАЛИЧИИ' },
  { id: 5, sku: 'TLQ-005', name: 'Cyberdeck Chassis', price: 34000, stockStatus: 'in-stock', stockStatusLabel: 'В НАЛИЧИИ' },
  { id: 6, sku: 'TLQ-006', name: 'Cooling Module Mk.IV', price: 5600, stockStatus: 'in-stock', stockStatusLabel: 'В НАЛИЧИИ' },
  { id: 7, sku: 'TLQ-007', name: 'Data Shard (1TB)', price: 2500, stockStatus: 'low-stock', stockStatusLabel: 'МАЛО' },
  { id: 8, sku: 'TLQ-008', name: 'Bio-Monitor Patch', price: 1200, stockStatus: 'in-stock', stockStatusLabel: 'В НАЛИЧИИ' },
])
</script>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--spacing-4);
}

.product-card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  transition: transform 0.2s, border-color 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-accent-primary);
}

.product-image {
  height: 160px;
  background-color: #000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-img {
  color: var(--color-text-muted);
  font-family: var(--font-family-mono);
  font-size: 1.5rem;
  opacity: 0.3;
}

.product-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 0.6rem;
  font-family: var(--font-family-mono);
  padding: 2px 6px;
  border-radius: 2px;
  font-weight: 700;
}

.product-badge.in-stock {
  background-color: rgba(0, 255, 157, 0.2);
  color: var(--color-accent-success);
}

.product-badge.low-stock {
  background-color: rgba(255, 204, 0, 0.2);
  color: var(--color-accent-warning);
}

.product-badge.out-of-stock {
  background-color: rgba(255, 59, 48, 0.2);
  color: var(--color-accent-danger);
}

.product-details {
  padding: var(--spacing-3);
}

.product-sku {
  font-family: var(--font-family-mono);
  font-size: 0.7rem;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.product-name {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  font-family: var(--font-family-mono);
  font-weight: 700;
  color: var(--color-accent-primary);
}

.product-actions {
  display: flex;
  border-top: 1px solid var(--color-border-subtle);
}

.action-btn {
  flex: 1;
  background: none;
  border: none;
  padding: 8px;
  color: var(--color-text-secondary);
  font-size: 0.7rem;
  font-family: var(--font-family-mono);
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
}

.action-btn:first-child {
  border-right: 1px solid var(--color-border-subtle);
}

.jp-title {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 0.8em;
  opacity: 0.6;
  margin-left: var(--spacing-2);
}

.search-box {
  position: relative;
  width: 250px;
}

.search-box input {
  width: 100%;
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-subtle);
  padding: 6px 30px 6px 10px;
  border-radius: var(--border-radius-sm);
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
  font-size: 0.8rem;
}

.search-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  opacity: 0.5;
}
</style>
