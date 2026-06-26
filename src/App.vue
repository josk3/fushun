<template>
  <div :class="layoutClass">
    <template v-if="!isAdmin">
      <PageLoader />
      <ScrollProgress :width="progressWidth" />
      <AppHeader />
    </template>
    <router-view />
    <template v-if="!isAdmin">
      <AppFooter />
      <BackToTop :visible="showBackToTop" @click="scrollToTop" />
    </template>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useScrollEffects } from '@/composables/useScrollEffects'
import PageLoader from '@/components/PageLoader.vue'
import ScrollProgress from '@/components/ScrollProgress.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import BackToTop from '@/components/BackToTop.vue'

const route = useRoute()
const { progressWidth, showBackToTop, scrollToTop } = useScrollEffects()

const layoutClass = computed(() => {
  const layout = route.meta.layout || 'default'
  if (layout === 'home') return 'official-home'
  if (layout === 'info') return 'official-info-page'
  if (layout === 'admin') return 'admin-layout'
  return 'layout-default'
})

const isAdmin = computed(() => route.meta.layout === 'admin')

// Update body class for CSS compatibility
watch(layoutClass, (cls, oldCls) => {
  if (oldCls) document.body.classList.remove(oldCls)
  document.body.classList.add(cls)
}, { immediate: true })
</script>
