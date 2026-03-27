<template>
  <div class="about page">
    <h2>About</h2>
    <p>Blabber is an anonymous real-time chat application made primarily to better my understanding of WebSockets. Built with <a href="https://nodejs.org/en/">Node</a>, <a href="https://expressjs.com/">Express</a>, <a href="https://socket.io/">Socket.io</a> &amp; <a href="https://vuejs.org/">Vue</a>, the entire code base is open source and available on <a href="https://github.com/carlssonemil/blabber">GitHub</a>.</p>

    <h3>How does it work?</h3>
    <p>Enter a username and room of your choosing on the front page, send an invite to your friends and start chatting. Simple as that!</p>
    <p class="sub">If you leave the chat page you won't be receiving any new messages, and old messages are not restored upon return.</p>

    <h3>Features</h3>
    <div class="features">
      <div class="feature" v-for="(feature, index) in features" :key="index">
        <component :is="feature.icon" />
        <span>{{ feature.feature }}</span>
      </div>
    </div>

    <p class="sub">If you have any questions or feature suggestions, please contact me at <a href="mailto:hello@emilcarlsson.se">hello@emilcarlsson.se</a>.</p>
  </div>
</template>

<script>
import { ArrowLeftRight, Shield, Paperclip, Film, Image, UserPlus } from 'lucide-vue-next'

export default {
  name: 'about',

  data() {
    return {
      features: [
        {
          icon: ArrowLeftRight,
          feature: 'Real-time messaging'
        },
        {
          icon: Shield,
          feature: 'Completely anonymous'
        },
        {
          icon: Paperclip,
          feature: 'Attach and download files'
        },
        {
          icon: Film,
          feature: 'Video & audio embedding'
        },
        {
          icon: Image,
          feature: 'Image embedding'
        },
        {
          icon: UserPlus,
          feature: 'Send invitation to current room'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
.features {
  display: grid;
  grid-gap: 25px;
  grid-template-columns: 1fr 1fr 1fr;

  @include mobile {
    grid-template-columns: 1fr;
  }

  .feature {
    align-items: center;
    border-radius: 4px;
    cursor: default;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 15px;
    text-align: center;
    transition: .25s ease;

    &:hover {
      background-color: color.adjust(white, $lightness: -4%);

      svg {
        opacity: .75;
      }
    }

    svg {
      opacity: .4;
      transition: .25s ease;
    }

    span {
      line-height: 1.4;
      margin-top: 10px
    }
  }
}

h2 {
  margin-bottom: 30px;
}

h3 {
  margin: 40px 0 20px;
}

p {
  margin-bottom: 15px;

  &.sub {
    &:last-child {
      margin-top: 75px;

      @include mobile {
        margin-top: 35px;
      }
    }
  }
}
</style>
