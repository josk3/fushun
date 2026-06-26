<template>
  <div class="official-modal" :class="{ open }" :aria-hidden="!open">
    <div class="official-modal-backdrop" @click="close"></div>
    <div class="official-modal-card" role="dialog" aria-modal="true">
      <button class="official-modal-close" aria-label="关闭" @click="close">×</button>
      <div class="official-modal-content" v-html="content"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const open = ref(false)
const content = ref('')

const show = (html) => {
  content.value = html
  open.value = true
}

const close = () => {
  open.value = false
  content.value = ''
}

const onKeydown = (e) => {
  if (e.key === 'Escape') close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

defineExpose({ show, close })
</script>
