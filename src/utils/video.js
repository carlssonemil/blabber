async function getVideoDimensions(url) {
  return new Promise(resolve => {
    const video = document.createElement('video');
    video.src = url;
    video.style.position = 'fixed';
    video.style.bottom = '0';
    video.style.left = '0';
    video.style.opacity = '0';

    document.body.appendChild(video);

    return video.addEventListener('loadedmetadata', () => {
      document.body.removeChild(video);
      return resolve({ height: video.videoHeight, width: video.videoWidth });
    });
  });
}

export { getVideoDimensions }