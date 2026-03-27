import axios from 'axios'

const uploadURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/upload';

async function upload(attachment) {
  let formData = new FormData();
  formData.append('file', attachment);

  return await axios.post(uploadURL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(response => {
      return {
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
        url: response.data
      }
    })
    .catch(error => {
      return error;
    });
}

export { upload };