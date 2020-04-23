const mainWrapper = document.querySelector('.wrapperContainer');
//FUNCION PARA AGREGAR NUEVO TIPO DE VEHÍCULO
function agregarNuevoTipoVehiculo() {
    var dataNuevoTipoVehiculo = new FormData();
    dataNuevoTipoVehiculo.append('nombreTipoVehiculo', document.getElementById("nombreTipoVehiculo").value);
    dataNuevoTipoVehiculo.append('iconoTipoVehiculo', document.getElementById("iconoTipoVehiculo").files[0]);

    var nombreTipoVehiculo = document.getElementById("nombreTipoVehiculo").value;
    var iconoTipoVehiculo = document.getElementById("iconoTipoVehiculo").value;

    if (nombreTipoVehiculo == "" || iconoTipoVehiculo == "") {
        alert('Debe llenar ambos campos');
        return false;
    } else {

        fetch(getCurrentURL + 'configuracion/tipo/vehiculo/add', {
            method: 'POST', // 
            body: dataNuevoTipoVehiculo // data can be `string` or {object}!
        }).then(res => res.json())
            .then(res => {
                console.log(res.body);
                if (res.statusCode == 201 || res.statusCode == 200) {
                    alert('Registrando nuevo tipo de vehículo...');
                    return res;
                } else if (res.statusCode == 409) {
                    alert('El tipo de vehículo ya existe, ingrese uno nuevo.');
                } else { throw new Error(res.message); }
            })
            .then(res => {
                alert(res.status + ': Registro Confirmado.');
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}


mainWrapper.querySelector('header').appendChild(
    createSidebar(getNavbarOpts)
);

document.querySelector("main").insertBefore(
    createTopNavbar(
        'Agregar Tipo Vehiculo',
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
    ), document.querySelector(".rutaRegistarTVehiculo")
);