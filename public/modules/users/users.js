const mainWrapper = document.querySelector('.wrapperContainer');

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
        'Vehiculos',
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
    document.querySelector('.topActionsWrapper')
);

setStatus('status', [
    { sName: 'habilitado', cssClass: CAP_STYLES.active },
    { sName: 'deshabilitado', cssClass: CAP_STYLES.disable }
]);
setStatus('tipo');

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
);