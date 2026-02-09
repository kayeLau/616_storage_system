<template>
  <div class="not-found-container">
    <div class="content">
      <h1>404</h1>
      <div class="emoji">😵‍💫</div>
      <h2>頁面不見了...</h2>
      
      <p class="description">
        你試圖前往的頁面 不存在或已被移除。
      </p>

      <div class="actions">
        <button class="btn secondary" @click="back">
          上一頁
        </button>
      </div>
    </div>

    <!-- 可選：一些漂浮的裝飾元素 -->
    <div class="floating-shapes">
      <div class="shape shape1"></div>
      <div class="shape shape2"></div>
      <div class="shape shape3"></div>
    </div>
  </div>
</template>
<script setup>
import { getStorge } from '../utils/auth'
import { useRouter } from 'vue-router';
const router = useRouter()

function back(){
    let path = getStorge('activeMenu')|| '/order';
    router.push({ path })
}
</script>
<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.content {
  text-align: center;
  z-index: 2;
  padding: 2rem;
  max-width: 600px;
}

h1 {
  font-size: 9rem;
  font-weight: 900;
  margin: 0;
  line-height: 0.9;
  text-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.emoji {
  font-size: 6rem;
  margin: 1rem 0;
}

h2 {
  font-size: 2.8rem;
  margin: 0.5rem 0 1.5rem;
}

.description {
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.path {
  background: rgba(255,255,255,0.2);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-family: monospace;
}

.actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.9rem 2.2rem;
  font-size: 1.1rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}

.primary {
  background: white;
  color: #4f46e5;
}

.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.25);
}

.secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.secondary:hover {
  background: rgba(255,255,255,0.15);
}

.floating-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  animation: float 15s infinite ease-in-out;
}

.shape1 { width: 180px; height: 180px; top: 15%; left: 10%; animation-delay: 0s; }
.shape2 { width: 120px; height: 120px; bottom: 20%; right: 15%; animation-delay: 5s; }
.shape3 { width: 220px; height: 220px; top: 60%; left: 70%; animation-delay: 8s; }

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -30px); }
}

@media (max-width: 640px) {
  h1 { font-size: 6rem; }
  h2 { font-size: 2rem; }
  .emoji { font-size: 4rem; }
}
</style>