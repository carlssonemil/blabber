function formatMessage(user, message, type) {
  if (!type) type = 'message';
  
  return {
    user,
    message: {
      type: message.attachment && !message.message ? 'attachment' : type,
      content: message.attachment ? message.message : message,
      attachment: message.attachment || null
    },
    timestamp: new Date()
  }
}

module.exports = formatMessage;