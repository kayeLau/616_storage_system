import "reflect-metadata"
import { DataSource } from "typeorm"
import { Member } from "./entity/Member"
import { Setting } from "./entity/Setting"
import { Partition } from "./entity/Partition"
import { Shop } from "./entity/Shop"
import { ShopProduct } from "./entity/ShopProduct"
import { Product } from "./entity/Product"

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Iqaqeq18",
    database: "616_storage_system",
    synchronize: true,
    logging: false,
    entities: [Setting, Member, Partition, Shop , ShopProduct, Product],
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