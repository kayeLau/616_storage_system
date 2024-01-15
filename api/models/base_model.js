const db = require('./connection_db')
const logger = require("../utils/log");

// @params
// getRepeat 是否需要取出重复项，如果是重复项不会被拦截
function checkRepeated(table, options , getRepeat = false) {
    let result = {}
    let optionsSQL = optionsSQLFromatter(options, table)
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${table} ${optionsSQL}`, (err, row) => {
            if (err) {
                result.msg = "server error,please try again"
                result.success = false
                logger.info(err);
                reject(result)
                return
            }
            if (row.length >= 1) {
                result.msg = "創建項已存在"
                result.success = getRepeat
                result.resource = row
                getRepeat ? resolve(result) : reject(result);
            } else {
                result.msg = "success"
                result.success = true
                result.resource = []
                resolve(result)
            }
        })
    })
}

function createNew(table, data) {
    let result = {}
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO ${table} SET ?`, [data], (err) => {
            if (err) {
                result.msg = "server error,please try again"
                result.success = false
                logger.info(err)
                reject(result)
                return
            }
            result.msg = "success"
            result.success = true
            resolve(result)
        })
    })
}

function updateItem(table, data, key, value) {
    let result = {}
    return new Promise((resolve, reject) => {
        db.query(`UPDATE ${table} SET ? where ${key} = ?`, [data, value], (err) => {
            if (err) {
                result.msg = "server error,please try again"
                result.success = false
                reject(result);
                return
            }
            result.msg = "update success"
            result.success = true
            resolve(result);
        })
    })
}

function deleteItem(table, key, value) {
    let result = {}
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM ${table} where ${key} = ?`, [value], (err) => {
            if (err) {
                result.msg = "server error,please try again"
                result.success = false
                reject(result);
                return
            }
            result.msg = "delete success"
            result.success = true
            resolve(result);
        })
    })
}

// @params
function optionsSQLFromatter(options, table) {
    let whereClause = ''
    for (const key in options) {
        if (options.hasOwnProperty(key)) {
            if (options[key] === null || options[key] === undefined || options[key] === '') continue;
            let query
            switch (key) {
                case 'updateDate':
                    query = `${table}.${key} BETWEEN '${options[key][0]}' AND '${options[key][1]}'`
                    break
                case 'createDate':
                    query = `${table}.${key} BETWEEN '${options[key][0]}' AND '${options[key][1]}'`
                    break
                case 'productName':
                    query = `${table}.${key} LIKE '%${options[key]}%'`
                    break
                default:
                    if(Array.isArray(options[key])){
                        query = '(' + options[key].reduce((accumulator, currentValue, index) => index === 0 ? `${key} = '${currentValue}'` : `${accumulator} OR ${key} = '${currentValue}'`, '') + ')'
                    }else{
                        query = `${table}.${key} = '${options[key]}'`
                    }
                    break
            }
            if (whereClause === '') {
                whereClause += ` WHERE ${query}`;
            } else {
                whereClause += ` AND ${query}`;
            }
        }
    }
    return whereClause
}

function getItems({ table, options, size, page, orderby = 'updateDate', sort = 'DESC', join , columns }) {
    let result = {}
    return new Promise((resolve, reject) => {
        let optionsSQL = optionsSQLFromatter(options, table)
        db.query(`SELECT COUNT(*) AS total FROM ${table} ${optionsSQL}`, (err, rows) => {
            if (err) {
                console.log(err)
                result.msg = "server error, please try again";
                result.success = false;
                reject(result);
                return;
            }
            result.total = rows[0].total || 0;
        })
        let defaultColumns = `* , DATE_FORMAT(${table}.updateDate,'%Y-%m-%d %H:%i:%S') AS updateDate`
        db.query(`SELECT ${ columns ? columns : defaultColumns }
        FROM ${join ? join : table} ${optionsSQL} ORDER BY ${table}.${orderby} ${sort} 
        LIMIT ${size} OFFSET ${(page - 1) * size}`, (err, rows) => {
            if (err) {
                console.log(err)
                result.msg = "server error,please try again"
                result.success = false
                reject(result);
                return
            }
            result.msg = "get success"
            result.resource = rows
            result.success = true
            resolve(result);
        })
    })
}

function getAllItem(table, options) {
    let result = {}
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${table} where ?`, [options], (err, rows) => {
            if (err) {
                result.msg = "server error,please try again"
                result.success = false
                reject(result);
                return
            }
            result.msg = "get success"
            result.resource = rows
            result.success = true
            resolve(result);
        })
    })
}

function customQuery(query, options = []) {
    let result = {}
    return new Promise((resolve, reject) => {
        db.query(query, options, (err, rows) => {
            if (err) {
                console.log(err)
                result.msg = "server error,please try again"
                result.success = false
                reject(result);
                return
            }
            result.msg = "get success"
            result.resource = rows
            result.success = true
            resolve(result);
        })
    })
}

module.exports = { checkRepeated, createNew, updateItem, deleteItem, getItems, getAllItem, optionsSQLFromatter, customQuery }