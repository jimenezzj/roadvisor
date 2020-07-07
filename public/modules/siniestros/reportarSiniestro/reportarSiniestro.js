const mainWrapper = document.querySelector('.mainWrapper');

function registrarSiniestroReportado() {
    var dataReportarSiniestro = new FormData();
    dataReportarSiniestro.append('descripcionSiniestro', document.getElementById('descripcionSiniestro').value);
    dataReportarSiniestro.append('direccionExactaSiniestro', document.getElementById('direccionExactaSiniestro').value);
    dataReportarSiniestro.append('fotoSiniestro', document.getElementById('fotoSiniestro').files[0]);

    dataReportarSiniestro.append('tipoSiniestroReportado', document.getElementById('tipoSiniestroReportado').value);
    dataReportarSiniestro.append('rutaSiniestro', document.getElementById('rutaSiniestro').value);

    var rutaSiniestroSeleccionada = localStorage.setItem('rutaSiniestro', document.getElementById('rutaSiniestro').value);
    console.log('Esta es la ruta donde se va a solicitar asistencia' + rutaSiniestroSeleccionada);
    var direccionExactaSiniestro = localStorage.setItem('direccionExacta', document.getElementById('direccionExactaSiniestro').value);
    var fotoSiniestro = document.getElementById('fotoSiniestro').value;
    var tipoSiniestroReportado = document.getElementById('tipoSiniestroReportado').seletedIndex;
    var rutaSiniestro = document.getElementById('rutaSiniestro').seletedIndex;

    if (direccionExactaSiniestro == "" || fotoSiniestro == "" || tipoSiniestroReportado == 0 || rutaSiniestro == 0) {
        alert('Debe llenar todos los campos, el de descripción es opcional');
    } else {
        fetch('/siniestros/registrarSiniestroReportado', {
            method: 'POST',
            body: (dataReportarSiniestro)
        })
            .then(function (result) {
                return result.json();
            })
            .then(result => {
                window.location.replace(getCurrentURL+'modules/siniestros/siniestros.html');
            })
            .catch(function (err) {
                console.log(err);
            });
    }

}

var contenidoRutasDisponibles = document.querySelector('#rutaSiniestro');

function listarRutasDisponibles() {
    fetch('/siniestros/listarRutasDisponibles', {

    }).then(res => {
        return res.json();
    })
        .then(result => { //ESTE RESULT ES LO MISMO QUE data CONTIENE LO QUE DEVULVE FETCH EN EL RES.JSON
            contenidoRutasDisponibles.innerHTML = ''
            for (var i = 0; i < result.length; i++) {
                console.log(result[i]);
                contenidoRutasDisponibles.innerHTML += `
                <option value="${result[i].nombreRuta}">${result[i].nombreRuta}</option>
                `
            }
        })
        .catch(err => {
            console.log(err);
        })
}

var contenidoTipoSiniestrosDisponibles = document.querySelector('#tipoSiniestroReportado');

function listarTiposDeSiniestro() {
    fetch('/siniestros/listarTipoDeSiniestros', {

    }).then(res => {
        return res.json();
    })
        .then(result => { //ESTE RESULT ES LO MISMO QUE data CONTIENE LO QUE DEVULVE FETCH EN EL RES.JSON
            contenidoTipoSiniestrosDisponibles.innerHTML = ''
            for (var i = 0; i < result.length; i++) {
                console.log(result[i]);
                contenidoTipoSiniestrosDisponibles.innerHTML += `
                <option value="${result[i].nombre}">${result[i].nombre}</option>
                `
            }
        })
        .catch(err => {
            console.log(err);
        })
}

/************************************************* */
mainWrapper.querySelector('header').appendChild(
    createSidebar(getNavbarOpts)
);

mainWrapper.querySelector('main').insertBefore(
    createTopNavbar(
        'Reportar Siniestro',
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