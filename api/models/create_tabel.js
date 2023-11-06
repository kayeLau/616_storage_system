const db = require('./connection_db')
const config = require("../config/development_config")

const sql_tabel = [
    {
        name: 'member_info',
        sql: `CREATE TABLE member_info (
            id VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
            name VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
            password VARCHAR(40) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
            auth INT(10) NULL DEFAULT NULL COMMENT '0:管理員 1:前線樓面 2:前線廚房',
            shopId VARCHAR(50) NULL DEFAULT NULL COMMENT '用戶所屬分店編號' COLLATE 'utf8mb4_0900_ai_ci',
            shopName VARCHAR(50) NULL DEFAULT NULL COMMENT '用戶所屬分店名稱' COLLATE 'utf8mb4_0900_ai_ci',
            createDate DATETIME NULL DEFAULT NULL,
            updateDate DATETIME NULL DEFAULT NULL,
            PRIMARY KEY (id) USING BTREE
        )`
    },
    {
        name: 'order_detail_info',
        sql: `CREATE TABLE order_detail_info (
            id INT(10) NOT NULL AUTO_INCREMENT,
            orderId VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
            productCode VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
            productName VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
            orderQuantity FLOAT NOT NULL COMMENT '下單數量',
            assignQuantity FLOAT NOT NULL COMMENT '分配數量',
            unit VARCHAR(10) NOT NULL DEFAULT '' COMMENT '單位' COLLATE 'utf8mb4_0900_ai_ci',
            updateDate DATETIME NULL DEFAULT NULL,
            PRIMARY KEY (id) USING BTREE,
            INDEX FK_order_detail_info_order_info (orderId) USING BTREE,
            CONSTRAINT FK_order_detail_info_order_info FOREIGN KEY (orderId) REFERENCES order_info (id) ON UPDATE NO ACTION ON DELETE NO ACTION
        )`
    },
    {
        name: 'order_info',
        sql: `CREATE TABLE order_info (
            id VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
            orderCode VARCHAR(10) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
            status INT(10) NOT NULL,
            orderUserId VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
            orderUserName VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
            orderShopId VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
            orderShopName VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
            department INT(10) NOT NULL COMMENT '0:廚房 1:樓面',
            createDate DATETIME NOT NULL,
            updateDate DATETIME NOT NULL,
            PRIMARY KEY (id) USING BTREE
        )`
    },
    {
        name: 'product_info',
        sql: `CREATE TABLE product_info (
            department INT(10) NOT NULL DEFAULT '0' COMMENT '0:廚房 1:樓面',
            freezersNum INT(10) NOT NULL DEFAULT '0' COMMENT '雪房號碼 0:干貨',
            productCode VARCHAR(50) NOT NULL COMMENT '商品編號' COLLATE 'utf8mb4_0900_ai_ci',
            productName VARCHAR(50) NOT NULL COMMENT '商品名稱' COLLATE 'utf8mb4_0900_ai_ci',
            unit VARCHAR(10) NULL DEFAULT NULL COMMENT '單位' COLLATE 'utf8mb4_0900_ai_ci',
            standard VARCHAR(50) NULL DEFAULT '0' COMMENT '規格' COLLATE 'utf8mb4_0900_ai_ci',
            createDate DATETIME NULL DEFAULT NULL,
            updateDate DATETIME NULL DEFAULT NULL,
            PRIMARY KEY (productCode) USING BTREE
        )`
    },
    {
        name: 'shop_info',
        sql: `CREATE TABLE shop_info (
            shopId VARCHAR(50) NOT NULL COMMENT '店铺id' COLLATE 'utf8mb4_0900_ai_ci',
            shopType INT(10) NOT NULL COMMENT '0:616 ',
            shopName VARCHAR(50) NOT NULL COMMENT '店铺名称' COLLATE 'utf8mb4_0900_ai_ci',
            productCount INT(10) NULL DEFAULT NULL COMMENT '產品種類',
            createDate DATETIME NULL DEFAULT NULL,
            updateDate DATETIME NULL DEFAULT NULL,
            PRIMARY KEY (shopId) USING BTREE
        )`
    },
    {
        name: 'shop_product_info',
        sql: `CREATE TABLE shop_product_info (
            id VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
            shopId VARCHAR(50) NOT NULL COMMENT '店舖名称' COLLATE 'utf8mb4_0900_ai_ci',
            productCode VARCHAR(50) NOT NULL DEFAULT '' COMMENT '產品編號' COLLATE 'utf8mb4_0900_ai_ci',
            createDate DATETIME NULL DEFAULT NULL,
            updateDate DATETIME NULL DEFAULT NULL,
            PRIMARY KEY (id) USING BTREE,
            INDEX FK_shop_product_info_shop_info (shopId) USING BTREE,
            CONSTRAINT FK_shop_product_info_shop_info FOREIGN KEY (shopId) REFERENCES shop_info (shopId) ON UPDATE NO ACTION ON DELETE NO ACTION
        )`
    },
]

checkTabel()

function checkTabel() {
    sql_tabel.forEach(item => {
        db.query(`SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${config.mysql.database}' AND table_name = '${item.name}'`, (err, result) => {
            if (err) throw err;
            if (result[0].count > 0) {
                console.log(item.name + ' Tabel exists');
            } else {
                createTabel(item)
            }
        });
    })
}

function createTabel(sqlItem) {
    db.query(sqlItem.sql, (err, result) => {
        if (err) throw err;
        console.log(sqlItem.name + ' Table created');
    });
}
