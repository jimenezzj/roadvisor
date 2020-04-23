document.querySelector('.btnAddCard').onclick =
    () => window.location.assign(getCurrentURL + 'modules/configuracion/agregarTarjetas/agregarTarjetas.html')
document.querySelector('.btnDeleteVehiType').onclick =
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
        res.sort(function (a, b) {
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
        if (document.getElementById('agregadoActu').children.length < 1) {
            for (var i = 0; i < res.length; i++) {
                var capaGrande = document.createElement('div');
                var capaGrandeClase = capaGrande.classList.add('capaDeIncidentesUno');
                var eliminar = document.createElement("i");
                eliminar.classList.add("material-icons");
                eliminar.innerHTML = 'block';
                eliminar.classList.add('delete');
                eliminar.id = 'delete';

                var newEliminar = eliminar.cloneNode(true);
                newEliminar.id = res[i]["_id"];
                newEliminar.addEventListener('click', openModal);
                var nombreHijo = document.createElement('p');
                nombreHijo.innerHTML = res[i].nombre;
                var nombreHijoEstilo = nombreHijo.classList.add('capaDeIncidentesUno__texto');
                var iconoHijo = document.createElement('img');
                iconoHijo.src = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/"
                    + res[i].icono;//Esto es lo que envia la base de datos (icono: "assets\images\IconosIncidentes\Choquechoque.png")
                var iconoEstilo = iconoHijo.classList.add('capaDeIncidentesUno__imagen');
                capaGrande.appendChild(iconoHijo);
                capaGrande.appendChild(nombreHijo);
                capaGrande.appendChild(newEliminar);
                document.getElementById('agregadoActu').appendChild(capaGrande);
            }
        }

    }).catch(err => {
        console.log(err);
    });
}


function prueba() {
    var eliminar = document.getElementById('delete');
    eliminar.addEventListener('click', openModal(), false);
}


function buscarIncidente() {
    var busqueda = document.getElementById('busqueda').value;
    fetch("/registroDeIncidentes", {
    }).then(res => {
        return res.json();
    }).then(data => {
        for (var i = 0; i < data.length; i++) {
            if (data[i].nombre === busqueda) {
                document.getElementById(data[i]["_id"]).classList.remove('escondido');
                document.getElementById(data[i]["_id"]).classList.add('capaDeIncidentesUno');
                document.getElementById('mensajeId').classList.add('escondido');
                document.getElementById('mensajeId').classList.remove('mensaje');

            } else {
                document.getElementById(data[i]["_id"]).classList.add('escondido');
                document.getElementById(data[i]["_id"]).classList.remove('capaDeIncidentesUno');
            }
            if (i == data.length - 1) {
                document.getElementById('mensajeId').innerHTML = 'Sin resultados';
            }
        }
        if (busqueda === "") {
            document.getElementById('mensajeId').innerHTML = 'No hay datos en la barra de busqueda';
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
        res.sort(function (a, b) {
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
        if (document.getElementById('agregadoActuDos').children.length < 1) {
            for (var i = 0; i < res.length; i++) {
                var capaGrande = document.createElement('div');
                capaGrande.id = res[i]["_id"];
                var capaGrandeClase = capaGrande.classList.add('capaDeIncidentesUno');
                var nombreHijo = document.createElement('p');
                nombreHijo.innerHTML = res[i].nombre;
                var nombreHijoEstilo = nombreHijo.classList.add('capaDeIncidentesUno__texto');
                var iconoHijo = document.createElement('img');
                iconoHijo.src = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/"
                    + res[i].icono;
                var iconoEstilo = iconoHijo.classList.add('capaDeIncidentesUno__imagen');
                capaGrande.appendChild(iconoHijo);
                capaGrande.appendChild(nombreHijo);
                document.getElementById('agregadoActuDos').appendChild(capaGrande);

            }
        }
    }).catch(err => {
        console.log(err);
    });
}

function buscarAsistencia() {
    var busquedaDos = document.getElementById('busquedaDos').value;
    fetch('/registroDeAsistencias', {
    }).then(res => {
        return res.json();
    }).then(data => {
        for (var i = 0; i < data.length; i++) {
            if (data[i].nombre === busquedaDos) {
                document.getElementById(data[i]["_id"]).classList.remove('escondido');
                document.getElementById(data[i]["_id"]).classList.add('capaDeIncidentesUno');
                document.getElementById('mensajeIdDos').classList.add('escondido');
                document.getElementById('mensajeIdDos').classList.remove('mensaje');
            } else {
                document.getElementById(data[i]["_id"]).classList.add('escondido');
                document.getElementById(data[i]["_id"]).classList.remove('capaDeIncidentesUno');
            }
            if (i == data.length - 1) {
                document.getElementById('mensajeIdDos').innerHTML = 'Sin resultados';
            }
        }
        if (busquedaDos === "") {
            document.getElementById('mensajeIdDos').innerHTML = 'No hay datos en la barra de busqueda';
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
        tipoCardImg.appendChild(cardImg);
        newCardListItem.appendChild(tipoCardImg.cloneNode(true));
        newCardListItem.appendChild(cardLastNumbers.cloneNode(true));
        newCardListItem.appendChild(iconEle.cloneNode(true));
        tipoList.appendChild(newCardListItem);
    });
    return tipoList;
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

if (getSession.type === 'ruta') {
    // document.querySelector('.cuerpoDeLaPantalla').remove()
    // document.querySelector('.contenedorTipoVehiculo').remove()
    // document.querySelector('.cardsWrapper').remove()
}

getVehiclesType();
getCards();
listar();
listarAsistencias();

