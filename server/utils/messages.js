const oembed = require('oembed');
const { wrapURLs, containsUrls, extractUrls } = require('./urls');

async function formatMessage(user, message, attachment) {
  let messages = [];

  // Create default message
  messages.push({
    user,
    message: {
      attachment: attachment || null,
      content: containsUrls(message) ? wrapURLs(message) : message,
      type: attachment && !message ? 'attachment' : 'message' 
    },
    timestamp: new Date()
  });

  // If message contains URL, try to embed URL content
  if (containsUrls(message)) {
    const urls = extractUrls(message);

    for (let url of urls) {
      let content = await embed(url).then(response => response);

      if (content) {
        messages.push({
          user,
          message: { oembed: content },
          timestamp: new Date()
        })
      }
    }
  }

  return messages;
}

async function embed(url) {
  return new Promise(resolve => {
    oembed.fetch(url, {}, (error, response) => {
      if (error) {
        return resolve(null);
      }
  
      return resolve(response);
    });
  });
}

function formatNotice(message) {
  const user = {
    id: 1,
    username: 'Blabber Bot'
  }

  return {
    user,
    message: {
      content: message,
      type: 'notice' 
    },
    timestamp: new Date()
  }
}

module.exports = {
  formatMessage,
  formatNotice
}