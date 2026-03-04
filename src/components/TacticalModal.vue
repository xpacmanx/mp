<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button class="close-btn" @click="$emit('update:modelValue', false)">×</button>
        </div>
        
        <div class="modal-body">
          <slot></slot>
        </div>
        
        <div class="modal-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>

        <!-- Decorators -->
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: String
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-container {
  background-color: var(--color-bg-panel);
  border: 1px solid var(--color-border-subtle);
  width: 100%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.modal-header {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--color-border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%);
}

.modal-title {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover {
  color: var(--color-accent-primary);
}

.modal-body {
  padding: var(--spacing-6);
  color: var(--color-text-primary);
}

.modal-footer {
  padding: var(--spacing-4);
  border-top: 1px solid var(--color-border-subtle);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
}

/* Decorators */
.corner {
  position: absolute;
  width: 10px;
  height: 10px;
  pointer-events: none;
}

.top-left {
  top: -1px;
  left: -1px;
  border-top: 2px solid var(--color-accent-primary);
  border-left: 2px solid var(--color-accent-primary);
}

.top-right {
  top: -1px;
  right: -1px;
  border-top: 2px solid var(--color-accent-primary);
  border-right: 2px solid var(--color-accent-primary);
}

.bottom-left {
  bottom: -1px;
  left: -1px;
  border-bottom: 2px solid var(--color-accent-primary);
  border-left: 2px solid var(--color-accent-primary);
}

.bottom-right {
  bottom: -1px;
  right: -1px;
  border-bottom: 2px solid var(--color-accent-primary);
  border-right: 2px solid var(--color-accent-primary);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95) translateY(10px);
}
</style>
