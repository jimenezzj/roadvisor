/*********************************    HTML ELEMENTS    *************************************/
const getMainWrapper = document.querySelector('.wrapperContainer') || document.body;

const createMessageEle = (text) => {
    const pEle = document.createElement('p');
    pEle.innerHTML = text;
    return pEle;
}

const createAndShowModal = (mess, action) => {
    getMainWrapper.appendChild(
        createModal(
            'Un Error a ocurrido!', // El titulo del modal
            createMessageEle(mess),    // Pegan el contenido perzonalizado que necesitan meter en  el modal
            [
                {
                    name: 'Regresar', // nombre del boton
                    event: 'click', // evento al que va a reaccionar
                    action: action, // metodo que va a ejecutar, echo por ustedes
                    style: buttons.PRIMARY // OPCIONAL
                }
            ]
        )
    )
    openModal()
};
/********************************* Logic for routes verification *********************************/

/******** Useful methods *********/
const getCurrentRoute = () => {
    return window.location.href.toString();
}

const getCurrentSection = () => {
    const splittedURL = getCurrentRoute().split('/');
    // get Main section from URL
    const getSection = splittedURL[(splittedURL.findIndex(rVal => rVal === 'modules') + 1)];
    return getSection;
}

const redirectToRoute = (route) => window.location.replace(
    window.location.protocol + '//'
    + window.location.hostname + ':'
    + window.location.port + route);
/******** Useful methods *********/

/**
 * 
 */
const setAutoLogoutTimer = (...args) => {
    if (isAuthenticated().status) {
        // if (localStorage.getItem(logoutStartTime)) localStorage.setItem('logoutStartTime', currentDateMs);
        const session = JSON.parse(localStorage.getItem('session'));
        const currentDateMs = new Date().getTime();
        const remainingTime = new Date(session.expireTime).getTime() - currentDateMs;
        // console.log(remainingTime);
        // console.log(remainingTime / 1000 / 60);
        // console.log((remainingTime - (0.93 * 1000 * 60 * 60)) / 1000 / 60);
        console.log(args);

        setTimeout(() => {
            console.log('Logout the user');
            createAndShowModal('Ha expirado el tiempo valido de tu session', () => {
                redirectToRoute(args[0]);
            });
            logOutUser();
        }, (remainingTime - (0.93 * 1000 * 60 * 60)));
    } else {
        console.error('No se esta autenticado o token invalido');
    }
};

const isRoleAuthorized = () => {
    const routesPermissions = usersPermisions.find(route => route.path === getCurrentSection());
    const session = JSON.parse(localStorage.getItem('session'));
    if (session) {
        return !!(routesPermissions.roles.find(rol => rol.toLowerCase() === session.type.toLowerCase()))
            ? { status: true }
            : { status: false, message: 'No esta autorizado para accceder a esta sección' };
    } else {
        // console.error('No se esta autenticado o token invalido');
        // return result = {
        //     status: false,
        //     message: 'No esta autenticado'
        // };
        isAuthenticated();
    }
}

const isAuthenticated = () => {
    const session = JSON.parse(localStorage.getItem('session'));
    let result;
    if (!session) {
        result = {
            status: false,
            message: 'No estas autenticado'
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



const verifyRoute = (options) => {
    const { redirecTo } = options;
    const validatorsResult = usersPermisions.find(routeOpts => routeOpts.path === getCurrentSection());

    if (validatorsResult.canAccess.length > 0) {
        const accessResult = validatorsResult.canAccess
            .every(routeValidator => {
                const protectionResult = routeValidator();
                if (!protectionResult.status) {
                    // if (showModal) {
                    createAndShowModal(protectionResult.message, () => {
                        logOutUser();
                        redirectToRoute(redirecTo);
                    });
                    // }
                    console.log('Estas siendo redireccionado a', redirecTo);
                    return false;
                }
                return true;
            });
        if (accessResult) setAutoLogoutTimer(redirecTo);
    }
}

// permitions 
const usersPermisions = [
    {
        path: 'rutas',
        canAccess: [isAuthenticated, isRoleAuthorized],
        roles: ['admin', 'ruta'],
    },
    {
        path: 'users',
        canAccess: [isAuthenticated, isRoleAuthorized],
        roles: ['admin'],
    },
    { path: 'siniestros' },
    { path: 'configuracion' },
    { path: 'reportes' },
];
//permitions

// [
//     {
//         name: 'Vehículos',
//         icon: 'directions_car',
//         href: '#'
//     },
//     {
//         name: 'Usuarios',
//         icon: 'directions_car',
//         href: '#',
//         active: true
//     }
// ]
const generataSideNavbarLinks = (role) => {
    // const activeSection = (name) =>
    //     generalOptions.find(link => link.name.toLocaleLowerCase() === name)
    //         .active = true;generalOptions.find(link => link.name.toLocaleLowerCase() === name)
    //         .active = true;
    let generalOptions = [
        {
            name: 'Siniestros',
            icon: 'report_problem',
            href: getCurrentURL + 'modules/siniestros/siniestros.html'
        },  
        {
            name: 'Users',
            icon: 'account_circle',
            href: getCurrentURL + 'modules/users/users.html'
        },
        {
            name: 'Rutas',
            icon: 'swap_horiz',
            href: getCurrentURL + 'modules/rutas/rutas.html'
        },
        {
            name: 'Vehiculos',
            icon: 'directions_car',
            href: getCurrentURL + 'modules/vehiculos/vehiculos.html'
        },
        {
            name: 'Reportes',
            icon: 'description',
            href: getCurrentURL + 'modules/reports/reports.html'
        },
    ]
    switch (role.toLowerCase()) {
        case 'admin':
            // activeSection('usuarios');
            break;
        case 'servicio':
            // activeSection('siniestros');
            generalOptions = generalOptions.filter(link => {
                const linkName = link.name.toLocaleLowerCase();
                if (linkName !== 'rutas' && linkName !== 'users') return link;
            });
            break;
        case 'tradicional':
            // activeSection('siniestros');
            generalOptions = generalOptions.filter(link => {
                const linkName = link.name.toLocaleLowerCase();
                if (linkName !== 'reportes'
                    && linkName !== 'rutas'
                    && linkName !== 'users') return link;
            });
            break;
        case 'ruta':
            // activeSection('rutas');
            generalOptions = generalOptions.filter(link => {
                const linkName = link.name.toLowerCase();
                if (linkName !== 'siniestros'
                    && linkName !== 'vehiculos'
                    && linkName !== 'users') return linkName;
            })
            break;

        default:
            generalOptions = null;
            break;
    }
    return generalOptions;
};

const logOutUser = () => {
    localStorage.removeItem('session');
    localStorage.removeItem('topNav');
    localStorage.removeItem('navbar');
    window.location.replace(getCurrentURL + 'modules/seguridad/login/login.html')
};



