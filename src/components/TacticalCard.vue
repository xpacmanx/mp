<template>
  <div class="tactical-card" :class="{ 'has-header': !!title }">
    <div v-if="title" class="tactical-card-header">
      <div class="header-content">
        <h3 class="title">{{ title }}</h3>
        <div class="subtitle" v-if="subtitle">{{ subtitle }}</div>
      </div>
      <div class="header-actions" v-if="$slots.actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <div v-else-if="$slots.header" class="tactical-card-header">
      <slot name="header"></slot>
    </div>
    <div class="tactical-card-body">
      <slot></slot>
    </div>
    <!-- Decorative corners -->
    <div class="corner top-left"></div>
    <div class="corner top-right"></div>
    <div class="corner bottom-left"></div>
    <div class="corner bottom-right"></div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String
})
</script>

<style scoped>
.tactical-card {
  background-color: var(--color-bg-panel);
  border: 1px solid var(--color-border-subtle);
  position: relative;
  overflow: hidden;
}

.tactical-card-header {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--color-border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%);
}

.title {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: 2px;
}

.tactical-card-body {
  padding: var(--spacing-4);
}

/* Decorative Corners */
.corner {
  position: absolute;
  width: 6px;
  height: 6px;
  pointer-events: none;
}

.top-left {
  top: 0;
  left: 0;
  border-top: 2px solid var(--color-accent-primary);
  border-left: 2px solid var(--color-accent-primary);
}

.top-right {
  top: 0;
  right: 0;
  border-top: 2px solid var(--color-border-strong);
  border-right: 2px solid var(--color-border-strong);
}

.bottom-left {
  bottom: 0;
  left: 0;
  border-bottom: 2px solid var(--color-border-strong);
  border-left: 2px solid var(--color-border-strong);
}

.bottom-right {
  bottom: 0;
  right: 0;
  border-bottom: 2px solid var(--color-accent-primary);
  border-right: 2px solid var(--color-accent-primary);
}
</style>
