export function isPromise(value) {
    return Boolean(value && typeof value.then === 'function');
}

export function getDefaultDateRange(range = 1) {
    let date = new Date()
    let endDate = formatterDate(date,'-') + ' 23:59:59'
    date.setDate(date.getDate() - range)
    let startDate = formatterDate(date,'-') + ' 00:00:00'
    return [startDate, endDate]
}

export function getDefaultExportDate() {
    let date = new Date()
    date.setDate(date.getDate() - 1)
    return formatterDate(date,'-')
}

export function formatterDate(date, spilt = ''){
    const _date = String(date.getDate()).padStart(2, '0')
    const _month = String(date.getMonth() + 1).padStart(2, '0')
    const _year = date.getFullYear()
    return _year + spilt + _month + spilt + _date
}