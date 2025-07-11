<template>
    <component :is="component"></component>
</template>
<script setup>
import { computed } from 'vue';
import Order from './Order.vue';
import appOrder from './appOrder.vue';
import { useWindowSize } from '../../hooks/useWindowSize';
const { device } = useWindowSize();

const component = computed(() => {
    return device.value === 'pc' ? Order : appOrder
})

</script>