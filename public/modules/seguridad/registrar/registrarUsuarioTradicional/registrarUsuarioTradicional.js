//FUNCIÓN PRINCIPAL DE VALIDAR EL FORMULARIO Y ENVIARLO
let currentForm;
function personaFisica() {
    document.getElementById("formularioEspecializado").classList.remove("ocultar");
    document.getElementById("enviar").classList.remove("ocultar");
    document.getElementById("apellidos").classList.remove("ocultar");
    document.getElementById("tYC").classList.remove("ocultar");
    document.getElementById("leerTYC").classList.remove("ocultar");
    document.getElementById("checkTerminos").classList.remove("ocultar");
    document.getElementById("aceptarTyC").classList.remove("ocultar");
    currentForm = 'F';
    return false;
}

function personaJuridica() {
    document.getElementById('GeneroFecha').classList.add("ocultar");
    document.getElementById("formularioEspecializado").classList.remove("ocultar");
    document.getElementById("enviar").classList.remove("ocultar");
    document.getElementById("apellidos").classList.add("ocultar");
    document.getElementById("tYC").classList.remove("ocultar");
    document.getElementById("leerTYC").classList.remove("ocultar");
    document.getElementById("checkTerminos").classList.remove("ocultar");
    document.getElementById("aceptarTyC").classList.remove("ocultar");
    currentForm = 'J';

    return false;
}

function registrarme() {
    //DATOS DE LA INFORMACIÓN PERSONAL
    var dataUEspecializado = new FormData();

    //REQUERIDOS POR LA BASE DE DATOS
    var numeroCedula = document.getElementById("numeroCedula").value;
    var nombre = document.getElementById("nombre").value;
    var correo = document.getElementById("correo").value;
    var telefono = document.getElementById("telefono").value;

    //DATOS DEL SCHEMA PERO NO REQUERIDOS POR LA BASE DE DATOS
    var pApellido = document.getElementById("pApellido").value;
    var sApellido = document.getElementById("sApellido").value;
    var genero = document.getElementById("genero").value.toLowerCase();
    var fechaNacimiento = document.getElementById("fechaNacimiento").value;
    //var nTipoEntidadJuridica = document.getElementById("nTipoEntidadJuridica").value;
    //var tipoEntidadJuridica = document.getElementById("tipoEntidadJuridica").selectedIndex;

    //VALIDACIONES DE LOS INPUTS DEL FORMULARIO DEL USUARIO ESPECIALIZADO
    if (correo == "") {
        document.getElementById("correoRequerido").classList.remove("ocultar");
        return false;
    } else {
        document.getElementById("correoRequerido").classList.add("ocultar");

    }
    if (telefono == "" || isNaN(telefono)) {
        document.getElementById("telefonoRequerido").classList.remove("ocultar");
        return false;

    } else {
        document.getElementById("telefonoRequerido").classList.add("ocultar");
    }
    if (nombre == "") {
        document.getElementById("nombreRequerido").classList.remove("ocultar");
        return false;
    } else {
        document.getElementById("nombreRequerido").classList.add("ocultar");
    }

    if (numeroCedula == 0 || isNaN(numeroCedula)) {
        document.getElementById("cedulaRequerido").classList.remove("ocultar");
    } else {
        document.getElementById("cedulaRequerido").classList.add("ocultar");
    }

    //DATOS REQUERIDOS POR LA BASE DE DATOS
    dataUEspecializado.append("numeroCedula", numeroCedula);
    dataUEspecializado.append("nombre", nombre);
    dataUEspecializado.append("correo", correo);
    dataUEspecializado.append("telefono", telefono);
    if (currentForm === 'J') {

    }
    if (currentForm === 'F') {
        //DATOS DEL SCHEMA PERO NO REQUERIDOS POR LA BASE DE DATOS
        dataUEspecializado.append("pApellido", pApellido);
        dataUEspecializado.append("sApellido", sApellido);
        dataUEspecializado.append("genero", genero);
        dataUEspecializado.append("fechaNacimiento", fechaNacimiento);
    }
    //dataUEspecializado.append("nTipoEntidadJuridica", document.getElementById("nTipoEntidadJuridica").value);
    //dataUEspecializado.append("tipoEntidadJuridica", document.getElementById("tipoEntidadJuridica").value);

    //FOTO DE PERFIL PARA QUE MULTER LA GUARDE CORRECTAMENTE
    if (document.getElementById('profilePicture').files.length > 0)
        dataUEspecializado.append("profilePicture", document.getElementById('profilePicture').files[0]);
    console.log(dataUEspecializado);

    //ESTE FETCH ME REGISTRA UN USUSARIO EN LA BASE DE DATOS
    fetch('/users/add/tradicional', {
        method: 'POST', // or 'PUT'
        body: (dataUEspecializado) // data can be `string` or {object}!
    })
        .then(res => res.json())
        .then(res => {
            console.log(res.data);
            if (res.statusCode == 201 || res.statusCode == 200) {
                localStorage.setItem('correo', document.getElementById("correo").value);
                console.log('Este es el correo' + localStorage.getItem('correo'));
                return res; //res.json()/*res;
            } else if (res.statusCode == 409) {
                alert('El correo ya existe. Regístrate con otro correo electrónico. Gracias.');
            } else { throw new Error(res.message); }
        })
        .then(res => {
            alert(res.statusCode + ': Registro Confirmado. Hemos enviado un código de verificación a tu correo para que inicialices tu contraseña.');
            window.location.replace(getCurrentURL+'modules/seguridad/login/login.html');
        })
        .catch(function (error) {
            console.log(error);
        });
}


function verificarCodigo() {
    var correoGuardado = localStorage.getItem('correo');
    var codigoIngresado = document.getElementById("codigoVerificacion").value;
    var contrasenaNueva = document.getElementById("contrasenaNueva").value;
    var confirmarContrasenaNueva = document.getElementById("confirmarContrasena").value;
    console.log(contrasenaNueva);
    if (contrasenaNueva != confirmarContrasenaNueva) {
        alert('Las contraseñas no coinciden');
    } else {
        fetch('/insertar/encontrarUsuarioTradicional', {
            method: 'PUT',
            body: JSON.stringify({ correo: correoGuardado, codigo: codigoIngresado }),
            headers: { "content-type": "application/json" }
        })
            .then(function (result) {
                console.log(result);
                return result.json();

            })
            .then(function (data) {
                fetch('/insertar/nuevaContrasena', {
                    method: 'POST',
                    body: JSON.stringify({ contrasenaNueva: contrasenaNueva, correo: correoGuardado }),
                    headers: { "content-type": "application/json" }
                })
                    .then(function (result) {
                        return result.json();
                    })
                    .then(function (data) {
                        if (data.status != 404) {
                            console.log('Todo ha salido bien');
                            localStorage.removeItem('correo');
                            alert('Contraseña creada exitosamente');
                            window.location.replace('inicioSesion.html');
                        } else {
                            console.log('algo ha salido mal');
                        }
                    })
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                return res.status(err.statusCode).json({
                    message: err.message,
                    statusCode: err.statusCode,
                });
            });
    }
}