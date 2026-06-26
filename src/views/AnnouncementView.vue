<template>
  <main>
    <section class="page-banner">
      <div class="container">
        <h1>公告通知</h1>
        <div class="breadcrumb"><router-link to="/">首页</router-link> / <span>公告通知</span></div>
      </div>
    </section>

    <section style="padding:20px 0 0;background:var(--white);">
      <div class="container" style="max-width:800px;">
        <input
          v-model="searchQuery"
          type="text"
          class="announcement-search"
          placeholder="搜索公告..."
          aria-label="搜索公告"
        >
      </div>
    </section>

    <section class="announcement-section">
      <div class="container">
        <div class="announcement-list">
          <div
            v-for="item in filteredItems"
            :key="item.id || item.date + item.title"
            class="announcement-item"
            @click="openDetail(item)"
            style="cursor:pointer"
          >
            <span class="title">{{ item.title }}</span>
            <div class="meta">
              <span class="date">{{ formatDate(item) }}</span>
              <span v-if="item.attachment_count > 0" class="att-badge">{{ item.attachment_count }} 个附件</span>
              <span v-if="item.pdf || item.pdf_url" class="view-pdf-badge">PDF</span>
            </div>
          </div>
          <div v-if="filteredItems.length === 0 && !loading" class="announcement-empty">
            暂无公告
          </div>
          <div v-if="loading" class="announcement-empty">加载中...</div>
        </div>
      </div>
    </section>

    <!-- Detail Modal -->
    <Teleport to="body">
      <div v-if="detailItem" class="announcement-modal-overlay" @click.self="closeDetail">
        <div class="announcement-modal">
          <button class="modal-close" @click="closeDetail">&times;</button>
          <h3>{{ detailItem.title }}</h3>
          <p class="modal-date">{{ formatDate(detailItem) }}</p>

          <div v-if="detailContent !== null && detailContent !== ''" class="modal-body">
            {{ detailContent }}
          </div>

          <div v-if="detailAttachments.length > 0" class="modal-attachments">
            <h4>附件</h4>
            <a
              v-for="att in detailAttachments"
              :key="att.id"
              :href="'/api/announcements/attachments/' + att.id + '/download'"
              class="attachment-download"
              target="_blank"
            >
              <span class="att-file-icon">{{ getFileIcon(att.original_name) }}</span>
              <span>{{ att.original_name }}</span>
            </a>
          </div>

          <div v-if="detailItem.pdf || detailItem.pdf_url" class="modal-attachments">
            <h4>附件</h4>
            <a :href="detailItem.pdf || detailItem.pdf_url" target="_blank" class="attachment-download">
              <span class="att-file-icon">PDF</span>
              <span>{{ getPdfFilename(detailItem.pdf || detailItem.pdf_url) }}</span>
            </a>
          </div>

          <div v-if="detailLoading" class="modal-loading">加载中...</div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch, onActivated } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const searchQuery = ref('')
const loading = ref(false)
const apiAnnouncements = ref([])

// Static fallback data
const staticAnnouncements = [
  { title: '关于撤销福顺保险经纪有限公司湖南分公司的公告', date: '2025-05-06', pdf: '//fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj20250506.pdf' },
  { title: '关于撤销福顺保险经纪有限公司青岛分公司的公告', date: '2025-03-20', pdf: '//fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj20250320.pdf' },
  { title: '关于撤销福顺保险经纪有限公司甘肃分公司的公告', date: '2025-01-17', pdf: '//fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj20250117.pdf' },
  { title: '关于撤销福顺保险经纪有限公司陕西分公司的公告', date: '2024-12-18', pdf: '//fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj20241218.pdf' },
  { title: '关于撤销福顺保险经纪有限公司广东分公司的公告', date: '2024-10-28', pdf: '//fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj20241031.pdf' },
  { title: '关于撤销福顺保险经纪有限公司山西分公司的公告', date: '2024-10-23', pdf: '//fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj2024103102.pdf' },
  { title: '关于撤销福顺保险经纪有限公司广西分公司的公告', date: '2024-10-10', pdf: '//fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj20241010.pdf' },
  { title: '关于换发《保险中介许可证》的公告', date: '2023-08-20', pdf: '//fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj20230815.pdf' },
  { title: '关于广东分公司住所变更的公告', date: '2023-08-20', pdf: '//fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/gdfgs20230820.pdf' },
  { title: '关于换发《保险中介许可证》的公告', date: '2022-08-20', pdf: '//fsbx-wechat.oss-cn-shanghai.aliyuncs.com/www/bxzj20230820.pdf' },
]

const announcements = computed(() => {
  // Merge: API data first, then static fallback (deduplicate by title)
  const apiTitles = new Set(apiAnnouncements.value.map(a => a.title))
  const staticFiltered = staticAnnouncements.filter(s => !apiTitles.has(s.title))
  return [...apiAnnouncements.value, ...staticFiltered]
})

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return announcements.value
  return announcements.value.filter((item) => item.title.toLowerCase().includes(q))
})

function formatDate(item) {
  if (item.created_at) return item.created_at.slice(0, 10)
  return item.date || ''
}

function getFileIcon(name) {
  const ext = (name || '').split('.').pop().toLowerCase()
  const icons = { pdf: 'PDF', doc: 'DOC', docx: 'DOCX', xls: 'XLS', xlsx: 'XLSX', ppt: 'PPT', pptx: 'PPTX' }
  return icons[ext] || 'FILE'
}

function getPdfFilename(url) {
  if (!url) return '查看PDF文件'
  try {
    // Extract filename from URL, e.g. .../bxzj20250506.pdf -> bxzj20250506.pdf
    const path = new URL(url.startsWith('//') ? 'https:' + url : url).pathname
    const name = path.split('/').pop()
    return name || '查看PDF文件'
  } catch {
    return url.split('/').pop() || '查看PDF文件'
  }
}

// Detail modal
const detailItem = ref(null)
const detailContent = ref('')
const detailAttachments = ref([])
const detailLoading = ref(false)

async function openDetail(item) {
  detailItem.value = item
  detailContent.value = item.content || ''
  detailAttachments.value = []

  if (item.id) {
    detailLoading.value = true
    try {
      const res = await fetch(`/api/announcements/${item.id}`)
      const data = await res.json()
      detailContent.value = data.content || ''
      detailAttachments.value = data.attachments || []
    } catch (e) {
      console.error(e)
    } finally {
      detailLoading.value = false
    }
  }
}

function closeDetail() {
  detailItem.value = null
  detailContent.value = ''
  detailAttachments.value = []
}

async function loadAnnouncements() {
  loading.value = true
  try {
    const res = await fetch('/api/announcements')
    if (res.ok) {
      apiAnnouncements.value = await res.json()
    }
  } catch (e) {
    console.error('Failed to load announcements from API, using static data')
  } finally {
    loading.value = false
  }
}

onMounted(loadAnnouncements)
onActivated(loadAnnouncements)

// Re-fetch when navigating to this page
watch(() => route.path, (newPath) => {
  if (newPath === '/announcement') {
    loadAnnouncements()
  }
})
</script>

<style scoped>
.announcement-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}
.announcement-item:hover {
  background: #f8f9fa;
}
.announcement-item .title {
  flex: 1;
  font-size: 15px;
  color: #1a1a1a;
  line-height: 1.5;
}
.announcement-item .meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-left: 16px;
}
.announcement-item .date {
  font-size: 13px;
  color: #999;
  white-space: nowrap;
}
.att-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 10px;
  font-size: 11px;
}
.view-pdf-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #e3f2fd;
  color: #1565c0;
  border-radius: 10px;
  font-size: 11px;
}
.announcement-empty {
  text-align: center;
  padding: 40px;
  color: #999;
}

/* Modal */
.announcement-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 24px;
}
.announcement-modal {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  max-width: 640px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}
.modal-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  line-height: 1;
}
.modal-close:hover { color: #333; }
.announcement-modal h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #1a1a1a;
  padding-right: 30px;
}
.modal-date {
  margin: 0 0 16px;
  font-size: 13px;
  color: #999;
}
.modal-body {
  margin-bottom: 20px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.7;
  color: #333;
  white-space: pre-wrap;
}
.modal-attachments h4 {
  margin: 0 0 10px;
  font-size: 14px;
  color: #555;
}
.attachment-download {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #f5f5f5;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  margin-bottom: 6px;
  transition: background 0.2s;
}
.attachment-download:hover {
  background: #e8e8e8;
}
.att-file-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 28px;
  background: #e3f2fd;
  color: #1565c0;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}
.modal-loading {
  text-align: center;
  padding: 16px;
  color: #999;
}
</style>
