<template>
  <main>
    <section class="page-banner">
      <div class="container">
        <h1>客户服务</h1>
        <div class="breadcrumb"><router-link to="/">首页</router-link> / <span>客户服务</span></div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-title center">
          <span class="en-sub">CORE SERVICES</span>
          <h2>五大核心服务</h2>
          <p>围绕客户投保前、投保中与投保后的关键节点，提供清晰、专业、可持续的服务支持。</p>
        </div>
        <div class="grid-3">
          <article v-for="s in coreServices" :key="s.num" class="service-detail-card card-pad animate-on-scroll">
            <span class="num">{{ s.num }}</span>
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section-light">
      <div class="container">
        <div class="section-title">
          <span class="en-sub">SERVICE FLOW</span>
          <h2>标准化服务流程</h2>
          <p>从需求沟通到持续服务，每个环节都围绕风险管理目标展开。</p>
        </div>
        <div class="service-flow">
          <div v-for="step in flowSteps" :key="step.num" class="flow-step animate-on-scroll">
            <span class="step">{{ step.num }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-title center">
          <span class="en-sub">BUSINESS CATEGORIES</span>
          <h2>六大业务类别</h2>
          <p>全险种覆盖，满足个人、家庭与企业多元化保障需求。</p>
        </div>
        <div class="grid-3">
          <article v-for="p in categories" :key="p.name" class="product-card animate-on-scroll">
            <div class="product-top">
              <span class="en-name">{{ p.en }}</span>
              <h3>{{ p.name }}</h3>
            </div>
            <div class="product-body"><p>{{ p.desc }}</p></div>
          </article>
        </div>
      </div>
    </section>

    <section class="cta-block">
      <div class="container cta-inner">
        <div>
          <h2>让保障方案更清晰</h2>
          <p>如需保险经纪服务支持，请通过官方联系方式咨询。</p>
        </div>
        <router-link to="/contact" class="btn btn-primary">联系我们</router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
useIntersectionObserver()

const coreServices = [
  { num: '01', title: '投保服务', desc: '根据客户风险状况和保障需求，拟定投保方案，协助选择合适保险人并办理投保手续。' },
  { num: '02', title: '保单保全', desc: '提供保单信息变更、续保提醒、权益维护等全生命周期管理服务，保障服务连续性。' },
  { num: '03', title: '理赔协助', desc: '在理赔材料准备、流程沟通、争议协调等环节提供协助，维护客户合法权益。' },
  { num: '04', title: '风险管理咨询', desc: '提供风险评估、防灾防损建议和管理咨询，帮助客户提前识别并降低潜在损失。' },
  { num: '05', title: '再保险业务', desc: '为保险人提供再保险经纪服务，协助分散风险、提升保障韧性与业务稳健性。' },
]

const flowSteps = [
  { num: '01', title: '需求沟通', desc: '了解客户保障需求。' },
  { num: '02', title: '风险评估', desc: '识别潜在风险点。' },
  { num: '03', title: '方案定制', desc: '匹配保障方案。' },
  { num: '04', title: '保险人选择', desc: '比较承保资源。' },
  { num: '05', title: '投保办理', desc: '完成投保手续。' },
  { num: '06', title: '后续服务', desc: '保全理赔全程陪伴。' },
]

const categories = [
  { en: 'Property', name: '财产险', desc: '守护企业/个人核心实体资产，覆盖火灾、灾害等损失。' },
  { en: 'Liability', name: '责任险', desc: '覆盖第三方人身/财产损害及诉讼成本，避免单次责任事故拖垮经营。' },
  { en: 'Credit', name: '信用/保证险', desc: '保障债权安全与贸易履约，化解拖欠、违约风险。' },
  { en: 'Group', name: '团体险', desc: '覆盖医疗、意外等员工福利与风险防护需求。' },
  { en: 'Accident', name: '意外险', desc: '覆盖交通意外、跌倒摔伤、猫抓狗咬等日常场景。' },
  { en: 'Health', name: '健康险', desc: '覆盖住院医疗、门诊用药、重大疾病等费用。' },
]
</script>
