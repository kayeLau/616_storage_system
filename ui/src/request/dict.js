export const onlineStateDict = {
    0:"離線",
    1:"在線",
}
export const authDict = {
    '-1':"管理員",
    0:"前線廚房",
    1:"前線樓面",
    2:"分區經理",
    3:"工埸",
}

export const classifySort = [0, 3, 1, 2, 5, 6, 7, 9, 11, 4, 8, 12, 14, 15, 16, 18]

export const classifyDict = {
    0: '616特色',
    1: '616推介',
    2: '616罕有',
    3: '湯底',
    4: '牛肉',
    5: '午市',
    6: '蔬菜',
    7: '醬料',
    8: '小食',
    10:'海鮮',
    11:'福食',
    12:'豬類',
    13:'飲品',
    14:'雜貨',
    15:'其他',
    17:'外賣產品'
}

export const freezersNumDict = {
    1:"一號雪房 ",
    3:"三號雪房",
    4:"四號雪房 ",
    5:"五號雪房",
    6:"乾貨",
    7:"鮮肉",
}

export const orderStateDict = {
    0:"未分配",
    1:"已分配",
    2:"追加中"
}
export const orderStateColor = (state) => {
    let color = state === 0 ? 'var(--el-color-danger)' : state === 1 ? 'var(--el-color-success)' : 'var(--el-color-warning)'
    return `color:${color}`
  }

export const departmentDict = {
    0:"廚房",
    1:"樓面"
}

export const shopType = {
    0:'616牛肉火鍋專門店',
    2:'616燒肉酒場',
    3:'虎喰燒肉·洒場',
    4:'616客香邨'
}

export const orderMode = {
    0:'前線',
    1:'追加',
}

export const productDisable = {
    0:'啟用',
    1:'隱藏',
}

export const productSummary = {
    0:'不需要',
    1:'需要',
}

export function dictToOptions(dict){
    let res = []
    Object.keys(dict).forEach(key => {
        res.push({
            label:dict[key],
            value:key
        })
    })
    return res
}

export function dictToFilterOptions(dict){
    let res = []
    Object.keys(dict).forEach(key => {
        res.push({
            text:dict[key],
            value:key
        })
    })
    return res
}