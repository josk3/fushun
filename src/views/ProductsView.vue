<template>
  <main>
    <section class="page-banner">
      <div class="container">
        <h1>产品介绍</h1>
        <div class="breadcrumb"><router-link to="/">首页</router-link> / <span>产品介绍</span></div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-title center">
          <span class="en-sub">PRODUCT CATEGORIES</span>
          <h2>六大业务类别</h2>
          <p>以下为保险产品类别说明，具体保险责任、免责条款、承保条件及费率以保险公司正式条款和投保页面为准。</p>
        </div>
        <div class="grid-3">
          <article v-for="p in products" :key="p.name" class="product-card animate-on-scroll">
            <div class="product-top">
              <span class="en-name">{{ p.en }}</span>
              <h3>{{ p.name }}</h3>
            </div>
            <div class="product-body">
              <p>{{ p.desc }}</p>
              <div class="tag-list">
                <span v-for="tag in p.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section section-light">
      <div class="container">
        <div class="stats-band">
          <div class="stat"><strong>6类</strong><span>核心产品类别</span></div>
          <div class="stat"><strong>全流程</strong><span>投保与保全服务</span></div>
          <div class="stat"><strong>多机构</strong><span>合作保险资源</span></div>
          <div class="stat"><strong>合规</strong><span>信息披露可查询</span></div>
        </div>
      </div>
    </section>

    <section class="cta-block">
      <div class="container cta-inner">
        <div>
          <h2>寻找适合的保障类别</h2>
          <p>请结合自身风险场景咨询专业人员，投保前仔细阅读保险条款。</p>
        </div>
        <router-link to="/mall" class="btn btn-primary">查看产品商城</router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
useIntersectionObserver()

const products = [
  { en: 'Property Insurance', name: '财产险', desc: '守护企业/个人核心实体资产，覆盖火灾、灾害等损失，杜绝财产损毁致经营停摆、资产归零，筑牢资产安全防线。', tags: ['企业财产', '家庭财产', '机器损坏'] },
  { en: 'Liability Insurance', name: '责任险', desc: '兜底企业/个人法律赔偿风险，覆盖第三方人身/财产损害及诉讼成本，避免单次责任事故拖垮经营，守住风险底线。', tags: ['公众责任', '雇主责任', '产品责任'] },
  { en: 'Credit & Guarantee', name: '信用/保证险', desc: '保障债权安全与贸易履约，化解拖欠、违约风险，稳现金流、助融资增信，杜绝合作风险致企业资金链断裂。', tags: ['贸易信用', '履约保证', '融资增信'] },
  { en: 'Group Insurance', name: '团体险', desc: '锚定企业员工福利与风险防护，覆盖医疗、意外等需求，减企业额外支出、提人才粘性，夯实团队稳定基石。', tags: ['团体医疗', '团体意外', '补充医疗'] },
  { en: 'Accident Insurance', name: '意外险', desc: '围绕意外伤残与身故风险防护，覆盖交通意外、跌倒摔伤、猫抓狗咬等日常场景，减个人及家庭突发经济冲击。', tags: ['综合意外', '交通意外', '旅行意外'] },
  { en: 'Health Insurance', name: '健康险', desc: '聚焦疾病治疗与康复养护需求，覆盖住院医疗、门诊用药、重大疾病等费用，减高额医疗支出负担。', tags: ['百万医疗', '重大疾病', '门诊医疗'] },
]
</script>
