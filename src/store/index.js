import { defineStore } from 'pinia'

const defaultUser = {
  username: '',
  room: ''
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: { ...defaultUser }
  }),
  actions: {
    getStoredUser() {
      const stored = localStorage.getItem('blabber')
      this.user = (stored ? JSON.parse(stored) : null) || { ...defaultUser }
      this.storeUser()
    },

    setUser(user) {
      this.user = user
      this.storeUser()
    },

    clearUser() {
      this.user = { ...defaultUser }
      this.storeUser()
    },

    storeUser() {
      localStorage.setItem('blabber', JSON.stringify(this.user))
    }
  }
})
