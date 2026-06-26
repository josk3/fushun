<template>
  <main>
    <section class="page-banner">
      <div class="container">
        <h1>关于我们</h1>
        <div class="breadcrumb"><router-link to="/">首页</router-link> / <span>关于我们</span></div>
      </div>
    </section>

    <section class="section">
      <div class="container grid-2">
        <div>
          <div class="section-title">
            <span class="en-sub">COMPANY PROFILE</span>
            <h2>全国性综合保险经纪标杆</h2>
            <p>成立于2003年，总部扎根上海，是经监管认证的全国性、综合性保险经纪有限公司。凭借深耕行业二十余年的经验，为客户提供全场景一体化的保险经纪解决方案。</p>
          </div>
          <ul class="feature-list">
            <li>母公司为上海灿谷投资管理咨询服务有限公司（纽约证券交易所股票代码：CANG）。</li>
            <li>依托母公司覆盖全国汽车经销商和车贷客户的网络，融入购车、用车、换车的汽车全生命周期。</li>
            <li>在全国多个省市、自治区设有服务网络，涵盖车险、非车险、健康险等多元化险种。</li>
          </ul>
        </div>
        <div class="about-visual animate-on-scroll">
          <div class="visual-content">
            <div class="visual-badge">COMPANY STRENGTH</div>
            <div class="visual-stat">
              <strong>22<em>+</em></strong>
              <span>深耕保险经纪行业</span>
            </div>
            <div class="visual-divider"></div>
            <div class="visual-stat">
              <strong>5000<em>万</em></strong>
              <span>人民币实缴资本</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-light">
      <div class="container">
        <div class="section-title center">
          <span class="en-sub">CORE ADVANTAGES</span>
          <h2>四大核心竞争力</h2>
          <p>以资本、资质、技术与风险管理方法论构筑专业服务基石。</p>
        </div>
        <div class="grid-4">
          <article v-for="item in advantages" :key="item.num" class="about-highlight-card card-pad animate-on-scroll">
            <span class="num">{{ item.num }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-title center">
          <span class="en-sub">MILESTONES</span>
          <h2>发展历程</h2>
        </div>
        <div class="timeline">
          <div v-for="m in milestones" :key="m.year" class="timeline-item animate-on-scroll">
            <div class="year">{{ m.year }}</div>
            <p>{{ m.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-block">
      <div class="container cta-inner">
        <div>
          <h2>了解福顺服务能力</h2>
          <p>从一个风险场景开始，获得更清晰的保险经纪服务支持。</p>
        </div>
        <router-link to="/service" class="btn btn-primary">查看客户服务</router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
useIntersectionObserver()

const advantages = [
  { num: '01', title: '企业定位', desc: '全国性、综合性保险经纪有限公司，为客户提供全场景一体化保险经纪解决方案。' },
  { num: '02', title: '资本实力', desc: '实缴资本金达人民币5000万元，资本实力稳居行业前列，支撑全险种覆盖与全生命周期陪伴。' },
  { num: '03', title: '专业认证', desc: '2020年11月获国家高新技术企业认定，以技术驱动风险识别、方案定制和服务响应。' },
  { num: '04', title: '核心价值', desc: '聚焦"以保险为核心工具的风险管理"，打造"咨询、落地、风控"全链条服务体系。' },
]

const milestones = [
  { year: '2003年9月', text: '福顺保险经纪有限公司成立，开启保险经纪专业服务之路。' },
  { year: '2018年', text: '业务规模持续增长，服务网络覆盖全国多个省市。' },
  { year: '2020年11月', text: '获国家高新技术企业认定，推动保险科技与数字化风控能力建设。' },
  { year: '今天', text: '持续围绕"人、车、生活"场景，提供保险经纪与风险管理服务。' },
]
</script>
