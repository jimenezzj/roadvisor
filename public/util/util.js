const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = err => reject(err);
});

const getSession = JSON.parse(localStorage.getItem('session'));
/**
 * Return currert URL(protocal, domain, port)
 */
const getCurrentURL = window.location.protocol + '//'
    + window.location.hostname + ':'
    + window.location.port + '/';

const getNavbarOpts = JSON.parse(localStorage.getItem('navbar')) || null;
