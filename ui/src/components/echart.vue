<template>
    <div ref="chartRef" class="chart-container"></div>
</template>
<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, defineExpose, defineProps, unref } from 'vue';
import { classifyDict } from '../request/dict'

const props = defineProps({
    tableData: Array
})

const chartRef = ref(null)
const chartInstance = null

function resize() {
    chartInstance?.resize()
}

function generateTreeMap() {
    const resMap = {}
    const _tableData = unref(props.tableData)
    _tableData.forEach(item => {
        if (!resMap[item.classify]) {
            resMap[item.classify] = {
                name: classifyDict[item.classify],
                children: [
                    {
                        name: item.productName,
                        value: item.orderQuantity,
                        standard: item.standard,
                        unit: item.unit,
                    }
                ]
            }
        } else {
            resMap[item.classify].children.push({
                name: item.productName,
                value: item.orderQuantity,
                standard: item.standard,
                unit: item.unit
            })
        }
    })
    return Object.values(resMap)
}

onMounted(() => {
    const chartInstance = echarts.init(chartRef.value);

    const option = {
        tooltip: {
            trigger: 'item',           // 針對每個矩形塊觸發
            confine: true,             // 防止 tooltip 跑到視窗外面（很重要）
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#333',
            textStyle: {
                color: '#fff',
                fontSize: 14
            },
            formatter: function (params) {
                const data = params.data || {};
                const { name, value, standard, unit } = params.data || {};

                if (data.children && data.children.length > 0) {
                    return '';  // 或 return null; 都可讓 tooltip 不出現
                }

                let result = `<div style="font-weight:bold;">${name}</div>`;

                if (value != null) {
                    result += `<div>下單數量：${value.toLocaleString()}</div>`;
                    result += `<div>規格：${standard}</div>`;
                    result += `<div>單位：${unit}</div>`;
                }
                return result;
            }
        },
        itemStyle: {
            borderColor: 'black'
        },
        title: {
            top: 3,
            left: 'center',
            text: '下單產品樹圖',
        },
        series: [
            {
                type: 'treemap',
                visibleMin: 300,
                data: generateTreeMap(),
                leafDepth: 2,
                initialDepth: 1,
                upperLabel: {
                    show: true,
                },
                levels: [
                    {
                        colorSaturation: 0.5,
                        itemStyle: {
                            borderWidth: 0,
                            borderColor: 'transparent',
                            gapWidth: 0
                        },
                        upperLabel: { show: false }
                    },
                    {
                        colorSaturation: 0.4,
                        itemStyle: {
                            borderColorSaturation: 0.7,
                            gapWidth: 2,
                            borderWidth: 5
                        },
                        textStyle: {
                            fontSize: '10px'
                        }
                    },
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
    height: 100%
}
</style>
