<template>
  <button 
    class="tactical-btn" 
    :class="[variant, size, { 'is-icon': iconOnly }]"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary', // primary, secondary, danger, outline
    validator: (value) => ['primary', 'secondary', 'danger', 'outline', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
  },
  disabled: Boolean,
  iconOnly: Boolean
})
</script>

<style scoped>
.tactical-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-mono);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  position: relative;
  overflow: hidden;
}

/* Sizes */
.sm {
  height: 28px;
  padding: 0 var(--spacing-3);
  font-size: var(--font-size-xs);
}

.md {
  height: 36px;
  padding: 0 var(--spacing-4);
  font-size: var(--font-size-sm);
}

.lg {
  height: 44px;
  padding: 0 var(--spacing-6);
  font-size: var(--font-size-base);
}

.is-icon {
  padding: 0;
  width: 36px; /* Match height of md */
}
.is-icon.sm { width: 28px; }
.is-icon.lg { width: 44px; }

/* Variants */
.primary {
  background-color: var(--color-accent-primary);
  color: var(--color-text-inverse);
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}

.primary:hover:not(:disabled) {
  background-color: #33f3ff;
  box-shadow: var(--shadow-glow-blue);
}

.secondary {
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-strong);
  color: var(--color-text-primary);
}

.secondary:hover:not(:disabled) {
  border-color: var(--color-text-primary);
  background-color: var(--color-border-subtle);
}

.danger {
  background-color: var(--color-accent-secondary);
  color: #fff;
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}

.danger:hover:not(:disabled) {
  background-color: #ff3360;
  box-shadow: var(--shadow-glow-red);
}

.outline {
  background: transparent;
  border: 1px solid var(--color-accent-primary);
  color: var(--color-accent-primary);
}

.outline:hover:not(:disabled) {
  background: rgba(0, 240, 255, 0.1);
  box-shadow: var(--shadow-glow-blue);
}

.ghost {
  background: transparent;
  color: var(--color-text-secondary);
}

.ghost:hover:not(:disabled) {
  color: var(--color-text-primary);
  background: rgba(255,255,255,0.05);
}

/* Disabled */
.tactical-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(1);
}
</style>
