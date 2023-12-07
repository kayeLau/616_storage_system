const { getSettingItems } = require('../controllers/setting_controller')

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
    const yy = date.getFullYear()
    const mm = fillZero(date.getMonth() + 1)
    const dd = fillZero(date.getDate())
    const start = yy + '-' + mm + '-' + dd + ' 00:00:00'
    const end = yy + '-' + mm + '-' + dd + ' 23:59:59'
    return [start,end]
}

const getSettingTimeRange = async() => {
    getSettingItems({name:lastOrder,size:999,page:1}).then(res => {
        if(res.success){

        }
    })
    const date = new Date()
    const yy = date.getFullYear()
    const mm = fillZero(date.getMonth() + 1)
    const dd = fillZero(date.getDate())
    const start = yy + '-' + mm + '-' + dd + ' 00:00:00'
    const end = yy + '-' + mm + '-' + dd + ' 23:59:59'
    return [start,end]
}

module.exports = { getCurrentTime , checkNull , getTodayTimeRange , getSettingTimeRange }