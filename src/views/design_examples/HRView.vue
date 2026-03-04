<template>
  <div class="hr-container">
    <div class="toolbar mb-6 flex-between">
      <div class="search-box">
        <input type="text" placeholder="ПОИСК ПО ID..." class="tactical-input" />
      </div>
      <div class="filters flex gap-2">
        <TacticalButton variant="outline" size="sm">ВСЕ</TacticalButton>
        <TacticalButton variant="ghost" size="sm">АКТИВНЫЕ</TacticalButton>
        <TacticalButton variant="ghost" size="sm">ВНЕ СЛУЖБЫ</TacticalButton>
      </div>
    </div>

    <div class="employee-grid">
      <div v-for="emp in employees" :key="emp.id" class="employee-card">
        <div class="card-header flex-between">
          <span class="id-tag">{{ emp.id }}</span>
          <TacticalBadge :variant="getStatusVariant(emp.status)" outline>{{ emp.status }}</TacticalBadge>
        </div>
        
        <div class="card-body">
          <div class="avatar-placeholder">
            <span class="initials">{{ emp.name.split(' ').map(n => n[0]).join('') }}</span>
            <div class="status-indicator" :class="getStatusClass(emp.status)"></div>
          </div>
          
          <div class="info">
            <h3 class="name">{{ emp.name }}</h3>
            <div class="role">{{ emp.role }}</div>
            <div class="clearance">ДОСТУП: <span :class="getClearanceClass(emp.clearance)">{{ emp.clearance }}</span></div>
          </div>
        </div>

        <div class="card-footer">
          <div class="stat">
            <span class="label">МИССИИ</span>
            <span class="value">{{ emp.missions }}</span>
          </div>
          <div class="stat">
            <span class="label">РЕЙТИНГ</span>
            <span class="value">{{ emp.rating }}</span>
          </div>
          <TacticalButton variant="ghost" size="sm" iconOnly>></TacticalButton>
        </div>
        
        <!-- Decorators -->
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TacticalButton from '@/components/TacticalButton.vue'
import TacticalBadge from '@/components/TacticalBadge.vue'

const employees = [
  { id: 'OP-772', name: 'АЛЕКС ЧЕН', role: 'СИСТЕМНЫЙ АРХИТЕКТОР', status: 'АКТИВЕН', clearance: 'L4', missions: 42, rating: '9.8' },
  { id: 'OP-891', name: 'САРА КОННОР', role: 'НАЧАЛЬНИК ОХРАНЫ', status: 'АКТИВЕН', clearance: 'L5', missions: 128, rating: '9.9' },
  { id: 'OP-112', name: 'ДЖОН ДОУ', role: 'ОФИЦЕР ЛОГИСТИКИ', status: 'ВНЕ СЛУЖБЫ', clearance: 'L3', missions: 15, rating: '8.5' },
  { id: 'OP-334', name: 'ЭЛЛЕН РИПЛИ', role: 'ПОЛЕВОЙ СПЕЦИАЛИСТ', status: 'ПРОПАЛ', clearance: 'L4', missions: 56, rating: '9.7' },
  { id: 'OP-556', name: 'РИК ДЕКАРД', role: 'СЛЕДОВАТЕЛЬ', status: 'ОТСТРАНЕН', clearance: 'L2', missions: 89, rating: '7.2' },
  { id: 'OP-998', name: 'М. КУСАНАГИ', role: 'ТАКТИЧЕСКИЙ ЛИДЕР', status: 'АКТИВЕН', clearance: 'L5', missions: 210, rating: '10.0' },
]

const getStatusVariant = (status) => {
  switch(status) {
    case 'АКТИВЕН': return 'success'
    case 'ВНЕ СЛУЖБЫ': return 'neutral'
    case 'ПРОПАЛ': return 'danger'
    case 'ОТСТРАНЕН': return 'warning'
    default: return 'neutral'
  }
}

const getStatusClass = (status) => {
  switch(status) {
    case 'АКТИВЕН': return 'bg-success'
    case 'ВНЕ СЛУЖБЫ': return 'bg-neutral'
    case 'ПРОПАЛ': return 'bg-danger'
    case 'ОТСТРАНЕН': return 'bg-warning'
    default: return 'bg-neutral'
  }
}

const getClearanceClass = (level) => {
  if (level === 'L5') return 'text-danger'
  if (level === 'L4') return 'text-warning'
  return 'text-accent'
}
</script>

<style scoped>
.tactical-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border-strong);
  color: var(--color-text-primary);
  padding: var(--spacing-2) var(--spacing-4);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  width: 300px;
  outline: none;
}

.tactical-input:focus {
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.1);
}

.employee-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

.employee-card {
  background-color: var(--color-bg-panel);
  border: 1px solid var(--color-border-subtle);
  position: relative;
  padding: var(--spacing-4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.employee-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  border-color: var(--color-border-strong);
}

.card-header {
  margin-bottom: var(--spacing-4);
}

.id-tag {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  letter-spacing: 1px;
}

.card-body {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-6);
}

.avatar-placeholder {
  width: 64px;
  height: 64px;
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-4);
  position: relative;
}

.initials {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

.status-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border: 2px solid var(--color-bg-panel);
  border-radius: 50%;
}

.bg-success { background-color: var(--color-accent-success); box-shadow: 0 0 5px var(--color-accent-success); }
.bg-neutral { background-color: var(--color-text-muted); }
.bg-danger { background-color: var(--color-accent-secondary); box-shadow: 0 0 5px var(--color-accent-secondary); }
.bg-warning { background-color: var(--color-accent-warning); box-shadow: 0 0 5px var(--color-accent-warning); }

.info {
  flex: 1;
}

.name {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.role {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  margin-bottom: var(--spacing-2);
}

.clearance {
  font-family: var(--font-family-mono);
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-border-subtle);
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat .label {
  font-size: 0.6rem;
  color: var(--color-text-muted);
  margin-bottom: 2px;
}

.stat .value {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border: 2px solid var(--color-accent-primary);
  opacity: 0.5;
}

.top-right { top: -1px; right: -1px; border-bottom: none; border-left: none; }
.bottom-left { bottom: -1px; left: -1px; border-top: none; border-right: none; }
</style>
