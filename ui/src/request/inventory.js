import request from '@/utils/request'

export function readInventory(data) {
    return request({
        url: '/inventory/readInventory',
        method: 'post',
        data,
    });
}

export function createInventory(data) {
    return request({
        url: '/inventory/createInventory',
        method: 'post',
        data,
    });
}

export function updateInventory(data) {
    return request({
        url: '/inventory/updateInventory',
        method: 'post',
        data,
    });
}
