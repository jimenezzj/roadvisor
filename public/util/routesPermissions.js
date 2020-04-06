/*********************************    HTML ELEMENTS    *************************************/
const getMainWrapper = document.querySelector('.wrapperContainer') || document.body;

const createMessageEle = (text) => {
    const pEle = document.createElement('p');
    pEle.innerHTML = text;
    return pEle;
}
/********************************* Logic for routes verification *********************************/
const getCurrentRoute = () => {
    return window.location.href.toString();
}

const getCurrentSection = () => {
    const splittedURL = getCurrentRoute().split('/');
    const getSection = splittedURL[(splittedURL.findIndex(rVal => rVal === 'modules') + 1)];
    return getSection;
}

const setAutoLogoutTimer = () => {
    if (isAuthenticated().status) {
        // if (localStorage.getItem(logoutStartTime)) localStorage.setItem('logoutStartTime', currentDateMs);
        const session = JSON.parse(localStorage.getItem('session'));
        const currentDateMs = new Date().getTime();
        const remainingTime = new Date(session.expireTime).getTime() - currentDateMs;
        setTimeout(() => {
            console.log('Logout the user')
        }, remainingTime);
        console.log(remainingTime / 1000 / 60);
        console.log(remainingTime);
        console.log((remainingTime - (1.65 * 1000 * 60 * 60)) / 1000 / 60);
    } else {
        console.error('No se esta autenticado o token invalido');
    }
};

const isRoleAuthorized = () => {
    const routesPermissions = usersPermisions.find(route => route.path === getCurrentSection());
    const session = JSON.parse(localStorage.getItem('session'));
    if (session) {
        return !!(routesPermissions.roles.find(rol => rol === type))
            ? { status: true }
            : { status: false, message: 'No esta autorizado para accceder a esta sección' };
    } else {
        console.error('No se esta autenticado o token invalido');
        return result = {
            status: false,
            message: 'No esta autenticado'
        };
    }
}

const isAuthenticated = () => {
    const session = JSON.parse(localStorage.getItem('session'));
    let result;
    if (!session) {
        result = {
            status: false,
            message: 'No esta autenticado'
        };
    } else {
        if (new Date(session.expiresTime).getTime() < new Date().getTime()) {
            result = {
                status: false,
                message: 'No esta autenticado, su tiempo ha expirado'
            };
        } else {
            result = { status: true }
        }
    }
    return result;
}

const redirectToRoute = (route) => window.location.replace(
    window.location.protocol + '//'
    + window.location.hostname + ':'
    + window.location.port + route);

const verifyRoute = (options) => {
    const { showModal, redirecTo } = options;
    const validatorsResult = usersPermisions.find(routeOpts => routeOpts.path === getCurrentSection());
    if (validatorsResult.canAccess) {
        validatorsResult.canAccess
            .every(routeValidator => {
                const protectionResult = routeValidator();
                if (!protectionResult.status) {
                    console.log(protectionResult);
                    if (showModal) {
                        getMainWrapper.appendChild(
                            createModal(
                                'Un Error a ocurrido!', // El titulo del modal
                                createMessageEle(protectionResult.message),    // Pegan el contenido perzonalizado que necesitan meter en  el modal
                                [
                                    {
                                        name: 'Ok', // nombre del boton
                                        event: 'click', // evento al que va a reaccionar
                                        action: () => redirectToRoute(redirecTo), // metodo qeu va a ejecutar, echo por ustedes
                                        style: buttons.PRIMARY // OPCIONAL
                                    }
                                ]
                            )
                        )
                        openModal()
                        return false;
                    }
                    console.log('Estas siendo redireccionado a', redirecTo);
                    redirectToRoute(redirecTo);
                }
            });
    }
}

const usersPermisions = [
    {
        path: 'rutas',
        canAccess: [isAuthenticated, isRoleAuthorized],
        roles: ['admin', 'ruta'],
    },
    { path: 'usuarios' },
    { path: 'siniestros' },
    { path: 'configuracion' },
    { path: 'reportes' },
];

