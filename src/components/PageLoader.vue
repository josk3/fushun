<template>
  <div class="page-loader" :class="{ loaded }" aria-hidden="true">
    <div class="loader-spinner"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loaded = ref(false)
onMounted(() => {
  window.addEventListener('load', () => { loaded.value = true })
  setTimeout(() => { loaded.value = true }, 1200)
})
</script>
