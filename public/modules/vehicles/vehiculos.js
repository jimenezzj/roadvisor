const mainWrapper = document.querySelector('.wrapperContainer');
const btnAdd = document.querySelector('.btnAdd');
const btnSearch = document.querySelector('#btnSearch');
const search = document.querySelector('#search');
let listWrapper = document.querySelector('.listWrapper');

btnAdd.href = getCurrentURL + 'modules/vehicles/agregarVehiculos/agregarVehiculos.html';

const getUserVehicles = () => {
    const loggedUser = getSession.correo;
    const URLValidation = getSession.type === 'admin'
        ? getCurrentURL + 'vehicles/'
        : getCurrentURL + 'vehicles/' + loggedUser
    fetch(URLValidation)
        .then(res => res.json())
        .then(result => {
            console.log(result);
            result.data.forEach(v => {
                listWrapper.appendChild(
                    createCard(v)
                );
            });
        })
        .catch(err => {
            console.error(err);
        })
}

btnSearch.addEventListener('click', () => {
    const valueToSearch = search.value === '' ? 'null' : search.value;
    const loggedUser = getSession.correo;
    const URLValidation = getSession.type === 'admin'
        ? getCurrentURL + 'vehicles/search/all/' + valueToSearch
        : getCurrentURL + 'vehicles/' + loggedUser + '/search/' + valueToSearch
    fetch(URLValidation)
        .then(res => res.json())
        .then(result => {
            console.log(result.data);
            listWrapper.innerHTML = null;
            if (result.data.length < 1) {
                getUserVehicles();
            } else {
                result.data.forEach(v => {
                    listWrapper.appendChild(
                        createCard(v)
                    );
                });
            }
        })
        .catch(err => {
            console.log(err);

        })
});

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
    console.log(data.fotos);
    console.log(data.fotos[0]);
    
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
    vehiBrand.innerHTML = data.marca.split('_').join(' ') + ' ' + data.modelo;
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
    createSidebar(getNavbarOpts)
);

mainWrapper.querySelector('main').insertBefore(
    createTopNavbar(
        'Vehiculos',
        getTopNavOpts(),
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
