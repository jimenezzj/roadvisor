const mainWrapper = document.querySelector('.wrapperContainer');

var contenidoListaRutas = document.getElementById('lRutasDisponibles');
var elementoSeleccionado;
const btnAdd = document.querySelector('.btnAdd');
const btnSearch = document.querySelector('#btnSearch');

const search = document.querySelector('#search');
let listWrapper = document.querySelector('.listWrapper');

function listarRutas() {
    fetch('/rutas/list', {

    }).then(res => {
        return res.json();
    })
        .then(result => { //ESTE RESULT ES LO MISMO QUE data CONTIENE LO QUE DEVULVE FETCH EN EL RES.JSON
            for (var i = 0; i < result.length; i++) {
                console.log(result[i]);
                /*icono cambiar estado*/
                var cambiar = document.createElement('i');
                cambiar.innerHTML = "block";
                cambiar.classList.add("material-icons");
                var capaGrande = document.createElement('div');
                capaGrande.classList.add('flex');
                var parrafo = document.createElement('p');
                parrafo.innerHTML = result[i].nombreRuta;
                var anchor = document.createElement('a');
                var iconoEliminar = document.createElement('i');
                iconoEliminar.innerHTML = "delete";
                iconoEliminar.classList.add('material-icons')
                capaGrande.appendChild(parrafo);
                anchor.appendChild(iconoEliminar);
                capaGrande.appendChild(anchor);

                var cambiarEstado = cambiar.cloneNode(true);
                cambiarEstado.id = result[i]["_id"];
                cambiarEstado.addEventListener('click', function (e) {
                    elementoSeleccionado = e.target.id;
                    openModal();
                });

                if (result[i].status == false) {
                    capaGrande.classList.add('deshabilitado');
                    capaGrande.classList.remove('lRutasDisponibles');
                }
                capaGrande.appendChild(cambiarEstado)
                contenidoListaRutas.appendChild(capaGrande);
            }
        })
        .catch(err => {
            console.log(err);
        })
}

function listarRutasDos(result) {
    contenidoListaRutas.innerHTML = null;
    for (var i = 0; i < result.length; i++) {
        console.log(result[i]);
        /*icono cambiar estado*/
        var cambiar = document.createElement('i');
        cambiar.innerHTML = "block";
        cambiar.classList.add("material-icons");
        var capaGrande = document.createElement('div');
        capaGrande.classList.add('flex');
        var parrafo = document.createElement('p');
        parrafo.innerHTML = result[i].nombreRuta;
        var anchor = document.createElement('a');
        var iconoEliminar = document.createElement('i');
        iconoEliminar.innerHTML = "delete";
        iconoEliminar.classList.add('material-icons')
        capaGrande.appendChild(parrafo);
        anchor.appendChild(iconoEliminar);
        capaGrande.appendChild(anchor);

        var cambiarEstado = cambiar.cloneNode(true);
        cambiarEstado.id = result[i]["_id"];
        cambiarEstado.addEventListener('click', function (e) {
            elementoSeleccionado = e.target.id;
            openModal();
        });

        if (result[i].status == false) {
            capaGrande.classList.add('deshabilitado');
            capaGrande.classList.remove('lRutasDisponibles');
        }
        capaGrande.appendChild(cambiarEstado)
        contenidoListaRutas.appendChild(capaGrande);
    }
}


/*----------------------modal de cambiar estado--------------------------------*/
function mensaje() {
    var mensaje = document.createElement('p');
    mensaje.innerHTML = 'Seguro que desea cambiar el estado del elemento seleccionado?';
    return mensaje;
}
function cancelar() {
    closeModal();
}
function aceptarEliminar() {
    console.log(elementoSeleccionado)
    var data = {
        _id: elementoSeleccionado
    }
    fetch("/registrarRuta/desh", {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        console.log(res);
        return res.json();
    }).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    })
    alert('Cambiando estado..........');
    window.location.href = "../../modules/RegistrarRuta/listaDeRutas.html"
}
document.querySelector('main').appendChild(
    createModal(
        'Cambiar estado',
        mensaje(),
        [

            {
                name: 'Cancelar',
                event: 'click',
                action: cancelar,
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
/*--------------------------------------------------------------Fin deshabilitar-------------------------------------- */
btnSearch.addEventListener('click', () => {
    const valueToSearch = search.value;
    fetch(getCurrentURL + 'rutas/search/' + valueToSearch)
        .then(res => res.json())
        .then(result => {
            if (!result) {
                throw new Error(result.message);
            } else {
                if (valueToSearch === '' || valueToSearch === null) {
                    listarRutasDos(result)
                } else {
                    listarRutasDos(result.data)
                }
            }
        })
        .catch(err => {
            console.log(err);

        })
});



/******************************************************** */
mainWrapper.querySelector('header').appendChild(
    createSidebar(getNavbarOpts)
);

mainWrapper.querySelector('main').insertBefore(
    createTopNavbar(
        'Rutas',
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
    ),
    document.querySelector('.actionsWrapper')
);
