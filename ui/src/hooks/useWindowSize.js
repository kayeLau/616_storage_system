import { ref } from 'vue';

const width = ref(window.innerWidth);
const height = ref(window.innerHeight);
const device = ref(window.innerWidth > 750 ? 'pc' : 'phone')

const updateSize = () => {
  width.value = window.innerWidth;
  height.value = window.innerHeight;
  device.value = window.innerWidth > 750 ? 'pc' : 'phone'
};

window.addEventListener('resize', updateSize); // 这里添加了事件监听器

export const useWindowSize = () => {
  return { width, height , device }; // 返回共享的状态
};