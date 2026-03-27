import { reactive } from 'vue'

export const dialogState = reactive({
  visible: false,
  type: 'confirm',
  title: '',
  body: '',
  okText: 'OK',
  cancelText: 'Cancel',
  resolve: null,
  reject: null
})

export const dialogPlugin = {
  install(app) {
    const dialog = {
      confirm(title, body, { okText = 'OK', cancelText = 'Cancel' } = {}) {
        return new Promise((resolve, reject) => {
          Object.assign(dialogState, {
            visible: true,
            type: 'confirm',
            title,
            body,
            okText,
            cancelText,
            resolve,
            reject
          })
        })
      },
      alert(title, body, { okText = 'OK' } = {}) {
        return new Promise((resolve) => {
          Object.assign(dialogState, {
            visible: true,
            type: 'alert',
            title,
            body,
            okText,
            cancelText: '',
            resolve,
            reject: null
          })
        })
      }
    }

    app.config.globalProperties.$dialog = dialog
  }
}
