//FUNCIÓN PRINCIPAL DE VALIDAR EL FORMULARIO Y ENVIARLO
let currentForm;
function personaFisica() {
    document.getElementById("formularioEspecializado").classList.remove("ocultar");
    document.getElementById("enviar").classList.remove("ocultar");
    document.getElementById("entidadJuridica").classList.add("ocultar");
    document.getElementById("apellidos").classList.remove("ocultar");
    document.getElementById("tYC").classList.remove("ocultar");
    document.getElementById("leerTYC").classList.remove("ocultar");
    document.getElementById("checkTerminos").classList.remove("ocultar");
    document.getElementById("aceptarTyC").classList.remove("ocultar");
    currentForm = 'F';
    return false;
}

function personaJuridica() {
    document.getElementById("formularioEspecializado").classList.remove("ocultar");
    document.getElementById("enviar").classList.remove("ocultar");
    document.getElementById("entidadJuridica").classList.remove("ocultar");
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
    var costo = document.getElementById("costo").value;
    var tipoServicio = document.getElementById("tipoServicio").value.toLowerCase();
    var genero = document.getElementById("genero").value.toLowerCase();
    var fechaNacimiento = document.getElementById("fechaNacimiento").value;
    var tipoEntidadJuridica = document.getElementById("tipoEntidadJuridica").value.toLowerCase();

    //DATOS REQUERIDOS POR LA BASE DE DATOS
    dataUEspecializado.append("numeroCedula", numeroCedula);
    dataUEspecializado.append("nombre", nombre);
    dataUEspecializado.append("correo", correo);
    dataUEspecializado.append("telefono", telefono);

    //DATOS DEL SCHEMA PERO NO REQUERIDOS POR LA BASE DE DATOS
    dataUEspecializado.append("costo", costo);
    dataUEspecializado.append("tipoServicio", tipoServicio);
    if (currentForm === 'J') {
        dataUEspecializado.append("tipoEntidadJuridica", tipoEntidadJuridica);
    }
    if (currentForm === 'F') {
        dataUEspecializado.append("fechaNacimiento", fechaNacimiento);
        dataUEspecializado.append("genero", genero);
        dataUEspecializado.append("pApellido", pApellido);
        dataUEspecializado.append("sApellido", sApellido);

    }
    //FOTO DE PERFIL PARA QUE MULTER LA GUARDE CORRECTAMENTE
    if (document.getElementById('profilePicture').files.length > 0)
        dataUEspecializado.append("profilePicture", document.getElementById('profilePicture').files[0]);
    console.log(dataUEspecializado);


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
    if (tipoServicio == 0 || costo == "") {
        document.getElementById("TServicioRequerido").classList.remove("ocultar");
    } else {
        document.getElementById("TServicioRequerido").classList.add("ocultar");
    }

    //ESTE FETCH ME REGISTRA UN USUSARIO EN LA BASE DE DATOS
    fetch('/users/add/servicio', {
        method: 'POST', // or 'PUT'
        body: dataUEspecializado // data can be `string` or {object}!
    })
        .then(res => res.json())
        .then(res => {
            console.log(res.data);
            if (res.statusCode == 201 || res.statusCode == 200) {
                localStorage.setItem('correo', document.getElementById("correo").value);
                console.log('Este es el correo' + localStorage.getItem('correo'));
                return res; //res.json()/*res;
            } else if (res.statusCode == 202) {
                alert('El correo ya existe. Regístrate con otro correo electrónico. Gracias.');
            } else { throw new Error(res.message); }
        })
        .then(res => {
            alert(res.statusCode + ': Registro Confirmado. Hemos enviado un código de verificación a tu correo para que inicialices tu contraseña.');
            window.location.replace('verificarCV.html')

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
        fetch('/insertar/encontrarUsuarioEspecializado', {
            method: 'PUT',
            body: JSON.stringify({ correo: correoGuardado, codigo: codigoIngresado }),
            headers: { "content-type": "application/json" }
        })
            .then(function (result) {
                return result.json();
                console.log(result);
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
                        if (data.statusCode != 404) {
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
                return res.statusCode(err.statusCode).json({
                    message: err.message,
                    statusCode: err.statusCode,
                });
            });
    }
}

var contenidoTipoDeAsistencia = document.querySelector('#tipoServicio')

function listarTiposDeAsistencia() {
    fetch('/insertar/listarTipoDeAsistencia', {

    }).then(res => {
        return res.json();
    })
        .then(result => { //ESTE RESULT ES LO MISMO QUE data CONTIENE LO QUE DEVULVE FETCH EN EL RES.JSON
            contenidoTipoDeAsistencia.innerHTML = ''
            for (var i = 0; i < result.length; i++) {
                console.log(result[i]);
                contenidoTipoDeAsistencia.innerHTML += `
                <option value="${result[i].nombre}">${result[i].nombre}</option>
                `
            }
        })
        .catch(err => {
            console.log(err);
        })
}