// test/order.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const Order = require('../dist/controllers/order_controller');
const order = new Order()
const Shop = require('../dist/controllers/shop_controller');
const shop = new Shop()
const { initializeDatabase } = require("../dist/data-source");

// 模拟 req, res, next
let req, res, next;

const orderList = [
  {
    "productId": 2,
    "orderQuantity": 1,
    "orderMode": 0
  },
  {
    "productId": 4,
    "orderQuantity": 1,
    "orderMode": 0
  },
  {
    "productId": 10,
    "orderQuantity": 1,
    "orderMode": 0
  },
  {
    "productId": 267,
    "orderQuantity": 1,
    "orderMode": 0
  },
  {
    "productId": 27,
    "orderQuantity": 1,
    "orderMode": 0
  },
  {
    "productId": 28,
    "orderQuantity": 1,
    "orderMode": 0
  },
  {
    "productId": 33,
    "orderQuantity": 1,
    "orderMode": 0
  },
  {
    "productId": 40,
    "orderQuantity": 1,
    "orderMode": 0
  },
  {
    "productId": 41,
    "orderQuantity": 1,
    "orderMode": 0
  },
  {
    "productId": 91,
    "orderQuantity": 1,
    "orderMode": 0
  },
  {
    "productId": 92,
    "orderQuantity": 1,
    "orderMode": 0
  },
  {
    "productId": 135,
    "orderQuantity": 1,
    "orderMode": 0
  },
  {
    "productId": 136,
    "orderQuantity": 1,
    "orderMode": 0
  },
  {
    "productId": 246,
    "orderQuantity": 1,
    "orderMode": 0
  }
]
let orderInfo = {}

describe('Order Controller 單元測試', function () {
  let sandbox;

  before(async () => {
    await initializeDatabase()
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      userInfo: {
        id: '0001',
        name: '測試用戶',
        shopId: '3f3d234b-c9c6-498d-bd92-3c3c8a77282b',
        auth: 0,
      }
    };

    res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    next = sinon.spy();
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(async () => {

  });

  describe('createOrder - 創建訂單', () => {
    it('應成功添加訂單', async () => {

      await order.checkOrderRepeated(req, res, next);
      const result1 = res.json.getCall(0).args[0];
      expect(result1.success).to.be.true;


      if(!result1.data.children.length){
        req.body = { orderList: orderList }
        await order.createOrder(req, res, next);
      }

      const result2 = res.json.getCall(0).args[0];
      expect(result2.success).to.be.true;

    });
  });

  describe('checkOrderRepeated - 查看當天是否已下單', () => {
    it('應獲取到一個訂單, 且訂單children內容與orderList一致', async () => {

      await order.checkOrderRepeated(req, res, next);

      const result = res.json.getCall(0).args[0];
      const _orderList = result.data.children.map(item => {
        return {
          productId: item.productId,
          orderQuantity: item.orderQuantity,
          orderMode: item.orderMode
        }
      })
      orderInfo = result.data
      expect(result.success).to.be.true;
      expect(result.data.state).to.equal(0);
      expect(orderList).to.include.deep.members(_orderList);

    });
  });

  describe('getshopIdListByAuth - 根據權限獲取分店列表', () => {
    it(`
      1)應根據角色權限獲取不同的訂單 -1:所有分店 0-1:自身分店 2:分區下的所有分店
      `, async () => {

      const orderShopId01 = await order.getshopIdListByAuth(1, req.userInfo, '');
      expect(orderShopId01).to.equal(req.userInfo.shopId);

      const userInfo = {
        id: '0002',
        name: '分區經理',
        auth: 2,
        shopPartition: 6
      }
      const shopList = [
        '09c4bfbc-bc1f-4bb9-8618-5d73bdf0ea51',
        'b81327a3-c600-4f5f-82c0-1fa0ccdb18ec',
        'e103f4cf-1e55-43f0-9320-eade2db83cc5',
        '7aa2bdf3-2098-47d4-ae4a-3d61664b1e0c',
        'f9b6396c-a755-44bf-bfc9-db4457586a5c',
        'db9b1d55-4afe-4a11-80e1-1ddc80bf6248',
        '95f8c32d-20e7-4ffc-89d1-8dd559412069',
        '2d55757a-5d1b-4678-8f4f-58503c82d211',
        'd98a4e3d-6ee6-47f5-9c5c-0c598c803a67',
        'd91f87c7-aa02-4fe3-a904-0db5f3eb5270',
        'e4d788f1-85f8-402a-945b-b6c84967ea70',
        '4099a290-755e-4ee6-9ed0-26dc4a1fa2d5',
        'f07b03de-885b-4ca0-87a9-9a57852f16b6',
        'd7425951-aadd-4f5f-9b4c-4a7e696570ae',
        '1942d15a-ca5a-4392-9466-7e285ad479e7',
        '4930d7e9-efc0-4860-87eb-050d80b8305e'
      ]
      const orderShopId2 = await order.getshopIdListByAuth(2, userInfo, '09c4bfbc-bc1f-4bb9-8618-5d73bdf0ea51');
      expect(orderShopId2).to.include.deep.members(shopList);

    });
  });

  describe('readOrder - 獲取訂單列表', () => {
    it(`
      1)訂單isToday應為1
      2)orderIndex應與下單次數一致
      `, async () => {
      const today = new Date()
      const endDay = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      today.setDate(today.getDate() - 1)
      const startDay = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()

      req.body = { updateDate: [startDay + ' 00:00:00', endDay + ' 23:59:59'] }
      await order.readOrder(req, res, next);

      const result = res.json.getCall(0).args[0];
      const data = result.data[0]
      expect(result.success).to.be.true;
      expect(data.isToday).to.equal('1');
      expect(data.orderIndex).to.equal(orderInfo.orderIndex);

    });
  });

  describe('readOrderDetail - 獲取訂單明細', () => {
    it(`
      1)訂單明細只應存在對應年份的分表中
      `, async () => {
      req.body = { orderId: orderInfo.id, orderDate: '2025-11-16' }
      await order.readOrderDetail(req, res, next);
      const result1 = res.json.getCall(0).args[0];
      expect(result1.data.length).to.equal(0);



      req.body = { orderId: orderInfo.id, orderDate: orderInfo.orderDate }
      await order.readOrderDetail(req, res, next);
      const result2 = res.json.getCall(0).args[0];
      const _orderList = result2.data.map(item => {
        return {
          productId: item.productId,
          orderQuantity: item.orderQuantity,
          orderMode: item.orderMode
        }
      })
      expect(result2.success).to.be.true;
      expect(orderList).to.include.deep.members(_orderList);
    });
  });

});