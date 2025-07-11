<template>
  <div>
    <h4>Тест исправления vue-preview--fill</h4>
    
    <input type="file" @change="loadImage" accept="image/*" />
    
    <div v-if="src" style="margin-top: 20px;">
      <div style="height: 400px; border: 2px solid blue; position: relative;">
        <Cropper
          :src="src"
          :stencil-props="{ aspectRatio: 1 }"
          style="width: 100%; height: 100%;"
        />
      </div>
      
      <div style="margin-top: 10px; font-size: 12px; color: #666;">
        Проверьте в инспекторе: класс .vue-preview--fill должен иметь высоту!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const src = ref('')

const loadImage = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      src.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
</script> 