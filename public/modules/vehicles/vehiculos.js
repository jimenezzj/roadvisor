const mainWrapper = document.querySelector('.wrapperContainer');

const getUserVehicles = () => {
    const loggedUser = getSession.correo;
    fetch(getCurrentURL + 'vehicles/' + loggedUser)
        .then(res => res.json())
        .then(result => {
            console.log(result);
            result.data.forEach(v => {
                document.querySelector('.listWrapper').appendChild(
                    createCard(v)
                );
            });
        })
        .catch(err => {
            console.error(err);
        })
}


const createCard = (data) => {
    const cardWrapper = document.createElement('div');
    const imagesWrapper = document.createElement('div');
    const vehiWrapper = document.createElement('div');
    const icon = document.createElement('i');
    icon.classList.add('material-icons');
    cardWrapper.classList.add('cardWrapper');
    vehiWrapper.classList.add('vehiWrapper');
    // Image
    imagesWrapper.classList.add('imagesWrapper');
    const imageMask = document.createElement('div');
    const imgEle = document.createElement('img');
    imageMask.classList.add('imageMask');
    imgEle.src = getCurrentURL + data.fotos[0];
    imgEle.alt = data.fotos[0].split('\\').pop();
    imagesWrapper.appendChild(imageMask);
    imagesWrapper.appendChild(imgEle);
    // Image
    /***********************/
    //vehicle info
    const vehiActions = document.createElement('div');
    const vehiYear = document.createElement('p');
    const vehiBrand = document.createElement('h2');
    const editIcon = icon.cloneNode(true);
    const removeIcon = icon.cloneNode(true);
    vehiYear.classList.add('vehiYear');
    vehiActions.classList.add('vehiActions');
    vehiBrand.classList.add('vehiBrand');
    vehiYear.innerHTML = new Date(data.anio).getFullYear();
    editIcon.innerHTML = 'edit';
    removeIcon.innerHTML = 'delete';
    vehiBrand.innerHTML = data.marca + ' ' + data.modelo;
    vehiActions.appendChild(vehiBrand)
    vehiActions.appendChild(editIcon);
    vehiActions.appendChild(removeIcon);

    const vehiColors = document.createElement('div');
    const vehiColorsList = document.createElement('ul');
    const vehiColorItem = document.createElement('li')
    const vehiColorName = document.createElement('span')
    vehiColors.classList.add('vehiColors');
    vehiColorsList.classList.add('vehiColorsList');
    vehiColorItem.classList.add('vehiColor__item');
    vehiColorName.innerHTML = data.color;
    vehiColorItem.appendChild(vehiColorName);
    vehiColorsList.appendChild(vehiColorItem);
    vehiColors.appendChild(vehiColorsList);

    vehiWrapper.appendChild(vehiYear);
    vehiWrapper.appendChild(vehiActions);
    vehiWrapper.appendChild(vehiColors);

    const vehiWrapperFeature = document.createElement('div');
    const strongEle = document.createElement('strong');
    const vehiPEle = document.createElement('p');
    vehiWrapperFeature.classList.add('vehiWrapper__featrure');
    strongEle.innerHTML = 'Placa:';
    vehiPEle.innerHTML = data.numeroPlaca;
    vehiWrapperFeature.appendChild(strongEle.cloneNode(true));
    vehiWrapperFeature.appendChild(vehiPEle.cloneNode(true));
    vehiWrapper.appendChild(vehiWrapperFeature.cloneNode(true));
    vehiWrapperFeature.innerHTML = null;
    strongEle.innerHTML = 'Dueño:';
    vehiPEle.innerHTML = data.usuario;
    vehiWrapperFeature.appendChild(strongEle.cloneNode(true));
    vehiWrapperFeature.appendChild(vehiPEle.cloneNode(true));
    vehiWrapper.appendChild(vehiWrapperFeature.cloneNode(true))
    //vehicle info
    cardWrapper.appendChild(imagesWrapper);
    cardWrapper.appendChild(vehiWrapper);
    return cardWrapper;
}

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

getUserVehicles();
