<template>
  <div class="home page">
    <div class="form-container">
      <div class="title">
        <h1>Blabber</h1>
        <p class="subtitle">Anonymous chatting {{ randomEmoji }}</p>
      </div>

      <div class="input-container">
        <label for="username">Username</label>
        <input id="username" type="text" v-model="username" @keyup.enter="enter()">
      </div>

      <div class="input-container">
        <label for="room">Room</label>
        <input id="room" type="text" v-model="room" @keyup.enter="enter()">
      </div>

      <button @click="enter()">Enter room</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  
  data() {
    return {
      username: '',
      room: '',

      emojis: [
        '😎',
        '🤗',
        '✌️',
        '🤟',
        '🖖',
        '👋',
        '🤙',
        '😄',
        '🤠',
        '🥳',
        '🤫',
        '🤭',
        '🧐',
        '🤐'
      ]
    }
  },

  computed: {
    randomEmoji() {
      return this.emojis[Math.floor(Math.random() * this.emojis.length)];
    }
  },

  methods: {
    enter() {
      if (this.room && this.username) {
        this.$store.dispatch('setUser', { username: this.username, room: this.room });
        this.$router.push({ name: 'Chat', params: { username: this.username, room: this.room } });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 20vh;
}

.title {
  margin-bottom: 50px;
  text-align: center;

  h1 {
    font-size: 36px;
    margin-bottom: 20px;
  }

  .subtitle {
    font-size: 20px;
  }
}

.form-container {
  flex-grow: 1;
  margin: 0 auto;
  max-width: 300px;
  width: 90%;

  button {
    margin-top: 50px;
    width: 100%;
  }
}
</style>
