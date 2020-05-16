<template>
  <div class="chat">
    <aside>
      <div>
        <h1 @click="leave()">Blabber</h1>

        <h3>
          <span class="title">
            <eva-icon name="people-outline" fill="white"></eva-icon>
            <span>Users</span>
          </span>

          <span class="invite-user" @click="invite()">
            <eva-icon name="person-add-outline" fill="white" width="20" height="20"></eva-icon>
            <span>Invite users</span>
          </span>
        </h3>
        <div class="users">
          <Users :users="users" />
        </div>
      </div>

      <div class="site-info">
        <nav>
          <router-link to="/about">About</router-link>
          <router-link to="/support">Support</router-link>
          <router-link to="/privacy">Privacy</router-link>
          <router-link to="/terms">Terms</router-link>
        </nav>
        <p>Copyright {{ new Date().getFullYear() }}<span>&bullet;</span><a href="">Version {{ version }}</a></p>
      </div>
    </aside>

    <div>
      <div class="header">
        <div class="info">
          <div class="user" content="Username" v-tippy>
            <eva-icon name="person-outline"></eva-icon>
            <p>{{ username }}</p>
          </div>

          <div class="room"  content="Room" v-tippy>
            <eva-icon name="message-square-outline"></eva-icon>
            <p>{{ room }}</p>
          </div>
        </div>
        <button @click="leave()">Leave room</button>
      </div>

      <div class="main">
          <Messages :messages="messages" />
      </div>

      <div class="footer">
        <div class="message-input">
          <input  type="text" 
                  placeholder="Enter message..." 
                  v-model="message" 
                  @keydown="typing(true)"
                  @keyup="typing(false)" 
                  @keyup.enter="send()"
                  :disabled="uploading"
                  ref="messageInput">
          <div class="attached-file" :class="{ disabled: uploading }" v-if="attachment" ref="attachedFile">
            <span :content="attachment.name" v-tippy>{{ attachment.name }}</span>
            <eva-icon name="close-outline" fill="white" @click="removeAttachment()"></eva-icon>
          </div>
        </div>
        <label for="attachment-input" class="button icon" :class="{ disabled: uploading }" content="Attach file" v-tippy>
          <eva-icon name="attach-outline" fill="white"></eva-icon>
        </label>
        <button class="icon" @click="send()" :content="uploading ? 'Sending...' : 'Send'" v-tippy>
          <eva-icon v-if="!uploading" name="paper-plane-outline" fill="white"></eva-icon>
          <Loader :size="25" :thickness="3" :inverted="true" :color="'white'" v-if="uploading" />
        </button>
      </div>

      <input type="file" id="attachment-input" ref="attachmentInput" @change="attachFile($event.target.files[0])">
    </div>
  </div>
</template>

<script>
import Users from '@/components/Users.vue'
import Messages from '@/components/Messages.vue'
import Loader from '@/components/Loader.vue'
import axios from 'axios'

const { handleUrls, containsUrls, wrapURLs } = require('@/utils/urls');

export default {
  name: 'Chat',

  components: {
    Users,
    Messages,
    Loader
  },

  data() {
    return {
      username: this.$route.params.username || this.$store.state.user.username,
      room: this.$route.params.room || this.$store.state.user.room,
      users: [],
      messages: [],
      connected: false,
      message: '',
      attachment: null,
      uploading: false
    }
  },

  computed: {
    version() {
      return require('../../../package.json').version;
    }
  },

  sockets: {
    users(users) {
      this.users = users;
    },

    messageChannel(message) {
      this.handleMessage(message);
    }
  },

  methods: {
    async send() {
      if ((this.message || this.attachment) && !this.uploading) {
        let message = {
          message: this.message
        };

        if (this.attachment) {
          let formData = new FormData();

          formData.append('file', this.attachment);
          
          this.uploading = true;

          await axios.post('https://cors-anywhere.herokuapp.com/https://uguu.se/api.php?d=upload-tool', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            crossdomain: true
          })
          .then(response => {
            message.attachment = {
              name: this.attachment.name,
              type: this.attachment.type,
              size: this.attachment.size,
              url: response.data
            }
          })
          .catch(error => {
            console.error(error);
          });
        }

        this.$socket.client.emit('message', message);
        this.$socket.client.emit('typing', false);
        this.message = '';
        this.uploading = false;
        this.removeAttachment();
      }
    },

    typing(isTyping) {
      let typing;

      if (isTyping) {
        clearTimeout(typing);
        this.$socket.client.emit('typing', true);
      } else {
        clearTimeout(typing);
        typing = setTimeout(() => {
          this.$socket.client.emit('typing', false);
        }, 4000);
      }
    },

    leave() {
      this.$dialog.confirm(`
        <h3>Are you sure you want to leave the room?</h3>
        <p>You won't be recieving new messages until you rejoin.</p>
        `, { html: true, cancelText: 'Cancel', backdropClose: true })
          .then(() => {
            this.room = null;
            this.$socket.client.emit('leave');
            this.$store.dispatch('clearUser');
            this.$router.push({ name: 'Home' });
          })
          .catch(() => {
            return;
          });
    },

    invite() {
      const joinUrl = `${window.location.origin}/join/${this.room}`;

      let html = `
        <h3 style="margin-bottom: 20px">Send the link below to a friend</h3>
        <div class="copy">
          <input type="text" value="${joinUrl}" />
          <button onclick="copyToClipboard(this, '${joinUrl}')">Copy</button>
        </div>
      `;

      this.$dialog.alert(html, { html: true, okText: 'Close', backdropClose: true });
    },

    attachFile(file) {
      this.attachment = file;

      this.$nextTick(() => {
        this.$refs.messageInput.style.paddingRight = this.$refs.attachedFile.offsetWidth + 20 + 'px';
      });
    },

    removeAttachment() {
      this.attachment = null;
      this.$refs.messageInput.style.paddingRight = null;
      this.$refs.attachmentInput.value = null;
    },

    async handleMessage(message) {
      let additionalMessages = [];

      if (containsUrls(message.message.content)) {
        additionalMessages = await handleUrls(message.message.content, message);
        message.message.content = wrapURLs(message.message.content);
      }

      this.messages.push(message);

      if (additionalMessages) {
        for (let additionalMessage of additionalMessages) {
          this.messages.push(additionalMessage);
        }
      }

      this.$nextTick(() => {
        const element = document.querySelector('.main');
        element.scrollTop = element.scrollHeight;
      });
    }
  },

  created() {
    if (!this.username || !this.room) {
      this.$router.push({ name: 'Home' });
    }

    this.$socket.client.emit('join', { username: this.username, room: this.room });
  },

  watch: {
    $route() {
      this.$socket.client.emit('leave');
    }
  },

  beforeRouteLeave(to, from, next) {
    if (this.room) {
      this.$dialog.confirm(`
        <h3>Are you sure you want to leave the room?</h3>
        <p>You won't be recieving new messages until you rejoin.</p>
        `, { html: true, cancelText: 'Cancel', backdropClose: true })
          .then(() => {
            next();
          })
          .catch(() => {
            next(false);
          });
    } else {
      next();
    }
  }
}
</script>

<style lang="scss" scoped>
.chat {
  display: flex;
  height: 100%;

  aside {
    background: black;
    color: white;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    max-height: 100vh;
    width: 350px;

    > div:not([class]) {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    h1 {
      cursor: pointer;
      padding: 30px 30px 0;
      transition: .25s ease;

      &:hover {
        color: rgba(white, .8);
      }
    }

    h3 {
      align-items: center;
      display: flex;
      justify-content: space-between;
      margin: 50px 0 10px;
      padding: 0 30px 0;

      span {
        align-items: center;
        display: inline-flex;

        &.title {
          cursor: default;
        }

        &.invite-user {
          cursor: pointer;
          font-size: 14px;
          opacity: .5;
          transition: .25s ease;

          &:hover {
            opacity: 1;
          }

          i {
            margin-right: 6px;
          }
        }

        i {
          margin-right: 10px;
          position: relative;
          top: 1px;
        }
      }
    }

    .users {
      margin: 20px 0 50px;
      padding: 0 30px;
      overflow-y: auto;
    }

    .site-info {
      padding: 0 30px 30px;

      nav {
        font-size: 14px;
        margin-bottom: 20px;

        a {
          color: white;

          + a {
            margin-left: 20px;
          }
        }
      }

      p {
        color: rgba(white, .5);
        font-size: 12px;

        span {
          margin: 0 10px;
        }

        a {
          color: rgba(white, .5);
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  > div {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: calc(100% - 350px);

    .header {
      align-items: center;
      display: flex;
      justify-content: space-between;
      padding: 25px;
      width: 100%;

      .info {
        cursor: default;
        display: flex;

        div {
          align-items: center;
          display: flex;
          margin: 0 20px;

          i {
            margin-right: 8px;
            position: relative;
            top: 2px;
          }
        }
      }
    }

    .main {
      height: calc(100vh - 192px); // Negative height for header and footer heights
      padding: 25px;
      position: relative;
      overflow-y: auto;
      width: 100%;
    }

    .footer {
      align-items: center;
      display: flex;
      justify-content: space-between;
      padding: 25px;
      width: 100%;

      .message-input {
        position: relative;
        width: 100%;

        .attached-file {
          align-items: center;
          background: black;
          border-radius: 100px;
          color: white;
          display: flex;
          font-size: 14px;
          max-width: 40%;
          overflow: hidden;
          padding: 5px 8px;
          position: absolute;
          right: 7px;
          top: 50%;
          transform: translateY(-50%);

          &.disabled {
            opacity: .5;
            pointer-events: none;
          }

          span {
            overflow: hidden;
            padding: 4px;
            text-overflow: ellipsis;
          }

          i {
            cursor: pointer;
            position: relative;
            top: 1px;
          }
        }
      }

      label {
        margin: 0;
      }

      .button, button {
        margin-left: 10px;
      }
    }

    #attachment-input {
      display: none;
    }
  }
}
</style>