import "reflect-metadata"
import { DataSource } from "typeorm"
import { Member } from "./entity/Member"
import { Setting } from "./entity/Setting"
import { Partition } from "./entity/Partition"
import { Shop } from "./entity/Shop"
import { ShopProduct } from "./entity/ShopProduct"
import { Product } from "./entity/Product"
import { Order } from "./entity/Order"
import { OrderDetail } from "./entity/OrderDetail"
import { Inventory } from "./entity/Inventory"
import { Menu } from "./entity/Menu"
import { TasteOptions } from "./entity/TasteOptions"
import { Api } from "./entity/Api"
const config = require('./config/development_config')

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    synchronize: true,
    logging: false,
    entities: [ Setting, Member, Partition, Shop , ShopProduct, 
        Product, Order, OrderDetail, Inventory, Api, Menu , TasteOptions],
    migrations: [],
    subscribers: [],
})

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

export default AppDataSource;