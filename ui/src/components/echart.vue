<template>
    <div ref="chartRef" class="chart-container"></div>
</template>
<script setup>
import * as echarts from 'echarts';
import { ref, onMounted , defineExpose } from 'vue';
const chartRef = ref(null)
const chartInstance = null

function resize(){
    chartInstance?.resize()
}

onMounted(() => {
    const chartInstance = echarts.init(chartRef.value);

    const option = {
        series: [
            {
                type: 'treemap',
                data: [
                    {
                        name: 'nodeA',
                        value: 10,
                        children: [
                            {
                                name: 'nodeAa',
                                value: 4
                            },
                            {
                                name: 'nodeAb',
                                value: 6
                            }
                        ]
                    },
                    {
                        name: 'nodeB',
                        value: 20,
                        children: [
                            {
                                name: 'nodeBa',
                                value: 20,
                                children: [
                                    {
                                        name: 'nodeBa1',
                                        value: 20
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };

    option && chartInstance.setOption(option);
})

defineExpose({
    resize
})
</script>
<style>
.chart-container {
    width: 100%;
    height: 450px
}
</style>