<template>
  <Teleport to="body">
    <div class="dialog-overlay" v-if="state.visible" @click.self="cancel">
      <div class="dialog">
        <h3 v-if="state.title">{{ state.title }}</h3>
        <p v-if="state.body" class="dialog-body">{{ state.body }}</p>
        <div class="dialog-actions">
          <button v-if="state.type === 'confirm'" class="secondary" @click="cancel">
            {{ state.cancelText }}
          </button>
          <button @click="ok">{{ state.okText }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { dialogState } from '@/plugins/dialog'

export default {
  name: 'AppDialog',

  computed: {
    state() {
      return dialogState
    }
  },

  methods: {
    ok() {
      dialogState.visible = false
      if (dialogState.resolve) dialogState.resolve()
    },
    cancel() {
      dialogState.visible = false
      if (dialogState.reject) dialogState.reject()
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-overlay {
  align-items: center;
  background: rgba(black, 0.5);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
}

.dialog {
  background: white;
  border-radius: 12px;
  max-width: 420px;
  padding: 30px;
  width: 90%;

  h3 {
    margin-bottom: 10px;
  }

  .dialog-body {
    color: rgba(black, 0.6);
    margin-bottom: 25px;
    word-break: break-all;
  }

  .dialog-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
}
</style>
