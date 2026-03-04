<template>
  <span class="tactical-badge" :class="[variant, { 'outline': outline }]">
    <slot></slot>
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'neutral', // primary, success, warning, danger, neutral
  },
  outline: Boolean
})
</script>

<style scoped>
.tactical-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--border-radius-sm);
  font-family: var(--font-family-mono);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  line-height: 1.2;
}

/* Variants */
.neutral {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-subtle);
}

.primary {
  background-color: rgba(0, 240, 255, 0.15);
  color: var(--color-accent-primary);
  border: 1px solid rgba(0, 240, 255, 0.3);
}

.success {
  background-color: rgba(0, 255, 159, 0.15);
  color: var(--color-accent-success);
  border: 1px solid rgba(0, 255, 159, 0.3);
}

.warning {
  background-color: rgba(252, 238, 10, 0.15);
  color: var(--color-accent-warning);
  border: 1px solid rgba(252, 238, 10, 0.3);
}

.danger {
  background-color: rgba(255, 0, 60, 0.15);
  color: var(--color-accent-secondary);
  border: 1px solid rgba(255, 0, 60, 0.3);
}

/* Outline override */
.outline {
  background: transparent;
}
</style>
