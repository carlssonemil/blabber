import axios from 'axios';

const regExps = {
  image: /\.(jpe?g|gif|png|webp)(?=\?|$)/,
  video: /\.(mp4)(?=\?|$)/,
  audio: /\.(mp3)(?=\?|$)/,
  embeds: {
    youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
    vimeo: /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+$/
  }
};

async function handleEmbeds(url) {

  switch (url) {

    // Handle images
    case (url.match(regExps.image) || {}).input:
      return {
        type: 'image',
        content: `<img src="${url}" />`
      };

    // Handle videos
    case (url.match(regExps.video) || {}).input:
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

    // Handle audio
    case (url.match(regExps.audio) || {}).input:
      return {
        type: 'audio',
        content: 
          `<audio
            controls>
            <source src="${url}" type="audio/mpeg">
            Your browser does not support the audio tag.
          </audio>`
      };

    // Handle youtube
    case (url.match(regExps.embeds.youtube) || {}).input: {
      const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      const youtubeID = match[2];

      return {
        type: 'video',
        content: 
        `<iframe
            src="https://www.youtube.com/embed/${youtubeID}"
            allowfullscreen
            allowtransparency
            allow="autoplay"
          ></iframe>`
      };
    }

    // Handle vimeo
    case (url.match(regExps.embeds.vimeo) || {}).input:
      return await axios.get(`https://vimeo.com/api/oembed.json?url=${url}`)
        .then(response => {
          return {
            type: 'video',
            height: response.data.height,
            width: response.data.width,
            content: 
            `<iframe
                src="https://player.vimeo.com/video/${response.data.video_id}"
                webkitallowfullscreen 
                mozallowfullscreen 
                allowfullscreen
              ></iframe>`
          }
        }).catch(error => { console.error(error); });

    default:
      return null;
  }
}

export { handleEmbeds };