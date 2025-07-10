<template>
    <component :is="component"></component>
</template>
<script setup>
import { shallowRef } from 'vue';
import Order from './Order.vue'
import appOrder from './appOrder.vue'

let component = shallowRef(null)

const screenWidth = window.screen.width
component.value = screenWidth > 750 ? Order : appOrder

</script>