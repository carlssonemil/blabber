const regExps = {
  image: /\.(jpe?g|gif|png|webp)(?=\?|$)/,
  video: /\.(mp4)(?=\?|$)/,
  audio: /\.(mp3|wav)(?=\?|$)/
};

async function handleEmbeds(url) {

  switch (url) {

    // Handle images
    case (url.match(regExps.image) || {}).input: {
      return {
        type: 'image',
        content: `<img src="${url}" />`
      };
    }

    // Handle videos
    case (url.match(regExps.video) || {}).input: {
      return {
        type: 'video',
        content: 
          `<iframe
            src="${url}"
            allowfullscreen
            allowtransparency
            allow="autoplay"
          ></iframe>`
      };
    }

    // Handle audio
    case (url.match(regExps.audio) || {}).input: {
      return {
        type: 'audio',
        content: 
          `<audio
            controls>
            <source src="${url}">
            Your browser does not support the audio tag.
          </audio>`
      };
    }

    default:
      return null;
  }
}

export { handleEmbeds };