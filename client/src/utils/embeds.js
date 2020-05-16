import { getVideoDimensions } from "./video";

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
      let { height, width } = await getVideoDimensions(url);

      return {
        type: 'video',
        height,
        width,
        content: 
          `<video controls>
            <source src="${url}">
          </video>`
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