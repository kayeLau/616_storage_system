const { getSettingItems } = require('../models/settingManage_model')

const checkNull = (data) => {
    for (var key in data) {
        // 不為空
        return false;
    }
    // 為空值
    return true;
}

const fillZero = (value) => {
    return Number(value) > 9 ? String(value) : '0' + value
}

const getCurrentTime = () => {
    const date = new Date()
    const yy = date.getFullYear()
    const mm = fillZero(date.getMonth() + 1)
    const dd = fillZero(date.getDate())
    const h = fillZero(date.getHours())
    const m = fillZero(date.getMinutes())
    const s = fillZero(date.getSeconds())
    return yy + '-' + mm + '-' + dd + ' ' + h + ':' + m + ':' + s
}

const getTodayTimeRange = () => {
    const date = new Date()
    const start = dateFormat(date) + ' 00:00:00'
    const end = dateFormat(date) + ' 23:59:59'
    return [start,end]
}

const getSettingTimeRange = async () => {
    let startTime = '08:00:00'
    let endTime = '07:59:59'
    await getSettingItems({name:'lastOrder'},999,1).then(res => {
        if(res.success){
            let timeSetting = res.resource[0].value
            startTime = String(timeSetting) + ':00:00'
            endTime = fillZero(Number(timeSetting) - 1) + ':59:59'
        }
    })
    const date = new Date();
    const currentTime = fillZero(new Date().getHours()) + ':00:00'
    let start,end

    if (currentTime <= startTime) {
        end = dateFormat(date) + ' ' + endTime //2024-04-21 07:59:59
        date.setDate(date.getDate() - 1)
        start = dateFormat(date) + ' ' + startTime // 2024
    } else {
        start = dateFormat(date) + ' ' + startTime
        date.setDate(date.getDate() + 1)
        end = dateFormat(date) + ' ' + endTime
    }
    return [start,end]
}

const getExportTimeRange = async (dateStr) => {
    let startTime = '08:00:00'
    let endTime = '07:59:59'
    await getSettingItems({name:'lastOrder'},999,1).then(res => {
        if(res.success){
            let timeSetting = res.resource[0].value
            startTime = String(timeSetting) + ':00:00'
            endTime = fillZero(Number(timeSetting) - 1) + ':59:59'
        }
    })

    const date = new Date(dateStr);
    let end = dateFormat(date) + ' ' + startTime
    date.setDate(date.getDate() - 1)
    let start = dateFormat(date) + ' ' + endTime
    return [start,end]
}

const dateFormat = (date)=>{
    const yy = date.getFullYear()
    const mm = fillZero(date.getMonth() + 1)
    const dd = fillZero(date.getDate())
    return yy + '-' + mm + '-' + dd
}


module.exports = { getCurrentTime , checkNull , getTodayTimeRange , getSettingTimeRange , getExportTimeRange }