//Funcion para subir icono
function subirIcono() {
  console.dir(document.getElementById('iconoAgregado'));
  var archivo = document.getElementById("botonAgregarIcono").files[0];
  var reader = new FileReader();
  if (botonAgregarIcono) {
    reader.readAsDataURL(archivo);
    reader.onloadend = function () {
      document.getElementById("iconoAgregado").src = reader.result;
    }
  }
}

//Validacion de nombre y icono
function agregarIncidente() {
  var imagen = document.getElementById('iconoAgregado').src
  var archivo = document.getElementById("botonAgregarIcono").files[0];
  var nombreIncidente = document.getElementById('inputNombreIncidente').value;
  if (nombreIncidente == "") {
    document.getElementById('validacion').classList.remove('contenedorDelInput__textoNombreVal');
    document.getElementById('validacion').classList.add('contenedorDelInput__inputTextRed');
    return false;
  } else {
    document.getElementById('validacion').classList.add('contenedorDelInput__textoNombreVal');
  }
  if (imagen == "" || !(/\.(jpg|png)$/i).test(archivo.name)) {
    document.getElementById('validarImagen').classList.remove('divFondoBlanco__textoIcono');
    document.getElementById('validarImagen').classList.add('divFondoBlanco__textoIconoValidacion');
    document.getElementById('validarImagen').innerHTML = "Debes agregar un icono o el icono agregado no es valido"
    return false;
  } else {
    document.getElementById('validarImagen').classList.add('divFondoBlanco__textoIcono');
    document.getElementById('validarImagen').classList.remove('divFondoBlanco__textoIconoValidacion');
    document.getElementById('validarImagen').innerHTML = "Icono del tipo de incidente"
  }
  var data = new FormData();
  console.dir(document.getElementById('botonAgregarIcono').files[0]);
  data.append(
    'nombre', document.getElementById('inputNombreIncidente').value
  )
  data.append(
    'icono', document.getElementById('botonAgregarIcono').files[0]
  )
  /*{

    nombre: document.getElementById('inputNombreIncidente').value,
    icono: document.getElementById('iconoAgregado').src

  };*/
  // console.log(data);
  fetch('/tipos/incidentes/add', {
    method: 'POST',
    body: data

  }).then(res => {
    console.log(res.status)
    if (res.status !== 201) {
      throw new Error(res.message);
    }
    return res.json();
  })
    .then(res => {
      openModal()
    })
    .catch(err => {
      document.getElementById('parrafoUno').innerHTML = 'El incidente registrado ya existe'
    });
}


function agregar() {
  location.href = "../configuracion.html"
}
function mensaje() {
  var madre = document.createElement('div');
  var mensaje = document.createElement('p');
  mensaje.innerHTML = "El incidente fue creado exitosamente"
  madre.appendChild(mensaje);
  return madre;
}
document.querySelector('main').appendChild(
  createModal(
    'Exito!', // El titulo del modal
    mensaje(),
    [
      {
        name: 'Aceptar', // nombre del boton
        event: 'click', // evento al que va a reaccionar
        action: agregar, // metodo qeu va a ejecutar, echo por ustedes   nunca sin parentesis
        style: buttons.PRIMARY // OPCIONAL
      }


    ],
    {
      // height: '40%', 
      // width: '40%' 
    })
);
function regresar() {
  window.location.href = "../configuracion.html"
}

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