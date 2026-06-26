<template>
  <div class="scroll-progress" :style="{ width }" aria-hidden="true"></div>
</template>

<script setup>
defineProps({ width: { type: String, default: '0%' } })
</script>
