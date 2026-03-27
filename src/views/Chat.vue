<template>
  <div class="chat">
    <aside>
      <div>
        <h1 @click="leave()">Blabber</h1>

        <h3>
          <span class="title">
            <UsersIcon color="white" />
            <span>Users</span>
          </span>

          <span class="invite-user" @click="invite()">
            <UserPlus color="white" :size="20" />
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
        <p>Copyright {{ new Date().getFullYear() }}<span>&bullet;</span>Version {{ version }}</p>
      </div>
    </aside>

    <div>
      <div class="header">
        <div class="info">
          <div class="user" content="Username" v-tippy>
            <User />
            <p>{{ username }}</p>
          </div>

          <div class="room"  content="Room" v-tippy>
            <MessageSquare />
            <p>{{ room }}</p>
          </div>
        </div>
        <button @click="leave()">Leave room</button>
      </div>

      <div class="mobile-header">
        <div class="info">
          <div class="user" :content="username" v-tippy>
            <User />
          </div>

          <div class="room" :content="room" v-tippy>
            <MessageSquare />
          </div>

          <tippy trigger="click">
            <template v-slot:trigger>
              <UsersIcon />
            </template>

            <span>
              <Users :users="users" />
            </span>
          </tippy>

          <div class="invite-user">
            <UserPlus @click="invite()" />
          </div>
        </div>
        <button @click="leave()" class="icon">
          <LogOut color="white" />
        </button>
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
                  @keyup="typing(false), format()"
                  @keyup.enter="send()"
                  :disabled="uploading"
                  ref="messageInput">
          <div class="attached-file" :class="{ disabled: uploading }" v-if="attachment" ref="attachedFile">
            <span :content="attachment.name" v-tippy>{{ attachment.name }}</span>
            <X color="white" @click="removeAttachment()" />
          </div>
        </div>
        <label for="attachment-input" class="button icon" :class="{ disabled: uploading }" content="Attach file" v-tippy>
          <Paperclip color="white" />
        </label>
        <button class="icon" @click="send()" :content="uploading ? 'Sending...' : 'Send'" v-tippy>
          <Send v-if="!uploading" color="white" />
          <Loader :size="25" :thickness="3" :inverted="true" :color="'white'" v-if="uploading" />
        </button>

        <div v-if="uploadError" class="upload-error" @click="uploadError = false">
          <AlertCircle color="white" />
          <p>The attachment failed to upload, try again.</p>
        </div>
      </div>

      <input type="file" id="attachment-input" ref="attachmentInput" @change="attachFile($event.target.files[0])">
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/store'
import Users from '@/components/Users.vue'
import Messages from '@/components/Messages.vue'
import Loader from '@/components/Loader.vue'
import { Users as UsersIcon, UserPlus, User, MessageSquare, X, Paperclip, Send, AlertCircle, LogOut } from 'lucide-vue-next'
import { handleUrls, containsUrls } from '@/utils/urls'
import { upload } from '@/utils/upload'
import { getVideoDimensions } from '@/utils/video'
import { emojify } from '@/utils/emoji'

export default {
  name: 'Chat',

  components: {
    Users,
    Messages,
    Loader,
    UsersIcon,
    UserPlus,
    User,
    MessageSquare,
    X,
    Paperclip,
    Send,
    AlertCircle,
    LogOut
  },

  data() {
    const store = useUserStore()
    return {
      username: this.$route.params.username || store.user.username,
      room: this.$route.params.room || store.user.room,
      users: [],
      messages: [],
      connected: false,
      message: '',
      attachment: null,
      uploading: false,
      uploadError: false
    }
  },

  computed: {
    version() {
      return __APP_VERSION__
    }
  },

  methods: {
    async send() {
      if ((this.message || this.attachment) && !this.uploading) {
        let message = {
          message: this.message
        };

        if (this.attachment) {
          this.uploading = true;

          let response = await upload(this.attachment);

          if (response.isAxiosError) {
            if (this.message) {
              let confirm = await this.$dialog.confirm(
                'The upload failed 😟',
                'Do you still want to send your message?',
                { cancelText: 'No, cancel', okText: 'Yes, send it' }
              ).then(() => true).catch(() => false);

              if (!confirm) {
                this.uploading = false;
                return;
              }
            } else {
              this.uploading = false;
              this.uploadError = true;
              return;
            }
          } else {
            this.uploadError = false;
            message.attachment = response;

            if (message.attachment.type.startsWith('video')) {
              let { height, width } = await getVideoDimensions(response.url);

              message.attachment.height = height;
              message.attachment.width = width;
            }
          }
        }

        this.$socket.emit('message', message);
        this.$socket.emit('typing', false);
        this.message = '';
        this.uploading = false;
        this.removeAttachment();
      }
    },

    typing(isTyping) {
      let typing;

      if (isTyping) {
        clearTimeout(typing);
        this.$socket.emit('typing', true);
      } else {
        clearTimeout(typing);
        typing = setTimeout(() => {
          this.$socket.emit('typing', false);
        }, 4000);
      }
    },

    leave() {
      this.$dialog.confirm(
        'Are you sure you want to leave the room?',
        "You won't be receiving new messages until you rejoin.",
        { cancelText: 'Cancel' }
      ).then(() => {
        this.room = null;
        this.$socket.emit('leave');
        useUserStore().clearUser();
        this.$router.push({ name: 'Home' });
      }).catch(() => {});
    },

    invite() {
      const joinUrl = `${window.location.origin}/join/${this.room}`;
      navigator.clipboard.writeText(joinUrl).catch(() => {});
      this.$dialog.alert('Invite link copied!', joinUrl);
    },

    format() {
      if (this.message) {
        this.message = emojify(this.message);
      }
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
    },
  },

  created() {
    if (!this.username || !this.room) {
      this.$router.push({ name: 'Home' });
      return;
    }

    this.$socket.on('users', (users) => { this.users = users; });
    this.$socket.on('messageChannel', (message) => { this.handleMessage(message); });
    this.$socket.emit('join', { username: this.username, room: this.room });
  },

  beforeUnmount() {
    this.$socket.off('users');
    this.$socket.off('messageChannel');
  },

  watch: {
    $route() {
      this.$socket.emit('leave');
    }
  },

  beforeRouteLeave(to, from, next) {
    if (this.room) {
      this.$dialog.confirm(
        'Are you sure you want to leave the room?',
        "You won't be receiving new messages until you rejoin.",
        { cancelText: 'Cancel' }
      ).then(() => next()).catch(() => next(false));
    } else {
      next();
    }
  }
}
</script>

<style lang="scss" scoped>
@use 'sass:color';

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

    @include mobile {
      display: none;
    }

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

          svg {
            margin-right: 6px;
          }
        }

        svg {
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

    @include mobile {
      width: 100%;
    }

    .header {
      align-items: center;
      display: flex;
      justify-content: space-between;
      padding: 25px;
      width: 100%;

      @include mobile {
        display: none;
      }

      .info {
        cursor: default;
        display: flex;

        div {
          align-items: center;
          display: flex;
          margin: 0 20px;

          svg {
            margin-right: 8px;
            position: relative;
            top: 2px;
          }

          p {
            font-size: 16px;
          }
        }
      }
    }

    .mobile-header {
      @extend .header;
      display: none;
      padding: 10px;

      @include mobile {
        display: flex;
      }

      .info > div {
        margin: 0 0 0 5px;

        + div {
          margin-left: 30px;
        }

        svg {
          margin: 0;
        }
      }
    }

    .main {
      height: calc(100vh - 162px); // Negative height for header and footer heights
      padding: 25px;
      position: relative;
      overflow-y: auto;
      width: 100%;

      @include mobile {
        height: calc(100vh - 126px); // Negative height for header and footer heights
      }
    }

    .footer {
      $footer-padding: 25px;

      @include mobile {
        $footer-padding: 10px;
      }

      align-items: center;
      display: flex;
      justify-content: space-between;
      padding: $footer-padding;
      position: relative;
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

          svg {
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

      .upload-error {
        align-items: center;
        background: #ee5253;
        border-radius: 100px;
        color: white;
        cursor: pointer;
        display: flex;
        left: $footer-padding;
        padding: 5px 10px;
        position: absolute;
        top: 0;
        transform: translateY(-50%);
        transition: .25s ease;
        width: calc(100% - #{$footer-padding * 2});

        @include mobile {
          transform: translateY(-100%);
        }

        &:hover {
          background: color.adjust(#ee5253, $lightness: 5%);
        }

        svg {
          margin-right: 6px;
          position: relative;
          top: 1px;

          @include mobile {
            :deep(svg) {
              height: 22px;
              width: 22px;
            }
          }
        }

        p {
          font-size: 16px;
          padding-right: 10px;

          @include mobile {
            font-size: 14px;
          }
        }
      }
    }

    #attachment-input {
      display: none;
    }
  }
}
</style>
