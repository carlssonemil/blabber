<template>
  <div id="messages" ref="messages" v-if="messages">
    <div class="message"
         v-for="(message, index) in messages" 
         :key="index"
         :class="{ 
           mine: message.user.id === socketId, 
           notice: message.message.type === 'notice'
         }"
         :style="{ marginBottom: (index + 1 === messages.length || messages[index + 1].user.id !== message.user.id) ? '40px' : null }">

      <p class="username" v-if="message.message.type !== 'notice' && messages[index - 1].user.id !== message.user.id">
        {{ message.user.username }}
      </p>

      <div class="content" 
          v-if="message.message.content && message.message.type !== 'attachment'" 
          :data-type="message.message.type" 
          v-html="message.message.content"
          :style="{ 
            paddingBottom: message.message.type.startsWith('video') ? (message.message.height / message.message.width) * 100 + '%' : null,
            width: message.message.type.startsWith('video') || message.message.type === 'notice' ? '100%' : 'auto'
          }">
      </div>

      <div v-if="message.message.oembed && message.message.oembed.type !== 'rich' && message.message.oembed.type !== 'video'" 
          class="content oembed image"
          :data-type="message.message.oembed.type">
        <img v-if="message.message.oembed.type.startsWith('photo') || message.message.oembed.type.startsWith('image')" 
             :src="message.message.oembed.url">
      </div>

      <div v-if="message.message.oembed && message.message.oembed.type === 'video'"
           class="content oembed video"
           :data-type="message.message.oembed.type"
           v-html="message.message.oembed.html"
           :style="{
             paddingBottom: (message.message.oembed.height / message.message.oembed.width) * 100 + '%',
             width: '100%'
           }">
      </div>

      <div class="content attachment" 
          v-if="message.message.attachment" 
          :data-type="message.message.attachment.type"
          :style="{
            paddingBottom: message.message.attachment.type.startsWith('video') ? (message.message.attachment.height / message.message.attachment.width) * 100 + '%' : null,
            width: message.message.attachment.type.startsWith('video') ? '100%' : 'auto'
          }">

        <img v-if="message.message.attachment.type.startsWith('image')" :src="message.message.attachment.url">

        <audio v-else-if="message.message.attachment.type.startsWith('audio')" controls>
          <source :src="message.message.attachment.url" :type="message.message.attachment.type">
          Your browser does not support the audio tag.
        </audio>

        <iframe v-else-if="message.message.attachment.type.startsWith('video')"
            :src="message.message.attachment.url"
            allowfullscreen
            allowtransparency
            allow="autoplay"
          ></iframe>

        <div v-else>
          <eva-icon name="attach-outline" :fill="message.user.id === socketId ? 'white' : 'black'" width="14" height="14"></eva-icon>
          <a :href="message.message.attachment.url" target="_blank">{{ message.message.attachment.name }}</a>
        </div>
      </div>

      <p class="timestamp"
         :content="moment(message.timestamp).format('YYYY-MM-DD HH:mm:ss')"
         v-tippy="{ placement: 'bottom', size: 'small' }"
         v-if="message.message.type !== 'notice' && (index + 1 === messages.length || messages[index + 1].user.id !== message.user.id)">
        {{ moment(message.timestamp).format('HH:mm') }}
      </p>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'messages',
  props: [
    'messages'
  ],
  methods: {
    moment,
  },
  computed: {
    socketId() {
      return this.$socket.client.id;
    }
  }
}
</script>

<style lang="scss" scoped>
#messages {
  display: flex;
  flex-direction: column;

  .message {
    $border-radius: 20px;

    align-self: flex-start;
    display: flex;
    flex-direction: column;
    max-width: 40vw;
    text-align: left;
    width: 100%;

    .username, .timestamp {
      align-self: flex-start;
      color: darken(white, 40%);
      cursor: default;
      display: block;
      font-size: 12px;
      font-weight: 500;
    }

    .content {
      align-self: flex-start;
      background: rgb(240, 238, 234);
      border-top-right-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
      border-bottom-left-radius: $border-radius;
      font-weight: 500;
      padding: 10px 15px;
      margin: 5px 0;

      &.attachment > div {
        align-items: center;
        display: flex;

        i {
          margin-right: 8px;
          position: relative;
          top: 2px;
          transform: scale(1.3);
        }
      }

      /deep/ a {
        word-break: break-word;
      }

      /deep/ img {
        width: 100%;
      }

      &[data-type^="image"],
      &[data-type^="photo"] {
        background: none !important;
        overflow: hidden;
        padding: 0 !important;

        /deep/ img {
          transform: scale(1.02);
        }
      }

      &[data-type^="video"] {
        background: none !important;
        height: 0;
        overflow: hidden;
        padding: 0 0 56.25%;
        position: relative;

        /deep/ iframe {
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }

        /deep/ video {
          width: 100%;
        }
      }

      &[data-type^="audio"] {
        background: none !important;
        padding: 0;
      }
    }

    &.mine {
      align-self: flex-end;

      .content {
        align-self: flex-end;
        background: black;
        border-top-right-radius: 0;
        border-top-left-radius: $border-radius;
        color: white;

        /deep/ a {
          color: white;
        }
      }

      .timestamp, .username {
        align-self: flex-end;
      }
    }

    &.notice {
      cursor: default;
      max-width: 100%;
      width: 100%;

      .content {
        background: none;
        color: darken(white, 40%);
        font-size: 14px;
        text-align: center;
        width: 100%;
      }
    }
  }
}

</style>