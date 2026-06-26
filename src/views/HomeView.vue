<template>
  <main>
    <!-- Hero Carousel -->
    <section class="official-hero" aria-label="首页轮播">
      <div
        v-for="(slide, i) in slides"
        :key="i"
        class="official-slide"
        :class="{ active: i === currentSlide }"
        :style="{ backgroundImage: `url('${slide}')` }"
      ></div>
      <div class="official-hero-overlay"></div>
      <div class="official-hero-copy">
        <h1>助力打造「人、车、生活」的全新方式</h1>
        <p>HELP CREATE A NEW ECOLOGY OF "PEOPLE,CARS,AND LIFE"</p>
      </div>
      <div class="official-dots" aria-label="轮播切换">
        <button
          v-for="(_, i) in slides"
          :key="i"
          :class="{ active: i === currentSlide }"
          :aria-label="`第${i + 1}屏`"
          @click="select(i)"
        ></button>
      </div>
    </section>

    <!-- Products -->
    <section class="official-section official-products">
      <div class="official-title">
        <h2>产品分类</h2>
        <span></span>
      </div>
      <div class="official-product-stack">
        <article
          v-for="product in products"
          :key="product.name"
          class="official-product-card"
          :class="product.cls"
        >
          <div>
            <h3>{{ product.name }}</h3>
            <p>{{ product.en }}</p>
          </div>
          <b>{{ product.num }}</b>
        </article>
      </div>
    </section>

    <!-- Services -->
    <section class="official-section official-services">
      <div class="official-title">
        <h2>我们的服务</h2>
        <span></span>
      </div>
      <div class="official-service-grid">
        <router-link
          v-for="(svc, i) in services"
          :key="i"
          to="/service"
          class="official-service-item"
        >
          <i>{{ String(i + 1).padStart(2, '0') }}</i>
          <strong>{{ svc }}</strong>
        </router-link>
      </div>
    </section>

    <!-- Partners -->
    <section class="official-section official-partners">
      <div class="official-title">
        <h2>合作机构</h2>
        <span></span>
      </div>
      <div class="official-partner-wall">
        <div v-for="p in partners" :key="p.alt">
          <img :src="p.src" :alt="p.alt">
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useCarousel } from '@/composables/useCarousel'

const slides = [
  '/img/official/home_banner1.jpg',
  '/img/official/home_banner1.jpg',
  '/img/official/home_banner1.jpg',
]

const { currentSlide, select } = useCarousel(slides.length)

const products = [
  { name: '健康险', en: 'Health insurance', num: '01', cls: 'card-health' },
  { name: '财产险', en: 'Property insurance', num: '02', cls: 'card-property' },
  { name: '意外险', en: 'Accident insurance', num: '03', cls: 'card-accident' },
  { name: '长期险', en: 'Long-term insurance', num: '04', cls: 'card-long' },
]

const services = [
  '拟定投保方案',
  '选择保险人',
  '办理投保手续',
  '协助索赔',
  '再保险经纪',
  '风险管理咨询',
]

const partners = [
  { src: '/img/official/partner_anshengtianping.png', alt: '安盛天平' },
  { src: '/img/official/partner_dadi.png', alt: '大地保险' },
  { src: '/img/official/partner_guoren.png', alt: '国任保险' },
  { src: '/img/official/partner_renbao.png', alt: '中国人民保险' },
  { src: '/img/official/partner_renshou.png', alt: '中国人寿' },
  { src: '/img/official/partner_taikang.png', alt: '泰康保险' },
  { src: '/img/official/partner_taiping.png', alt: '太平保险' },
  { src: '/img/official/partner_taipingyang.png', alt: '太平洋保险' },
  { src: '/img/official/partner_yangguang.png', alt: '阳光保险' },
  { src: '/img/official/partner_yatai.png', alt: '亚太财险' },
  { src: '/img/official/partner_yongan.png', alt: '永安保险' },
  { src: '/img/official/partner_zhongan.png', alt: '众安保险' },
]
</script>
