<template>
  <main>
    <section class="page-banner">
      <div class="container">
        <h1>产品商城</h1>
        <div class="breadcrumb"><router-link to="/">首页</router-link> / <span>产品商城</span></div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-title center">
          <span class="en-sub">INSURANCE PRODUCTS</span>
          <h2>旅行保险专区</h2>
          <p>以下产品信息用于展示。投保链接将在等保2级相关工作完成并经确认后开放，届时将跳转至保险公司官方投保页面。</p>
        </div>
        <div class="grid-3">
          <article v-for="item in mallProducts" :key="item.name" class="mall-card animate-on-scroll">
            <div class="mall-card-header">
              <span class="status-pill">待上线</span>
              <h3>{{ item.name }}</h3>
              <div class="provider">{{ item.provider }}</div>
            </div>
            <div class="mall-card-body">
              <ul class="feature-list">
                <li v-for="(f, i) in item.features" :key="i">{{ f }}</li>
              </ul>
              <a href="javascript:void(0)" class="btn btn-disabled">等保2完成后开放</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section section-light">
      <div class="narrow">
        <div class="card card-pad">
          <span class="en-sub">NOTICE</span>
          <h2>投保须知</h2>
          <ul class="feature-list">
            <li>投保过程将在保险公司官方页面完成，具体保险责任由承保保险公司承担。</li>
            <li>投保前请仔细阅读保险条款、产品说明、免责条款及投保须知。</li>
            <li>如有疑问，请拨打客服热线 400-8213410 或发送邮件至 customercare@fsinsurance.com.cn。</li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
useIntersectionObserver()

const mallProducts = [
  {
    name: '香港快运AXA安盛亚洲旅行意外险',
    provider: '安盛保险 | AXA',
    features: ['覆盖亚洲区域旅行意外保障', '含医疗费用、紧急救援等保障内容', '上线后跳转至安盛官方投保页面'],
  },
  {
    name: '安盛天平智行港澳旅游保险',
    provider: '安盛天平 | AXA Tianping',
    features: ['面向港澳出行保障需求', '含医疗保障、个人责任等保障内容', '上线后跳转至安盛官方投保页面'],
  },
  {
    name: '智行天下全球旅行保险',
    provider: '安盛保险 | AXA',
    features: ['面向全球范围旅行保障需求', '含医疗费用、紧急救援等保障内容', '上线后跳转至安盛官方投保页面'],
  },
]
</script>
