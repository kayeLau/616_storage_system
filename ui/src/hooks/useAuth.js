import { readMenuAuth } from '../request/menuAuth';

let menuMap = {};
const permissionMap = {};

async function getMenuAuth() {
    await readMenuAuth().then(res => {
        if (res.success) {
            res.data.forEach(item => {
                if (item.type === 0) {
                    menuMap[item.name] = item
                } else if (item.type === 1) {
                    permissionMap[item.name] = item
                }
            });
        }
    })
}


function checkPermission(name) {
    return permissionMap[name] ? true : false
}

function hideComponent(name) {
    return !permissionMap[name] ? true : false
}

async function generateRoutes(routes, key){
    await getMenuAuth()
    return routes.filter(item => {
        return menuMap[key === 'path' ? item.path : item.name]
    })
}

function clearMenuMap(){
    menuMap = {};
}


export const useMenuAuth = () => {
    return { menuMap , generateRoutes , clearMenuMap , checkPermission, hideComponent };
};
