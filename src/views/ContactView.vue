<template>
  <main>
    <section class="page-banner">
      <div class="container">
        <h1>联系我们</h1>
        <div class="breadcrumb"><router-link to="/">首页</router-link> / <span>联系我们</span></div>
      </div>
    </section>

    <section class="section">
      <div class="container contact-grid">
        <div class="contact-card">
          <div class="section-title">
            <span class="en-sub">CONTACT</span>
            <h2>官方联系方式</h2>
            <p>如您有保险需求、服务咨询或投诉建议，欢迎通过以下方式联系福顺保险经纪。</p>
          </div>
          <div class="contact-item">
            <div class="label">公司地址</div>
            <div class="value">上海市黄浦区龙华东路818号1707室</div>
          </div>
          <div class="contact-item">
            <div class="label">客服热线</div>
            <div class="value"><a href="tel:4008213410">400-8213410</a></div>
          </div>
          <div class="contact-item">
            <div class="label">联系电话 / 投诉热线</div>
            <div class="value"><a href="tel:02163680570">021-63680570</a></div>
          </div>
          <div class="contact-item">
            <div class="label">服务邮箱 / 投诉邮箱</div>
            <div class="value"><a href="mailto:customercare@fsinsurance.com.cn">customercare@fsinsurance.com.cn</a></div>
          </div>
        </div>
        <div class="contact-map animate-on-scroll">
          <div class="map-placeholder">
            <div class="map-badge">OFFICE LOCATION</div>
            <div class="map-pin">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <strong>上海 · 黄浦</strong>
            <p>龙华东路818号1707室</p>
            <div class="map-decoration"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-light">
      <div class="container">
        <div class="section-title center">
          <span class="en-sub">SERVICE HOURS</span>
          <h2>服务时间</h2>
        </div>
        <div class="grid-3">
          <div class="card card-pad">
            <span class="num">01</span>
            <h3>电话服务</h3>
            <p>工作日 9:00 - 18:00</p>
          </div>
          <div class="card card-pad">
            <span class="num">02</span>
            <h3>邮件服务</h3>
            <p>24小时接收，1个工作日内回复。</p>
          </div>
          <div class="card card-pad">
            <span class="num">03</span>
            <h3>微信公众号</h3>
            <p>搜索"福顺保险"关注。</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
useIntersectionObserver()
</script>
