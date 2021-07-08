<template>
  <div class="join page">
    <h3>You've been invited to join room:</h3>

    <h2 class="room">
      <eva-icon name="message-square-outline"></eva-icon>
      {{ room }}
    </h2>

    <label for="username">Choose a username</label>
    <input type="text" v-model="username" @keyup.enter="enter()">

    <button @click="enter()">Continue</button>
  </div>
</template>

<script>
export default {
  name: 'join',

  data() {
    return {
      room: this.$route.params.room,
      username: ''
    }
  },

  methods: {
    enter() {
      if (this.room && this.username) {
        this.$store.dispatch('setUser', { username: this.username, room: this.room });
        this.$router.push({ name: 'Chat', params: { username: this.username, room: this.room } });
      }
    }
  },

  mounted() {
    if (!this.$route.params.room) {
      console.log('hello');
      this.$router.push({ name: 'Home' });
    }

    let username = this.$store.state.user.username;
    let room = this.$route.params.room;
    let test = false;

    if (username && test) {
      this.$router.push({ name: 'Chat', params: { username, room } });
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

    i {
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