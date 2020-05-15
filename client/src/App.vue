<template>
  <div id="app">
    <header v-if="showHeader">
      <h1 @click="$router.push({ name: 'Home' })">Blabber</h1>
      <button @click="$router.push({ name: 'Chat' })">{{ headerButtonText }}</button>
    </header>

    <main>
      <router-view/>
    </main>

    <footer v-if="showFooter">
      <nav>
        <router-link to="/about">About</router-link>
        <router-link to="/support">Support</router-link>
        <router-link to="/privacy">Privacy</router-link>
        <router-link to="/terms">Terms</router-link>
      </nav>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showHeader: false,
      showFooter: false 
    }
  },

  computed: {
    headerButtonText() {
      return this.$store.state.user.room ? 'Return to chat' : 'Start chatting';
    }
  },

  methods: {
    updateUI(route) {
      switch (route) {
        case '/':
          this.showHeader = false;
          this.showFooter = true;
          break;
        case '/chat':
          this.showHeader = false;
          this.showFooter = false;
          break;
        default:
          this.showHeader = true;
          this.showFooter = true;
          break;
      }
    }
  },

  async mounted() {
    await this.$store.dispatch('getStoredUser');

    this.updateUI(this.$route.path);

    //let user = this.$store.state.user;

    //if (user.room) {
    //  this.$router.push({ name: 'Chat', params: user });
    //}
  },

  watch: {
    $route() {
      this.updateUI(this.$route.path);
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import '@/scss/main';

.input-container {
  margin: 5px 0;

  + .input-container {
    margin-top: 20px;
  }
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  > header, > footer {
    margin: 0 auto;
    max-width: 700px;
    padding: 50px 25px;
    width: 95%;
  }

  > header {
    align-items: center;
    display: flex;
    justify-content: space-between;

    h1 {
      cursor: pointer;
      transition: .25s ease;

      &:hover {
        color: rgba(black, .8);
      }
    }
  }

  > main {
    flex-grow: 1;
  }

  > footer {
    font-size: 16px;
    text-align: center;

    nav {
      a {
        text-decoration: none;

        &:hover {
          opacity: 1;
          text-decoration: underline;
        }

        + a {
          margin-left: 50px;
        }
      }
    }
  }
}
</style>
