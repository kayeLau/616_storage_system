export const authDict = {
    '-1':"管理員",
    0:"前線廚房",
    1:"前線樓面 ",
    2:"分區經理 ",
}

export const freezersNumDict = {
    0:"乾貨",
    1:"一號雪房 ",
    3:"三號雪房",
    4:"四號雪房 ",
    5:"五號雪房",
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