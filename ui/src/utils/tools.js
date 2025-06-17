export function isPromise(value) {
    return Boolean(value && typeof value.then === 'function');
}

export function getDefaultDateRange(range = 1) {
    let date = new Date()
    let endDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0') + ' 23:59:59'
    date.setDate(date.getDate() - range)
    let startDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0') + ' 00:00:00'
    return [startDate, endDate]
}

export function getDefaultExportDate(exportDate) {
    let date = exportDate
    date.setDate(date.getDate() - 1)
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')
}