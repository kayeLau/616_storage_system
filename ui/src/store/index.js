import { createStore } from 'vuex'

export default createStore({
  state: {
    user:{
      token:'',
    }
  },
  getters: {
    token:state => state.user.token
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
