<template>
  <button
    class="back-to-top"
    :class="{ visible }"
    aria-label="回到页面顶部"
    title="回到顶部"
    @click="$emit('click')"
  >↑</button>
</template>

<script setup>
defineProps({ visible: { type: Boolean, default: false } })
defineEmits(['click'])
</script>
