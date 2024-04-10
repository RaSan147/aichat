import { createStore } from 'vuex'

export default createStore({
  state: {
    auditData: null
  },
  getters: {
    getAuditData(state) {
      return state.auditData;
    }
  },
  mutations: {
    setAuditData(state, newData) {
      state.auditData = newData;
    }
  },
  actions: {
  },
  modules: {
  }
})
