const db = require('./connection_db')
const config = require("../config/development_config")

// INDEX FK_order_detail_info_order_info (orderId) USING BTREE,
// CONSTRAINT FK_order_detail_info_order_info FOREIGN KEY (orderId) REFERENCES order_info (id) ON UPDATE NO ACTION ON DELETE NO ACTION
const sql_tabel = [
    {
        name: 'member_info',
        sql: `CREATE TABLE member_info (
            id VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	        name VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	        password VARCHAR(40) NOT NULL COLLATE 'utf8mb4_general_ci',
	        auth INT(10) NOT NULL COMMENT '-1:管理員 0:廚房 1:樓面 2:分區經理',
	        shopPartition INT(10) NULL DEFAULT NULL COMMENT '分區經理所屬分區',
	        shopId VARCHAR(50) NULL DEFAULT NULL COMMENT '用戶所屬分店編號' COLLATE 'utf8mb4_general_ci',
	        shopName VARCHAR(50) NULL DEFAULT NULL COMMENT '用戶所屬分店名稱' COLLATE 'utf8mb4_general_ci',
	        createDate DATETIME NULL DEFAULT NULL,
	        updateDate DATETIME NULL DEFAULT NULL,
	        PRIMARY KEY (id) USING BTREE
        )`
    },
    {
        name: 'order_detail_info',
        sql: `CREATE TABLE order_detail_info (
            id INT(10) NOT NULL AUTO_INCREMENT,
            orderId VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
            productCode VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
            productName VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
            orderQuantity FLOAT NOT NULL COMMENT '下單數量',
            assignQuantity FLOAT NULL DEFAULT NULL COMMENT '分配數量',
            unit VARCHAR(50) NOT NULL DEFAULT '' COMMENT '單位' COLLATE 'utf8mb4_general_ci',
            standard VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
            updateDate DATETIME NULL DEFAULT NULL,
            orderMode INT(10) NULL DEFAULT NULL COMMENT '下單模式 0:前線 1:系統',
            status INT(10) NULL DEFAULT '0' COMMENT '分配狀態 0:未分配 1:已分配',
            remark TEXT NULL DEFAULT NULL COMMENT '備注' COLLATE 'utf8mb4_general_ci',
            PRIMARY KEY (id) USING BTREE,
            INDEX FK_order_detail_info_order_info (orderId) USING BTREE,
            CONSTRAINT FK_order_detail_info_order_info FOREIGN KEY (orderId) REFERENCES order_info (id) ON UPDATE NO ACTION ON DELETE NO ACTION
        )`
    },
    {
        name: 'order_info',
        sql: `CREATE TABLE order_info (
            id VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
            orderCode VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
            orderUserId VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
            orderUserName VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
            orderShopId VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
            department INT(10) NOT NULL COMMENT '0:廚房 1:樓面',
            createDate DATETIME NOT NULL,
            updateDate DATETIME NOT NULL,
            orderDate DATE NOT NULL,
            PRIMARY KEY (id) USING BTREE
        )`
    },
    {
        name: 'product_info',
        sql: `CREATE TABLE product_info (
            productCode VARCHAR(50) NOT NULL COMMENT '商品編號' COLLATE 'utf8mb4_general_ci',
            department INT(10) NOT NULL COMMENT '0:廚房 1:樓面',
            freezersNum INT(10) NOT NULL COMMENT '雪房號碼 0:干貨',
            classify INT(10) NOT NULL COMMENT '分類',
            productName VARCHAR(50) NOT NULL COMMENT '商品名稱' COLLATE 'utf8mb4_general_ci',
            unit VARCHAR(10) NULL DEFAULT NULL COMMENT '單位' COLLATE 'utf8mb4_general_ci',
            standard VARCHAR(50) NULL DEFAULT NULL COMMENT '規格' COLLATE 'utf8mb4_general_ci',
            createDate DATETIME NULL DEFAULT NULL,
            updateDate DATETIME NULL DEFAULT NULL,
            disable INT(10) NOT NULL COMMENT '0:否 1:是',
            summary INT(10) NOT NULL COMMENT '匯總 0:不需要 1:需要',
            PRIMARY KEY (productCode) USING BTREE
        )`
    },
    {
        name: 'shop_info',
        sql: `CREATE TABLE shop_info (
            shopId VARCHAR(50) NOT NULL COMMENT '店铺id' COLLATE 'utf8mb4_general_ci',
            shopCode VARCHAR(50) NOT NULL COMMENT '店舖編號' COLLATE 'utf8mb4_general_ci',
            shopType INT(10) NOT NULL COMMENT '0:616 ',
            shopName VARCHAR(50) NOT NULL COMMENT '店铺名称' COLLATE 'utf8mb4_general_ci',
            shopPartition INT(10) NULL DEFAULT NULL COMMENT '所屬分區',
            productCount INT(10) NULL DEFAULT NULL COMMENT '產品種類',
            createDate DATETIME NULL DEFAULT NULL,
            updateDate DATETIME NULL DEFAULT NULL,
            PRIMARY KEY (shopId) USING BTREE
        )`
    },
    {
        name: 'partition_info',
        sql: `CREATE TABLE partition_info (
            id INT(10) NOT NULL AUTO_INCREMENT,
            partitionName VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
            updateDate DATETIME NULL DEFAULT NULL,
            PRIMARY KEY (id) USING BTREE
        )`
    },
    {
        name: 'shop_product_info',
        sql: `CREATE TABLE shop_product_info (
            id VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
            shopId VARCHAR(50) NOT NULL COMMENT '店舖名称' COLLATE 'utf8mb4_general_ci',
            productCode VARCHAR(50) NOT NULL DEFAULT '' COMMENT '產品編號' COLLATE 'utf8mb4_general_ci',
            createDate DATETIME NULL DEFAULT NULL,
            updateDate DATETIME NULL DEFAULT NULL,
            PRIMARY KEY (id) USING BTREE,
            INDEX FK_shop_product_info_shop_info (shopId) USING BTREE,
            CONSTRAINT FK_shop_product_info_shop_info FOREIGN KEY (shopId) REFERENCES shop_info (shopId) ON UPDATE NO ACTION ON DELETE NO ACTION
        )`
    },
    {
        name: 'setting_info',
        sql: `CREATE TABLE setting_info (
            id INT(10) NOT NULL AUTO_INCREMENT,
            name VARCHAR(50) NULL DEFAULT NULL COMMENT '設定名稱' COLLATE 'utf8mb4_general_ci',
            value VARCHAR(50) NULL DEFAULT NULL COMMENT '設定值' COLLATE 'utf8mb4_general_ci',
            updateDate DATETIME NULL DEFAULT NULL,
            PRIMARY KEY (id) USING BTREE,
            UNIQUE INDEX name (name) USING BTREE
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
