import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollEffects() {
  const isScrolled = ref(false)
  const progressWidth = ref('0%')
  const showBackToTop = ref(false)

  const handleScroll = () => {
    const scrollTop = window.scrollY
    isScrolled.value = scrollTop > 48
    showBackToTop.value = scrollTop > 420

    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    progressWidth.value = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : '0%'
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { isScrolled, progressWidth, showBackToTop, scrollToTop }
}
