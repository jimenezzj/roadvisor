const mainWrapper = document.querySelector('.wrapperContainer');

mainWrapper.querySelector('header').appendChild(
    createSidebar([
        {
            name: 'Vehículos',
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
    document.querySelector('.actionsWrapper')
);

