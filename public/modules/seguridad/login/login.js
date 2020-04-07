const userNameField = document.querySelector('#username');
const passwordField = document.querySelector('#password');

const setAutoLogout = () => {

};

const logoutHandler = () => {

};

document.querySelector('#btnIniciarSesion').addEventListener('click', () => {
    const userValue = userNameField.value;
    const passwrodValue = passwordField.value;
    fetch('http://localhost:8082/signup', {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            email: userValue,
            password: passwrodValue,
        })
    })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            const { nombre, pApellido, correo, tipo, token, expiresTime } = res.data;
            const session = {
                correo: correo,
                nombre: nombre,
                pApellido: pApellido,
                token: token,
                type: tipo,
                isAuth: true,
                expireTime: expiresTime
            };
            const urlToRedirect = '/index.html';
            localStorage.setItem('session', JSON.stringify(session));
            // redirect To HTML HOME
            window.location.assign(
                window.location.protocol + '//'
                + window.location.hostname + ':'
                + window.location.port + urlToRedirect
            );
            // window.location.replace(
            //     window.location.protocol + '//'
            //     + window.location.hostname + ':'
            //     + window.location.port + '/'
            //     + 'index.html'
            // );
        })
        .catch(err => {
            console.error(err);
        });

});