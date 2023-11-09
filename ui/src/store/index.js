import { createStore } from 'vuex'

export default createStore({
  state: {
    user:{
      token:'',
    },
    orderList:[]
  },
  getters: {
    token:state => state.user.token,
    orderList:state => state.orderList
  },
  mutations: {
    setOrderList(state,orderList){
      state.orderList = orderList
    }
  },
  actions: {
    commitOrderListStatus(store,orderList){
      store.commit('setOrderList', orderList)
    },
  },
  modules: {
  }
})
