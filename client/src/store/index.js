import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const defaultUser = {
  username: '',
  room: ''
}

export default new Vuex.Store({
  state: {
    user: defaultUser
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user || defaultUser;
    },

    CLEAR_USER(state) {
      state.user = defaultUser;
    }
  },
  actions: {
    getStoredUser(context) {
      const user = localStorage.getItem('blabber');
      context.commit('SET_USER', JSON.parse(user));
      context.dispatch('storeUser');
    },

    setUser(context, user) {
      context.commit('SET_USER', user);
      context.dispatch('storeUser');
    },

    clearUser(context) {
      context.commit('CLEAR_USER');
      context.dispatch('storeUser');
    },

    storeUser() {
      localStorage.setItem('blabber', JSON.stringify(this.state.user));
    }
  },
  modules: {
  }
})
