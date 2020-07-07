const btnSearchVehi = document.querySelector('#btnSearchVehiType');
const btnSearchCard = document.querySelector('#btnSearchCard');
document.querySelector('.btnAddCard').onclick =
    () => window.location.assign(getCurrentURL + 'modules/configuracion/agregarTarjetas/agregarTarjetas.html')
document.querySelector('#btnDeleteVehiType').onclick =
    () => window.location.assign(getCurrentURL + 'modules/configuracion/agregarTipoVehiculo/agregarTipoVehiculo.html')

function agregarIncidente() {
    window.location.href = "../configuracion/registroIncidentes/registroIncidentes.html"
}
// add vehicle type(admin)
// add ruta()
// add specialUser()
// ver perfil Ususario Especializado
// modificar perfil Ususario Especializado
function listar() {
    fetch(getCurrentURL + 'tipos/incidente', {
    }).then(res => {
        return res.json();
    }).then(res => {
        res.data.sort(function (a, b) {
            var primero = a.nombre.toLowerCase();
            var segundo = b.nombre.toLowerCase();
            if (primero > segundo) {
                return 1;
            }
            if (primero < segundo) {
                return -1;
            }
            return 0;
        });
        generateCardsList(res.data,
            {
                // name: 'vehiculo',
                styleItemContainer: 'tipoVehiList__itme',
                styleImage: 'tipoVehiImg',
                styleList: 'capaDeAsistenciaTodosList'
            })

    }).catch(err => {
        console.log(err);
    });
}


function prueba() {
    var eliminar = document.getElementById('delete');
    eliminar.addEventListener('click', openModal(), false);
}


function buscarIncidente() {
    var busqueda = document.getElementById('buscador').value;
    fetch("/tipos/incidente/search/" + busqueda, {
    }).then(res => {
        return res.json();
    }).then(data => {
        if (data.statusCode === 404) {
            generateCardsList([],
                {
                    // name: 'vehiculo',
                    styleItemContainer: 'tipoVehiList__itme',
                    styleImage: 'tipoVehiImg',
                    styleList: 'capaDeAsistenciaTodosList'
                })

        } else {
            generateCardsList(data.data,
                {
                    // name: 'vehiculo',
                    styleItemContainer: 'tipoVehiList__itme',
                    styleImage: 'tipoVehiImg',
                    styleList: 'capaDeAsistenciaTodosList'
                })
        }
    }).catch(err => {
        console.log(err);
    });
}

function eliminarIncidente() {
    var mensaje = document.createElement('p');
    mensaje.innerHTML = 'Seguro que desea quitar este incidente?';
    return mensaje;
}

function cancelarEliminarIncidente() {
    closeModal();
}

function aceptarEliminar() {

}


/******************************************************************/

//Registro de asistencias
function agregarAsistencia() {
    window.location.href = "../../modules/configuracion/regitroAsistencias/regitroAsistencias.html"
}

function listarAsistencias() {
    fetch(getCurrentURL + 'tipos/asistencia', {
    }).then(res => {
        return res.json();
    }).then(res => {
        res.data.sort(function (a, b) {
            var primero = a.nombre.toLowerCase();
            var segundo = b.nombre.toLowerCase();
            if (primero > segundo) {
                return 1;
            }
            if (primero < segundo) {
                return -1;
            }
            return 0;
        });
        generateCardsList(res.data,
            {
                // name: 'vehiculo',
                styleItemContainer: 'tipoVehiList__itme',
                styleImage: 'tipoVehiImg',
                styleList: 'capaDeIncidentesTodosList'
            })
    }).catch(err => {
        console.log(err);
    });
}

function buscarAsistencia() {
    var busquedaDos = document.getElementById('busquedaDos').value;
    fetch('/tipos/asistencia/search/' + busquedaDos, {
    }).then(res => {
        return res.json();
    }).then(data => {

        if (data.statusCode === 404) {
            generateCardsList([],
                {
                    // name: 'vehiculo',
                    styleItemContainer: 'tipoVehiList__itme',
                    styleImage: 'tipoVehiImg',
                    styleList: 'capaDeIncidentesTodosList'
                })

        } else {
            generateCardsList(data.data,
                {
                    // name: 'vehiculo',
                    styleItemContainer: 'tipoVehiList__itme',
                    styleImage: 'tipoVehiImg',
                    styleList: 'capaDeIncidentesTodosList'
                })
        }
    }).catch(err => {
        console.log(err);
    });
}

function getCards() {
    fetch(getCurrentURL + 'tarjetas/' + getSession.correo)
        .then(res => res.json())
        .then(result => {
            if (result.statusCode !== 200) {
                const error = new Error(result.message);
                throw error;
            }
            generateCardsList(
                result.data,
                {
                    name: 'card',
                    styleItemContainer: 'tipoCardList__itme',
                    styleImage: 'tipoCardImg',
                    styleList: 'tipoCardList'
                })
        })
        .catch(err => {
            console.error(err);
        });
}

function getVehiclesType() {
    fetch(getCurrentURL + 'configuracion/tipo/vehiculos')
        .then(res => res.json())
        .then(result => {
            if (result.statusCode !== 200) {
                const error = new Error(result.message);
                throw error;
            }
            generateCardsList(result.data,
                {
                    name: 'vehiculo',
                    styleItemContainer: 'tipoVehiList__itme',
                    styleImage: 'tipoVehiImg',
                    styleList: 'tipoVehiList'
                })
        })
        .catch(err => {
            console.error(err);
        });
}


function generateCardsList(list, opts) {
    const tipoList = document.querySelector('#' + opts.styleList);
    const cardListItem = document.createElement('li');
    const tipoCardImg = document.createElement('div');
    const cardImg = document.createElement('img');
    const cardLastNumbers = document.createElement('span');
    const iconEle = document.createElement('i');
    // cardListItem.classList.add('tipoCardList__itme');
    cardListItem.classList.add(opts.styleItemContainer);
    // tipoCardImg.classList.add('tipoCardImg')
    tipoCardImg.classList.add(opts.styleImage)
    iconEle.classList.add('material-icons');
    iconEle.innerHTML = 'close';
    tipoList.innerHTML = '';
    list.forEach(cardObj => {
        const newCardListItem = cardListItem.cloneNode(true);
        if (opts.name === 'card') {
            if (cardObj.marca) {
                cardImg.src = '../../assets/images/cardTypes/' + cardObj.marca.toLowerCase() + '.png';
                newCardListItem.classList.add('tipoCardList__itme--' + cardObj.marca.toLowerCase());
            } else {
                cardImg.src = '../../assets/images/cardTypes/default.png';
            }
            cardLastNumbers.innerHTML = '**** '
                + cardObj.numeroTarjeta.slice((cardObj.numeroTarjeta.length - 4), cardObj.length);
        }
        if (opts.name === 'vehiculo') {
            if (cardObj.iconoTipoVehiculo) {
                cardImg.src = getCurrentURL + cardObj.iconoTipoVehiculo;
            } else {
                cardImg.src = '../../assets/images/cardTypes/default.png';
            }
            cardLastNumbers.innerHTML = cardObj.nombreTipoVehiculo;
        }
        if (!opts.name) {
            if (cardObj.icono) {
                cardImg.src = getCurrentURL + cardObj.icono;
            } else {
                cardImg.src = '../../assets/images/cardTypes/default.png';
            }
            cardLastNumbers.innerHTML = cardObj.nombre;
        }
        tipoCardImg.appendChild(cardImg);
        newCardListItem.appendChild(tipoCardImg.cloneNode(true));
        newCardListItem.appendChild(cardLastNumbers.cloneNode(true));
        newCardListItem.appendChild(iconEle.cloneNode(true));
        tipoList.appendChild(newCardListItem);
    });
    return tipoList;
}

btnSearchVehi.addEventListener('click', () => {
    const valueToSearch = document.querySelector('#buscador').value === ''
        ? 'null' : document.querySelector('#buscador').value;
    const typeVehiList = document.querySelector('#tipoVehiList');
    // const loggedUser = getSession.correo;
    // const URLValidation = getSession.type === 'admin'
    //     ? getCurrentURL + 'vehicles/search/all/' + valueToSearch
    //     : getCurrentURL + 'vehicles/' + loggedUser + '/search/' + valueToSearch
    console.log(valueToSearch);

    fetch(getCurrentURL + 'configuracion/tipo/vehiculo/search/' + valueToSearch)
        .then(res => res.json())
        .then(result => {
            console.log(result.data);
            typeVehiList.innerHTML = null;
            if (result.data.length < 1) {
                getVehiclesType();
            } else {
                generateCardsList(result.data,
                    {
                        name: 'vehiculo',
                        styleItemContainer: 'tipoVehiList__itme',
                        styleImage: 'tipoVehiImg',
                        styleList: 'tipoVehiList'
                    })
            }
        })
        .catch(err => {
            console.log(err);

        });
});

btnSearchCard.addEventListener('click', () => {
    const valueToSearch = document.querySelector('#searchTypeCard').value === ''
        ? 'null' : document.querySelector('#searchTypeCard').value;
    const tipoCardList = document.querySelector('#tipoCardList');
    // const loggedUser = getSession.correo;
    // const URLValidation = getSession.type === 'admin'
    //     ? getCurrentURL + 'vehicles/search/all/' + valueToSearch
    //     : getCurrentURL + 'vehicles/' + loggedUser + '/search/' + valueToSearch
    console.log(valueToSearch);

    fetch(`${getCurrentURL}tarjetas/${getSession.correo}/search/${valueToSearch}`)
        .then(res => res.json())
        .then(result => {
            console.log(result.data);
            tipoCardList.innerHTML = null;
            if (result.data.length < 1 && valueToSearch === 'null') {
                getCards();
            } else {
                generateCardsList(result.data,
                    {
                        name: 'card',
                        styleItemContainer: 'tipoCardList__itme',
                        styleImage: 'tipoCardImg',
                        styleList: 'tipoCardList'
                    })
            }
        })
        .catch(err => {
            console.log(err);

        });
});

const checkComponents = () => {
    if (getSession.type !== 'admin') {
        document.querySelector('.configSinisters').remove();
        document.querySelector('.configAssistant').remove();
        document.querySelector('.tipoVehiculosSection').remove();
    }
    if (getSession.type !== 'tradicional') {
        document.querySelector('.contenedorTarjetas').remove();
    }
}

/******************************************/
document.querySelector('main').appendChild(
    createModal(
        'Deshabilitar incidente',
        eliminarIncidente(),
        [
            {
                name: 'Cancelar',
                event: 'click',
                action: cancelarEliminarIncidente,
                style: buttons.SECONDARY
            },
            {
                name: 'Aceptar',
                event: 'click',
                action: aceptarEliminar,
                style: buttons.PRIMARY
            }
        ],
        {
            position: {
                header: 'center',
                body: '',
                actions: 'center'
            },
            height: '45%',
            width: '40%'
        })
);

document.querySelector("header").appendChild(
    createSidebar(getNavbarOpts)
);

document.querySelector("main").insertBefore(
    createTopNavbar(
        'Configuración',
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
    ), document.querySelector(".cuerpoDeLaPantalla")
);


checkComponents();
getVehiclesType();
getCards();
listar();
listarAsistencias();

