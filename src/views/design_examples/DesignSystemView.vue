<template>
  <div class="design-system-container">
    <div class="toolbar mb-4 flex-between">
      <h2 class="page-title">DESIGN SYSTEM <span class="jp-title">デザインシステム</span></h2>
    </div>

    <div class="ds-section">
      <h3 class="ds-header">01. TYPOGRAPHY</h3>
      <div class="ds-grid">
        <div class="ds-card">
          <h1>Heading 1 (Page Title)</h1>
          <h2>Heading 2 (Section Title)</h2>
          <h3>Heading 3 (Card Title)</h3>
          <p class="text-body">Body text. The quick brown fox jumps over the lazy dog. 0123456789.</p>
          <p class="text-mono">Monospace text. SYSTEM_READY. 127.0.0.1</p>
          <p class="text-muted">Muted text. Secondary information.</p>
        </div>
      </div>
    </div>

    <div class="ds-section">
      <h3 class="ds-header">02. COLORS</h3>
      <div class="ds-grid colors-grid">
        <div class="color-swatch" style="background: var(--color-bg-primary)">
          <span>BG Primary</span>
          <span class="hex">#0a0a0a</span>
        </div>
        <div class="color-swatch" style="background: var(--color-bg-secondary)">
          <span>BG Secondary</span>
          <span class="hex">#111111</span>
        </div>
        <div class="color-swatch" style="background: var(--color-accent-primary); color: black">
          <span>Accent Primary</span>
          <span class="hex">#ffffff</span>
        </div>
        <div class="color-swatch" style="background: var(--color-accent-success); color: black">
          <span>Success</span>
          <span class="hex">#00ff9d</span>
        </div>
        <div class="color-swatch" style="background: var(--color-accent-warning); color: black">
          <span>Warning</span>
          <span class="hex">#ffcc00</span>
        </div>
        <div class="color-swatch" style="background: var(--color-accent-danger); color: white">
          <span>Danger</span>
          <span class="hex">#ff3b30</span>
        </div>
      </div>
    </div>

    <div class="ds-section">
      <h3 class="ds-header">03. COMPONENTS</h3>
      <div class="ds-grid">
        <!-- Buttons -->
        <TacticalCard title="Buttons" subtitle="INTERACTIVE ELEMENTS">
          <div class="flex gap-2 mb-4">
            <TacticalButton variant="primary">PRIMARY</TacticalButton>
            <TacticalButton variant="secondary">SECONDARY</TacticalButton>
            <TacticalButton variant="danger">DANGER</TacticalButton>
          </div>
          <div class="flex gap-2">
            <TacticalButton variant="primary" size="sm">SMALL</TacticalButton>
            <TacticalButton variant="secondary" size="sm">SMALL</TacticalButton>
          </div>
        </TacticalCard>

        <!-- Inputs -->
        <TacticalCard title="Inputs" subtitle="DATA ENTRY">
          <div class="flex flex-col gap-4">
            <input type="text" class="tactical-input" placeholder="Text Input..." />
            <div class="search-box">
              <input type="text" placeholder="Search..." />
              <span class="search-icon"><Search size="16" /></span>
            </div>
          </div>
        </TacticalCard>

        <!-- Badges -->
        <TacticalCard title="Badges" subtitle="STATUS INDICATORS">
          <div class="flex gap-2 flex-wrap">
            <span class="status-badge status-normal">NORMAL</span>
            <span class="status-badge status-warning">WARNING</span>
            <span class="status-badge status-critical">CRITICAL</span>
            <span class="status-badge status-offline">OFFLINE</span>
          </div>
        </TacticalCard>
      </div>
    </div>

    <div class="ds-section">
      <h3 class="ds-header">04. ICONS (LUCIDE)</h3>
      <div class="ds-grid icons-grid">
        <div class="icon-item"><LayoutDashboard /><span>Dashboard</span></div>
        <div class="icon-item"><Users /><span>Users</span></div>
        <div class="icon-item"><Activity /><span>Activity</span></div>
        <div class="icon-item"><Settings /><span>Settings</span></div>
        <div class="icon-item"><ShoppingBag /><span>Shopping</span></div>
        <div class="icon-item"><Truck /><span>Truck</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TacticalCard from '@/components/TacticalCard.vue'
import TacticalButton from '@/components/TacticalButton.vue'
import { 
  Search, 
  LayoutDashboard, 
  Users, 
  Activity, 
  Settings, 
  ShoppingBag, 
  Truck 
} from 'lucide-vue-next'
</script>

<style scoped>
.design-system-container {
  padding-bottom: 40px;
}

.ds-section {
  margin-bottom: 40px;
}

.ds-header {
  font-family: var(--font-family-mono);
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border-subtle);
  padding-bottom: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.ds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.ds-card {
  background: var(--color-bg-secondary);
  padding: 20px;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--border-radius-md);
}

.colors-grid {
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}

.color-swatch {
  height: 100px;
  border-radius: var(--border-radius-md);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px;
  font-family: var(--font-family-mono);
  font-size: 0.7rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.color-swatch .hex {
  opacity: 0.7;
}

.icons-grid {
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
  padding: 20px;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--border-radius-md);
  gap: 10px;
  color: var(--color-text-secondary);
}

.icon-item span {
  font-family: var(--font-family-mono);
  font-size: 0.7rem;
}

.tactical-input {
  width: 100%;
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-subtle);
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
  font-size: 0.9rem;
}

.search-box {
  position: relative;
}

.search-box input {
  width: 100%;
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-subtle);
  padding: 8px 30px 8px 12px;
  border-radius: var(--border-radius-sm);
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
  font-size: 0.9rem;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
}

.jp-title {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 0.8em;
  opacity: 0.6;
  margin-left: var(--spacing-2);
}
</style>
