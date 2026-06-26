<template>
  <main class="official-info-main">
    <section class="official-info-banner">
      <img src="/img/official/info_banner.jpg" alt="信息披露">
      <div class="official-info-title">
        <div>信息披露</div>
        <div>INFORMATION</div>
      </div>
    </section>

    <section class="official-info-switch">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="official-info-tab"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >{{ tab.label }}</button>
    </section>

    <section class="official-info-content">
      <!-- 公司信息 -->
      <div class="official-info-panel" :class="{ active: activeTab === 'company' }">
        <!-- 公司名称 Hero -->
        <div class="info-hero">
          <span class="info-hero-label">法定名称</span>
          <h2 class="info-hero-name">福顺保险经纪有限公司</h2>
        </div>

        <!-- 基本信息卡片网格 -->
        <div class="info-card-grid">
          <div class="info-card">
            <div class="info-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="info-card-label">注册资本</div>
            <div class="info-card-value">人民币5000万元</div>
          </div>
          <div class="info-card">
            <div class="info-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div class="info-card-label">成立时间</div>
            <div class="info-card-value">二零零三年八月二十九日</div>
          </div>
          <div class="info-card">
            <div class="info-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div class="info-card-label">法定代表人</div>
            <div class="info-card-value">吴迪</div>
          </div>
          <div class="info-card">
            <div class="info-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div class="info-card-label">公司经营场所</div>
            <div class="info-card-value">上海市黄浦区龙华东路818号1707室</div>
          </div>
        </div>

        <!-- 业务范围 -->
        <div class="info-section">
          <div class="info-section-head">
            <span class="info-section-dot"></span>
            <h3>业务范围</h3>
          </div>
          <p class="info-section-text">在全国区域内（港、澳、台除外）为投保人拟定投保方案、选择保险人、办理投保手续；协助被保险人或受益人进行索赔；再保险经纪业务；为委托人提供防灾、防损或风险评估、风险管理咨询服务；中国保监会批准的其他业务。</p>
        </div>

        <!-- 联系方式 -->
        <div class="info-contact-grid">
          <div class="info-contact-card">
            <div class="info-section-head">
              <span class="info-section-dot"></span>
              <h3>客服与邮箱</h3>
            </div>
            <div class="info-contact-row">
              <span class="info-contact-label">客服电话</span>
              <span class="info-contact-val">021 - 63680570</span>
            </div>
            <div class="info-contact-row">
              <span class="info-contact-label">服务邮箱</span>
              <span class="info-contact-val">customercare@fsinsurance.com.cn</span>
            </div>
          </div>
          <div class="info-contact-card">
            <div class="info-section-head">
              <span class="info-section-dot"></span>
              <h3>查询与投诉</h3>
            </div>
            <div class="info-contact-row">
              <span class="info-contact-label">保单查询验真</span>
              <span class="info-contact-val">可联系客服热线 021-63680570，或通过所属保险公司官网、公众号查询。</span>
            </div>
            <div class="info-contact-row">
              <span class="info-contact-label">投诉渠道</span>
              <span class="info-contact-val">联系产品所属保险公司进行客服咨询</span>
            </div>
          </div>
        </div>

        <!-- 协议链接 -->
        <div class="info-doc-list">
          <button class="info-doc-item" @click="showDoc('privacy')">
            <span class="info-doc-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </span>
            <span class="info-doc-text">个人隐私政策</span>
            <span class="info-doc-arrow">→</span>
          </button>
          <button class="info-doc-item" @click="showDoc('user')">
            <span class="info-doc-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </span>
            <span class="info-doc-text">用户使用协议</span>
            <span class="info-doc-arrow">→</span>
          </button>
          <button class="info-doc-item" @click="showDoc('notice')">
            <span class="info-doc-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </span>
            <span class="info-doc-text">保险经纪委托协议</span>
            <span class="info-doc-arrow">→</span>
          </button>
        </div>
      </div>

      <!-- 资质披露 -->
      <div class="official-info-panel" :class="{ active: activeTab === 'qualification' }">
        <p class="official-association-link">
          中国保险行业协会&gt;信息披露&gt;互联网保险信息披露：
          <a href="http://icidp.iachina.cn/?columnid_url=201509301401" target="_blank" rel="noopener">点击查看</a>
        </p>
        <div class="qual-section">
          <div class="info-section-head">
            <span class="info-section-dot"></span>
            <h3>经营资质</h3>
          </div>
          <div class="qual-grid">
            <div class="qual-card" @click="showImage('/img/official/yingyezhizhao.png', '营业执照')">
              <div class="qual-img-wrap">
                <img src="/img/official/yingyezhizhao.png" alt="营业执照">
              </div>
              <div class="qual-label">营业执照</div>
            </div>
            <div class="qual-card" @click="showImage('/img/official/xukezheng.png', '保险许可证')">
              <div class="qual-img-wrap">
                <img src="/img/official/xukezheng.png" alt="保险许可证">
              </div>
              <div class="qual-label">保险许可证</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 互联网信息披露 -->
      <div class="official-info-panel" :class="{ active: activeTab === 'internet' }">
        <!-- 自营平台 -->
        <div class="info-section">
          <div class="info-section-head">
            <span class="info-section-dot"></span>
            <h3>自营平台</h3>
          </div>
          <div class="platform-list">
            <div class="platform-item">
              <div class="platform-name">福顺官网</div>
              <a class="platform-url" href="https://www.fsinsurance.com.cn" target="_blank" rel="noopener">www.fsinsurance.com.cn ↗</a>

            </div>
            <div class="platform-item">
              <div class="platform-name">福顺保险经纪</div>
              <a class="platform-url" href="https://wechat.fsinsurance.com.cn/#/?code=021iJvGa17zhWL0tBZHa1RSVHv2iJvGq&state=1" target="_blank" rel="noopener">微信公众号 ↗</a>
            </div>
          </div>
        </div>

        <!-- 合作保险公司信息 -->
        <div class="info-section">
          <div class="info-section-head">
            <span class="info-section-dot"></span>
            <h3>合作保险公司信息</h3>
          </div>
          <div class="info-notice-card">
            <p>合作保险公司情况，包括综合偿付能力充足率、风险综合评级、消费者权益保护监管评价等相关监管评价信息，详见各保险公司官网。</p>
          </div>
        </div>

        <!-- 合作保险公司列表 -->
        <div class="info-section">
          <div class="info-section-head">
            <span class="info-section-dot"></span>
            <h3>合作保险公司列表</h3>
          </div>
          <div class="partner-table-card">
            <table class="info-modern-table">
              <thead>
                <tr>
                  <th>保险公司</th>
                  <th>业务合作范围</th>
                  <th>网址</th>
                  <th>合作期限</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>安盛天平财产保险有限公司</strong></td>
                  <td>旅行险</td>
                  <td><a href="https://www.axa.cn/" target="_blank" rel="noopener" class="info-ext-link">axa.cn ↗</a></td>
                  <td>2028年8月10日</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 产品信息 -->
        <div class="info-section">
          <div class="info-section-head">
            <span class="info-section-dot"></span>
            <h3>产品信息</h3>
          </div>
          <div class="product-list">
            <div class="product-item" v-for="(p, i) in products" :key="i">
              <div class="product-item-main">
                <div class="product-item-name">{{ p.name }}</div>
                <div class="product-item-company">{{ p.company }}</div>
              </div>
              <button class="product-item-btn" @click="showDoc('terms')">条款</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <ImageModal ref="modalRef" />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import ImageModal from '@/components/ImageModal.vue'

const modalRef = ref(null)
const activeTab = ref('company')

const tabs = [
  { id: 'company', label: '公司信息' },
  { id: 'qualification', label: '资质披露' },
  { id: 'internet', label: '互联网信息披露' },
]

const products = [
  { name: '香港快运AXA安盛亚洲旅行意外险', company: '安盛天平财产保险有限公司' },
  { name: '安盛天平智行港澳旅游保险', company: '安盛天平财产保险有限公司' },
  { name: '智行天下全球旅行保险', company: '安盛天平财产保险有限公司' },
]

const docCopy = {
  privacy: ['个人隐私政策', '福顺保险经纪有限公司重视客户个人信息保护。我们将在提供保险经纪服务所必要的范围内收集、使用和保护您的个人信息，并依法采取安全措施。'],
  user: ['用户使用协议', '访问和使用本网站即表示您同意遵守相关法律法规及本网站披露规则。网站信息仅供参考，具体保险责任以保险公司正式条款为准。'],
  notice: ['保险经纪委托协议', '福顺保险经纪有限公司为经批准设立的全国性保险经纪机构。我们根据客户委托提供投保方案拟定、保险人选择、投保手续办理、理赔协助及风险管理咨询等服务。'],
  terms: ['条款信息', '具体保险条款、责任免除、投保规则及理赔要求请以承保保险公司正式文件及投保页面展示为准。'],
}

const showDoc = (key) => {
  const [title, text] = docCopy[key] || ['提示', '暂无可展示内容。']
  modalRef.value?.show(`<h3>${title}</h3><p>${text}</p>`)
}

const showImage = (src, alt) => {
  modalRef.value?.show(`<img src="${src}" alt="${alt}">`)
}
</script>
