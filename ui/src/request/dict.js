export const authDict = {
    0:"管理員",
    1:"前線樓面 ",
    2:"前線廚房",
}

export const freezersNumDict = {
    0:"乾貨",
    1:"一號雪房 ",
    3:"三號雪房",
    4:"四號雪房 ",
    5:"五號雪房",
}

export const departmentDict = {
    0:"廚房",
    1:"樓面"
}

export const shopType = {
    0:'616牛肉火鍋專門店'
}

export function dictToOptions(dict){
    let res = []
    Object.keys(dict).forEach(key => {
        res.push({
            label:dict[key],value:key
        })
    })
    return res
}