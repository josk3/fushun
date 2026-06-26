import { ref, onMounted, onUnmounted } from 'vue'

export function useCarousel(totalSlides, interval = 4800) {
  const currentSlide = ref(0)
  let timer = null

  const goTo = (index) => {
    currentSlide.value = ((index % totalSlides) + totalSlides) % totalSlides
  }

  const next = () => goTo(currentSlide.value + 1)

  const start = () => {
    stop()
    timer = setInterval(next, interval)
  }

  const stop = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const select = (index) => {
    goTo(index)
    start()
  }

  onMounted(start)
  onUnmounted(stop)

  return { currentSlide, select, goTo, next, start, stop }
}
