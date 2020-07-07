//COMIENZAN FUNCIONES DEL HOME DEL USUARIO TRADICIONAL
const mainWrapper = document.querySelector('.mainWrapper');
var contenidoSiniestros = document.querySelector('#div_Main_siniestrosReportadosContenedor');
const btnReportSinister = document.querySelector('#btnReportSinister')

function listarSiniestrosReportados() {
    fetch('/siniestros/listarSiniestrosReportados', {

    })
        .then(function (result) {
            return result.json();
        })
        .then(function (data) {
            contenidoSiniestros.innerHTML = ''
            for (var i = 0; i < data.length; i++) {
                contenidoSiniestros.innerHTML += `
                <div class="div_Main_SiniestroReportado">
                    <div class="div_Main_ImgSiniestroReportado">
                        <img src="${window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/" + data[i].fotoSiniestroReportado}" alt="">
                    </div>
                    <p> <b>Tipo</b>: ${data[i].tipoSiniestroReportado}</p>
                    <p><b>Ruta</b>:  ${data[i].rutaSiniestroReportado}</p>
                    <p><b>Dirección exacta</b>: ${data[i].direccionSiniestroReportado}</p>
                </div>
            `
            }
        })
}


const checkComponents = () => {
    if (getSession.type === 'admin' || getSession.type ==='servicio') {
        btnReportSinister.remove();
    }
}

mainWrapper.querySelector('header').appendChild(
    createSidebar(getNavbarOpts)
);

mainWrapper.querySelector('main').insertBefore(
    createTopNavbar(
        'Siniestros',
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
    document.querySelector('.div_Main_Contenedor_SiniestrosReportadosTitle')
);

checkComponents();