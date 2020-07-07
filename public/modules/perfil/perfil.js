const generateUserInfo = (keys, list) => {
    const userInfo = document.querySelector('.userInfo');
    const userInfoItem = document.createElement('div');
    const pEle = document.createElement('p');
    const iconEle = document.createElement('i');
    userInfoItem.classList.add('userInfo__item');
    iconEle.classList.add('material-icons')

    Object.keys(list).forEach(key => {
        let newIcon;
        let keyLabel = pEle.cloneNode(true);
        let userVal = pEle.cloneNode(true);
        userInfoItem.innerHTML = '';
        keyLabel.classList.add('userInfoKey')
        userVal.classList.add('userInfoValue')
        if (keys.find(obj => obj.key === key)) {
            newIcon = iconEle.cloneNode('true');
            newIcon.innerHTML = keys.find(obj => obj.key === key).icon;
            newIcon.classList.add('userKeyIcon');
        } else {
            const empty = document.createElement('div');
            empty.style.padding = '0 2rem';
            userInfoItem.appendChild(empty);
        }
        keyLabel.innerHTML = key;
        userVal.innerHTML = list[key];
        userInfoItem.appendChild(keyLabel);
        userInfoItem.appendChild(userVal);
        userInfo.appendChild(userInfoItem.cloneNode(true));
    });
}
{/* <div class="userInfo__item">
    <i class="userKeyIcon material-icons">add</i>
    <p class="userInfoKey">Nombre</p>
    <p class="userInfoValue">Juan Schelzmuller</p>
</div> */}
const setSummaryInfo = () => {
    const session = getSession;
    const userPicDir = JSON.parse(localStorage.getItem('topNav')).profilePicture;
    const profileHeaderItemStart = document.querySelector('.profileHeader__itemStart');
    const profileHeaderItemEnd = document.querySelector('.profileHeader__itemEnd');
    const titleInfo = document.createElement('h3');
    const textInfo = document.createElement('p');
    if (session.type === 'servicio') {
        titleInfo.innerHTML = '32';
        textInfo.innerHTML = 'Total de asistencias';
        profileHeaderItemStart.appendChild(titleInfo.cloneNode(true));
        profileHeaderItemStart.appendChild(textInfo.cloneNode(true));
        titleInfo.innerHTML = '25';
        textInfo.innerHTML = 'Asistencias brindadas';
        profileHeaderItemEnd.appendChild(titleInfo.cloneNode(true));
        profileHeaderItemEnd.appendChild(textInfo.cloneNode(true));
    }
    if (session.type === 'tradicional') {
        titleInfo.innerHTML = '23';
        textInfo.innerHTML = 'Siniestros reportados';
        profileHeaderItemStart.appendChild(titleInfo.cloneNode(true));
        profileHeaderItemStart.appendChild(textInfo.cloneNode(true));
        titleInfo.innerHTML = '52';
        textInfo.innerHTML = 'Asistencias solicitadas';
        profileHeaderItemEnd.appendChild(titleInfo.cloneNode(true));
        profileHeaderItemEnd.appendChild(textInfo.cloneNode(true));

    }
    document.querySelector('.profilePicWrapper .userFullName').innerHTML = session.nombre;
    document.querySelector('.profilePicWrapper .userType').innerHTML = session.type;
    document.querySelector('.profilePicContainer img').src = getCurrentURL + userPicDir;
}

const fetchUserProfile = () => {
    fetch(getCurrentURL + 'users/profile/' + getSession.correo, {
        headers: {
            'Authorization': getSession.token
        }
    })
        .then(res => res.json())
        .then(result => {
            console.log(result);
            if (result.statusCode !== 201) {
                const error = new Error(result.message);
                throw error;
            }
            let dataToShow = {};
            Object.keys(result.data)
                .filter(key => key !== 'profilePicture' && key !== 'status')
                .map(key => {
                    if (key === 'fechaNacimiento') {
                        let toDate = new Date(result.data[key]);
                        dataToShow[key] = `${toDate.getDate()}/${toDate.getMonth()}/${toDate.getFullYear()}`;

                    } else {
                        dataToShow[key] = result.data[key];
                    }
                });
            generateUserInfo(
                [
                    { key: '', icon: '' }
                ],
                dataToShow
            )
        })
        .catch(err => {
            console.log(err);
        })
};

const addTabs = () => {
    const tabsList = document.querySelector('.tabsList');
    const userType = getSession.type;
    const tabsListItem = document.createElement('li');
    const tabsListItemA = document.createElement('a');
    let sinisterTab;
    let assistentTab;
    tabsListItem.classList.add('tabList__item');
    tabsListItemA.classList.add('btnTab');
    //     <li class="tabList__item">
    //     <a href="#sinistersInfo" class="btnTab">Siniestros</a>
    // </li>
    if (userType === 'tradicional' || userType === 'servicios') {
        sinisterTab = tabsListItemA.cloneNode(true);
        assistentTab = tabsListItemA.cloneNode(true);
        sinisterTab.href = '#sinistersInfo';
        assistentTab.href = '#assistentInfo';
        tabsList.appendChild(sinisterTab);
        tabsList.appendChild(assistentTab);
    } 
    // else if (userType === 'admin') {

    // } else if (userType === 'ruta') {

    // }
}

document.querySelectorAll('.tabsList a').forEach(ele => {
    ele.onclick = (e) => {
        e.preventDefault();
        const targetTab = e.target.href.split('#')[1];
        document.querySelector('.active-tab').classList.remove('active-tab');
        document.querySelector('#' + targetTab).classList.add('active-tab');
        document.querySelector('.tabList__item--active').classList.remove('tabList__item--active');
        e.target.parentNode.classList.add('tabList__item--active');
    };
})

document.querySelector("header").appendChild(
    createSidebar(getNavbarOpts)
);

document.querySelector("main").insertBefore(
    createTopNavbar(
        'Mi Perfil',
        getTopNavOpts(),
        [
            {
                icon: 'account_circle',
                name: 'Mi Perfil',
                href: getCurrentURL + 'modules/perfil/perfil.html'
            },
            {
                icon: 'settings',
                name: 'Configuración',
                href: getCurrentURL + 'modules/configuracion/configuracion.html'
            },
            {
                icon: 'exit_to_app',
                name: 'Cerrar Sesión',
                href: '#',
                action: logOutUser
            }
        ]
    ), document.querySelector(".profileHeader")
);

// generateUserInfo(
//     [
//         { key: '', icon: '' }
//     ],
//     {
//         "tipo": "admin",
//         "genero": "otro",
//         "numeroCedula": "132456789",
//         "nombre": "Thanos",
//         "pApellido": "Titan",
//         "sApellido": "Titan",
//         "fechaNacimiento": "960940800000",
//         "email": "infinitystones@marvel.com",
//     }
// )
setSummaryInfo();
addTabs();
fetchUserProfile()