const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = err => reject(err);
});

const getSession = JSON.parse(localStorage.getItem('session'));

const getCurrentURL = window.location.protocol + '//'
    + window.location.hostname + ':'
    + window.location.port + '/';
