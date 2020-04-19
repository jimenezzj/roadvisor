verifyRoute({ redirecTo: '/modules/seguridad/login/login.html' });
const mainWrapper = document.querySelector('.wrapperContainer');
const btnFilter = document.querySelector('.btnFilter');
const searchField = document.querySelector('#search');
const btnSearch = document.querySelector('#btnSearch');
const selectOpts = document.querySelector('.secondActionsWrapper');
const userHeaders = {
    headers: {
        'Authorization': getSession.token
    }
}


const showFilters = () => {
    document.querySelector('.filtersWrapper').classList.toggle('filtersWrapper--show');
}

btnFilter.addEventListener('click', () => {
    showFilters();
});

btnSearch.addEventListener('click', () => {
    const value = searchField.value ? searchField.value : null;
    const listWrapper = document.querySelector('.tableContainer');
    fetch(`${getCurrentURL}users/search/${value}`, {
        ...userHeaders
    })
        .then(res => res.json())
        .then(result => {
            console.log(result);
            if (result.statusCode !== 201) {
                const error = new Error(result.message);
                throw error;
            }
            listWrapper.innerHTML = null;
            const tableUI = generateTable(result.data)
            listWrapper.appendChild(tableUI);

        })
        .catch(err => {
            console.log(err);

        });
});

mainWrapper.querySelector('header').appendChild(
    createSidebar([
        {
            name: 'Vehículos',
            icon: 'directions_car',
            href: '#'
        },
        {
            name: 'Usuarios',
            icon: 'directions_car',
            href: '#',
            active: true
        }
    ])
);

mainWrapper.querySelector('main').insertBefore(
    createTopNavbar(
        'Usuarios',
        {
            profilePic: 'http://localhost:8082/assets/images/userProfile/2020-03-30T055248.441Z_infinitystones@marvel.com_58af605285bfde99b935a47d590ca774.jpg',
            name: 'Pepe',
            rol: 'Tradicional',
            href: '#'
        },
        [
            {
                icon: 'account_circle',
                name: 'Mi Perfil',
                href: '#'
            },
            {
                icon: 'settings',
                name: 'Configuración',
                href: '#'
            },
            {
                icon: 'exit_to_app',
                name: 'Cerrar Sesión',
                href: '#'
            }
        ]
    ),
    document.querySelector('.actionsWrapper')
);

setStatus('status', [
    { sName: 'habilitado', cssClass: CAP_STYLES.active },
    { sName: 'deshabilitado', cssClass: CAP_STYLES.disable }
]);
setStatus('tipo');

const createTbleAndFetchList = () => {
    fetch(getCurrentURL + 'users', {
        headers: {
            'Authorization': getSession.token
        }
    })
        .then(res => res.json())
        .then(result => {
            console.log(result);
            const tableUI = generateTable(result.data)
            document.querySelector('.tableContainer').appendChild(tableUI);

            document.querySelectorAll('.checkboxField').forEach(ele => {
                ele.addEventListener('click', () => {
                    if (getCheckedEles().length > 0) {
                        setChexkboxSelected();
                        selectOpts.classList.add('secondActionsWrapper--show');
                    } else {
                        selectOpts.classList.remove('secondActionsWrapper--show');
                    }
                });
            });
        })
        .catch(err => {
            console.log(err);
        });
}

const generateTable = (list, type) => {
    const prepareListToShow = list.map(user => {
        user.profilePicture = getCurrentURL + user.profilePicture;

        if (user.pApellido && user.sApellido) user.nombre = `${user.nombre} ${user.pApellido} ${user.sApellido}`;
        return user
    });
    console.log(prepareListToShow);
    return createTable(
        [
            { key: 'profilePicture', as: 'Foto', type: 'pic' },
            { key: 'nombre', as: 'Nombre', type: 'text' },
            { key: 'email', as: 'correo', type: 'text' },
            { key: 'numeroCedula', as: '# cédula', type: 'text' },
            { key: 'tipo', as: 'Tipo', type: 'capsule' },
            { key: 'status', as: 'Estatus', type: 'capsule' },
            // { key: 'phoneNumber', as: 'Télefono', type: 'text' }
            // { key: 'nombre', as: 'Nombre', type: 'text' }
        ]
        ,
        prepareListToShow
        ,
        [
            {
                icon: 'edit',
                action: (mes) => console.log(mes)

            },
            {
                icon: 'delete',
                action: (mes) => console.log(mes)
            }
        ],
        'email'
    );
};

const setChexkboxSelected = () => {
    const checksSelectedEle = document.querySelector('.infoElemtsSelected p');
    checksSelectedEle.innerHTML = `${getCheckedEles().length} elementos seleccionados`;
}
/*
document.querySelector('.tableContainer').appendChild(
    createTable(
        [
            { key: 'profilePicture', as: 'Foto', type: 'pic' },
            { key: 'nombre', as: 'Nombre', type: 'text' },
            { key: 'email', as: 'correo', type: 'text' },
            { key: 'numeroCedula', as: '# cédula', type: 'text' },
            { key: 'tipo', as: 'Tipo', type: 'capsule' },
            { key: 'status', as: 'Estatus', type: 'capsule' },
            { key: 'phoneNumber', as: 'Télefono', type: 'text' }
            // { key: 'nombre', as: 'Nombre', type: 'text' }
        ]
        ,
        [
            {
                id: '8465468dgdgr8',
                _id: '8465468dgdgr8',
                tipo: 'ruta',
                genero: 'femenino',
                numeroCedula: 112346598,
                nombre: 'Bruce Wayne Wayne',
                fechaNacimiento: '2005-11-09',
                email: 'some@gamil.com',
                profilePicture: 'http://localhost:8082/assets/images/userProfile/2020-04-13T172744.835Z_infinitystones@marvel.com_b9bd498e5a4cfbb42583e792d414c911.jpg',
                phoneNumber: '8888-88888',
                status: 'Habilitado'
            },
            {
                id: '8465468dgdgr83',
                _id: '8465468dgdgr83',
                tipo: 'ruta',
                genero: 'femenino',
                numeroCedula: 112346598,
                nombre: 'Steve Rogers Rogers',
                fechaNacimiento: '2005-11-09',
                email: 'some@gamil.com',
                profilePicture: 'http://localhost:8082/assets/images/userProfile/2020-04-13T172744.835Z_infinitystones@marvel.com_b9bd498e5a4cfbb42583e792d414c911.jpg',
                phoneNumber: '8888-88888',
                status: 'Habilitado'
            },
            {
                id: '8465468dgdgre8',
                _id: '8465468dgdger8',
                tipo: 'Tradicional',
                genero: 'femenino',
                numeroCedula: 112346598,
                nombre: 'Peter Parker Parker',
                fechaNacimiento: '2005-11-09',
                email: 'some@gamil.com',
                profilePicture: 'http://localhost:8082/assets/images/userProfile/2020-04-13T172744.835Z_infinitystones@marvel.com_b9bd498e5a4cfbb42583e792d414c911.jpg',
                phoneNumber: '8888-88888',
                status: 'deshabilitado'
            }
        ],
        [
            {
                icon: 'edit',
                action: (mes) => console.log(mes)

            },
            {
                icon: 'delete',
                action: (mes) => console.log(mes)
            }
        ]
    )
);*/

createTbleAndFetchList();