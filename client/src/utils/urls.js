const { handleEmbeds } = require('@/utils/embeds');

async function handleUrls(text, message) {
  const urls = [...new Set(extractUrls(text).map(url => url.replace(/<\/a>|"/, '')))];

  let additionalMessages = [];

  for (let url of urls) {
    let embedMessage = await handleEmbeds(url);

    if (embedMessage) {
      additionalMessages.push({
        ...message,
        message: embedMessage
      });
    }
  }
  return additionalMessages;
}

function containsUrls(text) {
  const urlRegex = "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?";
  return new RegExp(urlRegex).test(text);
}

function extractUrls(text) {
  const urlRegex = /(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}\-\x{ffff}0-9]+-?)*[a-z\x{00a1}\-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}\-\x{ffff}0-9]+-?)*[a-z\x{00a1}\-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}\-\x{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/ig;

  const urls = text.match(urlRegex) || [];

  return urls;
}

export { handleUrls, containsUrls, extractUrls }