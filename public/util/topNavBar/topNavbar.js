// import { expand } from '../sideBar/sideBar.js';
const topNavbar = document.createElement('div');
const sectionTitle = document.createElement('span');
const hamburgerTopNav = document.createElement('div');
const profileWrapper = document.createElement('div');

const createTopNavbar = (sectionName, userInfo, dropDownList) => {
    const hamLine = document.createElement('div');
    const hamburAndTitleWrapper = document.createElement('div');
    // create HTML for user wrapper
    const profileLIne = document.createElement('div');
    const profilePic = document.createElement('img');
    const userInfoWrapper = document.createElement('div');
    const userName = document.createElement('a');
    const userRol = document.createElement('a');
    const dropDownIcon = document.createElement('i');

    hamburgerTopNav.classList.add('hamburgerTopNav');
    sectionTitle.innerHTML = sectionName;
    dropDownIcon.innerHTML = 'expand_more';
    dropDownIcon.id = 'dropDownIconOpts';

    // Le añade las clases a todos los elementos que conforman
    // el perfil y la imagen
    topNavbar.classList.add('topNavbar');
    sectionTitle.classList.add('sectionTitle');
    profileWrapper.classList.add('profileWrapper');
    profileLIne.classList.add('profileLine');
    profilePic.classList.add('profilePic');
    userInfoWrapper.classList.add('userInfoWrapper');
    userName.classList.add('userName');
    userRol.classList.add('userRol');
    dropDownIcon.classList.add('material-icons', 'dropDownIcon');

    // crea el hambuerger
    [...new Array(3)].forEach(_ => {
        hamburgerTopNav.appendChild(hamLine.cloneNode(true));
    });

    // anade el metodo de expandir o estrecha barra lateral
    if (sideBarStatus === 'short') hamburgerTopNav.onclick = expandSidebar;
    if (sideBarStatus === 'long') hamburgerTopNav.onclick = squeezeSidebar;

    // fill user wrapper info
    profilePic.src = userInfo.profilePic;
    userName.innerHTML = userInfo.name;
    userRol.innerHTML = userInfo.rol;

    userName.href = userInfo.href;
    userRol.href = userInfo.href;

    dropDownIcon.addEventListener('click', (e) => changeUserOptionsState(
        document.querySelector('.dropDownUserWrapper')
    ));
    // create html tree herarchi related with profile section
    userInfoWrapper.appendChild(userName);
    userInfoWrapper.appendChild(userRol);
    profileWrapper.appendChild(profileLIne);
    profileWrapper.appendChild(profilePic);
    profileWrapper.appendChild(userInfoWrapper);
    profileWrapper.appendChild(dropDownIcon);
    profileWrapper.appendChild(
        createUserDropdownOptions(dropDownList)
    );
    // create html herarchi tree related with hamburger & title
    hamburAndTitleWrapper.appendChild(hamburgerTopNav);
    hamburAndTitleWrapper.appendChild(sectionTitle);
    topNavbar.appendChild(hamburAndTitleWrapper);
    topNavbar.appendChild(profileWrapper);

    window.addEventListener('click', (e) => {
        // si le da click a algo diferente del menu desplegable del usuario 
        if (e.toElement.id !== 'dropDownIconOpts') {
            document.querySelector('.dropDownUserWrapper').classList.forEach(className => {
                // lo cierra
                if (className === 'dropDownUserWrapper--show') {
                    document.querySelector('.dropDownUserWrapper').classList.remove(className);
                }
            });
        }
    });

    return topNavbar;
};

const createUserDropdownOptions = (dropDownList) => {
    // create the dropdown for user personal sections
    const dropDownUserWrapper = document.createElement('div');
    const dropDownUserList = document.createElement('ul');
    const dropDownUserItem = document.createElement('li');
    const dropDownUserIcon = document.createElement('i');
    const dropDownUserName = document.createElement('a');

    dropDownUserWrapper.classList.add('dropDownUserWrapper');
    dropDownUserList.classList.add('dropDownUserList');
    dropDownUserItem.classList.add('dropDownUserItem');
    dropDownUserName.classList.add('dropDownUserName');
    dropDownUserIcon.classList.add('material-icons', 'dropDownListIcon');

    dropDownList.forEach(item => {
        const newDropDownUserItem = dropDownUserItem.cloneNode(true);
        dropDownUserIcon.innerHTML = item.icon;
        dropDownUserName.innerHTML = item.name;
        dropDownUserName.href = item.href;
        if (item.action) {
            newDropDownUserItem.onclick = item.action;
        }
        newDropDownUserItem.appendChild(dropDownUserIcon.cloneNode(true));
        newDropDownUserItem.appendChild(dropDownUserName.cloneNode(true));
        dropDownUserList.appendChild(newDropDownUserItem);

    });
    dropDownUserWrapper.appendChild(dropDownUserList);
    return dropDownUserWrapper;
}

const changeUserOptionsState = (ele) => ele.classList.toggle('dropDownUserWrapper--show');

// createTopNavbar(
//     'Agregar Usuario',
//     {
//         profilePic: 'http://localhost:8082/image',
//         name: 'Juan',
//         rol: 'Ruta',
//         href: '#'
//     },
//     [
//         {
//             icon: 'account_circle',
//             name: 'Mi Perfil',
//             href: '#'
//         },
//         {
//             icon: 'settings',
//             name: 'Configuración',
//             href: '#'
//         },
//         {
//             icon: 'exit_to_app',
//             name: 'Cerrar Sesión',
//             href: '#'
//         }
//     ]
// )

