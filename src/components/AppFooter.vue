<template>
  <!-- Home footer -->
  <footer v-if="layout === 'home'" class="official-footer">
    <div class="official-footer-inner">
      <div>© 2025 福顺保险经纪有限公司 版权所有</div>
      <div>
        <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener">沪ICP备17018714号-4</a>
        <span>沪公网安备31010102008506号</span>
      </div>
    </div>
  </footer>

  <!-- Info footer -->
  <footer v-else-if="layout === 'info'" class="official-info-footer">
    <div class="official-info-footer-inner">
      <div class="official-footer-info">
        <div class="official-footer-top">
          <div>
            <div>保险销售许可：福顺保险经纪有限公司</div>
            <div>（保险经纪许可证：260403000000800）</div>
          </div>
          <div>
            <div>福顺保险经纪有限公司 版权所有</div>
            <div>联系电话：400-8213410</div>
          </div>
        </div>
        <div class="official-footer-bottom">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="nofollow noopener">沪ICP备17018714号-4</a>
          <a href="https://beian.mps.gov.cn/#/query/websearch?code=31010102008506" target="_blank" rel="nofollow noopener">
            <img src="/img/official/hgwablogo.png" alt="">沪公网安备31010102008506号
          </a>
          <a href="https://xyt.xinchacha.com/getpcInfo?sn=1547512404428881920&certType=8&url=*.fushuninsurance.com" target="_blank" rel="nofollow noopener" class="official-ssl">
            <img src="/img/official/ssl_icon8.png" alt="网站安全证书">
          </a>
          <div>本网站支持IPV6</div>
        </div>
      </div>
      <div class="official-qr">
        <div class="official-qr-box">FS</div>
        <div>福顺保险微信公众号</div>
      </div>
    </div>
  </footer>

  <!-- Default footer -->
  <footer v-else class="footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <span class="logo-text">福顺保险经纪</span>
          <p>成立于2003年，经监管认证的全国性、综合性保险经纪有限公司。</p>
        </div>
        <div class="footer-col">
          <h4>快速导航</h4>
          <router-link to="/">首页</router-link>
          <router-link to="/service">客户服务</router-link>
          <router-link to="/products">产品介绍</router-link>
          <router-link to="/mall">产品商城</router-link>
        </div>
        <div class="footer-col">
          <h4>信息披露</h4>
          <router-link to="/info">信息披露</router-link>
          <router-link to="/announcement">公告通知</router-link>
        </div>
        <div class="footer-col">
          <h4>联系方式</h4>
          <a href="tel:4008213410">400-8213410</a>
          <a href="mailto:customercare@fsinsurance.com.cn">customercare@fsinsurance.com.cn</a>
        </div>
      </div>
      <div class="footer-bottom">
        <div>© 2025 福顺保险经纪有限公司 版权所有</div>
        <div class="links">
          <span>沪ICP备17018714号-4</span>
          <span>保险经纪许可证号：260403000000800</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const layout = computed(() => route.meta.layout || 'default')
</script>
