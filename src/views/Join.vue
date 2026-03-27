<template>
  <div class="join page">
    <h3>You've been invited to join room:</h3>

    <h2 class="room">
      <MessageSquare />
      {{ room }}
    </h2>

    <label for="username">Choose a username</label>
    <input type="text" v-model="username" @keyup.enter="enter()">

    <button @click="enter()">Continue</button>
  </div>
</template>

<script>
import { useUserStore } from '@/store'
import { MessageSquare } from 'lucide-vue-next'

export default {
  name: 'join',

  components: {
    MessageSquare
  },

  data() {
    return {
      room: this.$route.params.room,
      username: ''
    }
  },

  methods: {
    enter() {
      if (this.room && this.username) {
        useUserStore().setUser({ username: this.username, room: this.room })
        this.$router.push({ name: 'Chat', params: { username: this.username, room: this.room } })
      }
    }
  },

  mounted() {
    if (!this.$route.params.room) {
      this.$router.push({ name: 'Home' })
    }

    let username = useUserStore().user.username
    let room = this.$route.params.room
    let test = false

    if (username && test) {
      this.$router.push({ name: 'Chat', params: { username, room } })
    }
  }
}
</script>

<style lang="scss" scoped>
.join {
  max-width: 500px;
  text-align: center;

  .room {
    align-items: center;
    display: flex;
    justify-content: center;
    margin-top: 25px;

    svg {
      margin-right: 10px;
      opacity: .5;
      position: relative;
      top: 2px;
    }
  }

  label {
    margin-top: 50px;
  }

  button {
    display: inline-flex;
    margin-top: 50px;
  }
}
</style>
