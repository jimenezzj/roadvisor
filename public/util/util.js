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



const getTopNavOpts = () => {
    const topNavOpts = JSON.parse(localStorage.getItem('topNav'));
    return {
        profilePic: `${getCurrentURL}${topNavOpts.profilePicture}`,
        name: topNavOpts.name,
        rol: topNavOpts.type,
        href: '#'
    }
}
// {
//     profilePic: 'http://localhost:8082/assets/images/userProfile/2020-03-30T055248.441Z_infinitystones@marvel.com_58af605285bfde99b935a47d590ca774.jpg',
//     name: 'Pepe',
//     rol: 'Tradicional',
//     href: '#'
// },