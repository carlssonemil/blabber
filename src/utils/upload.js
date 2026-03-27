import axios from 'axios'

const uploadURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/upload';

async function upload(attachments) {
  let formData = new FormData();
  attachments.forEach(file => formData.append('files[]', file));

  return await axios.post(uploadURL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(response => {
      return attachments.map((file, i) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: response.data[i]
      }));
    })
    .catch(error => {
      return error;
    });
}

export { upload };