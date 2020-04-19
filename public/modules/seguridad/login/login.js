const userNameField = document.querySelector('#username');
const passwordField = document.querySelector('#password');

const setAutoLogout = () => {

};

const logoutHandler = () => {

};

document.querySelector('#btnIniciarSesion').addEventListener('click', () => {
    const userValue = userNameField.value;
    const passwrodValue = passwordField.value;
    fetch('http://localhost:8082/auth/login', {
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
            if (res.statusCode === 401) {
                const error = new Error(res.message);
                error.data = res.data;
                throw error;
            }
            const { nombre, pApellido, correo, tipo, token, expiresTime, profilePicture } = res.data;
            const session = {
                correo: correo,
                nombre: nombre,
                pApellido: pApellido,
                token: 'Bearer: ' + token,
                type: tipo,
                isAuth: true,
                expireTime: expiresTime
            };
            localStorage.setItem('session', JSON.stringify(session));
            console.log(res);
            //store navBar options
            localStorage.setItem('navbar', JSON.stringify(generataSideNavbarLinks(tipo)));
            localStorage.setItem('topNav', JSON.stringify({
                profilePicture: profilePicture,
                name: `${nombre} ${pApellido}`,
                type: tipo.replace(/^[a-z]/, tipo.slice(0, 1).toUpperCase()),
                href: '#'
            }))
            // redirect To HTML HOME
            redirect(session.type);
        })
        .catch(err => {
            console.error(err);
            if (err.data) {
                Object.keys(err.data).forEach(key => {
                    showErrorMessages(key, err.message);
                });
            }
        });

});


const showErrorMessages = (field, message) => {
    let errorEle;
    switch (field) {
        case 'password':
            errorEle = document.querySelector('.password-error');
            errorEle.innerHTML = message;
            errorEle.classList.add('errorMessage--show');
            break;
        case 'email':
            errorEle = document.querySelector('.correo-error');
            errorEle.innerHTML = message;
            errorEle.classList.add('errorMessage--show');

            break;
        default:
            break;
    }
}

const redirect = (role) => {
    let urlToRedirect = 'modules/';
    const userRole = role.toLowerCase();
    if (userRole === 'tradicional' || userRole === 'servicios') {
        urlToRedirect = urlToRedirect + 'siniestros/siniestros.html';
    } else if (userRole === 'ruta') {
        urlToRedirect = urlToRedirect + 'rutas/rutas.html';
    } else if (userRole === 'admin') {
        urlToRedirect = urlToRedirect + 'users/users.html';

    }
    window.location.assign(
        getCurrentURL + urlToRedirect
    );
}

const clearErrors = (e) => {
    // console.dir(e.target);
    const targetError = e.target.parentElement.parentElement.querySelector('.errorMessage');
    if (targetError.classList.contains('errorMessage--show')) {
        targetError.innerHTML = '';
    }

}
document.querySelectorAll('.fieldWrapper input').forEach(i => {
    i.addEventListener('keyup', clearErrors)
});