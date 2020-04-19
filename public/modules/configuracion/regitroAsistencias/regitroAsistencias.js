//Funcion para subir icono
function subirIcono(){
  console.dir(document.getElementById('iconoAgregado'));
    var archivo = document.getElementById("botonAgregarIcono").files[0];
    var reader = new FileReader();
    if (botonAgregarIcono) {
      reader.readAsDataURL(archivo );
      reader.onloadend = function () {
        document.getElementById("iconoAgregado").src = reader.result;
    }
  }
}
//Validacion de nombre y icono
function agregarIncidente(){
  var imagen = document.getElementById('iconoAgregado').src
  var archivo = document.getElementById("botonAgregarIcono").files[0];
  var nombreIncidente = document.getElementById('inputNombreIncidente').value; 
     if(nombreIncidente == ""){
         document.getElementById('validacion').classList.remove('contenedorDelInput__textoNombreVal');
         document.getElementById('validacion').classList.add('contenedorDelInput__inputTextRed');
         return false;
     }else{
       document.getElementById('validacion').classList.add('contenedorDelInput__textoNombreVal');
     }
     if(imagen == "" ||!(/\.(jpg|png)$/i).test(archivo.name)){
        document.getElementById('validarImagen').classList.remove('divFondoBlanco__textoIcono');
        document.getElementById('validarImagen').classList.add('divFondoBlanco__textoIconoValidacion');
        document.getElementById('validarImagen').innerHTML = "Debes agregar un icono o el icono agregado no es valido"
        return false;
     }else{
      document.getElementById('validarImagen').classList.add('divFondoBlanco__textoIcono');
      document.getElementById('validarImagen').classList.remove('divFondoBlanco__textoIconoValidacion');
      document.getElementById('validarImagen').innerHTML = "Icono del tipo de asistencia"
     }
  var data = new FormData();
  console.dir(document.getElementById('botonAgregarIcono').files[0]);
  data.append(
    'nombre', document.getElementById('inputNombreIncidente').value
  )
  data.append(
    'icono', document.getElementById('botonAgregarIcono').files[0]
  )    
  console.log(data);
fetch('/registroDeAsistencias/crear',{
      method: 'POST',
      body: data
      
  }).then(res =>{
    console.log(res.status)
    if(res.status!==201){
      throw new Error(res.message)
    } 
    return res.json();
  })
  .then(res =>  {
    openModal();

  })
  .catch(err =>{
    document.getElementById('parrafoUno').innerHTML = 'El incidente registrado ya existe'
  });
}
function regresar(){
//   fetch('/registroDeIncidentes',{
       
//  }).then(res =>{
//      return res.json();
//  }).then(res =>{
//    console.log(res);
//    document.getElementById('nombreIncidente').innerHTML = res.nombre;
//  }).catch(err =>{
//      console.log(err);
//  });
   window.location.href ="../configuracion.html";
}

 


document.querySelector("header").appendChild(
  createSidebar([
   {
       name: 'Usuarios',
       icon: 'account_circle',
        href: '#',
        active: true
   }
])
);

document.querySelector("main").insertBefore(
  createTopNavbar(
    'Agregar asistencia',
    {
        profilePic: 'http://localhost:8080/assets/images/FotoAdmin/Jorgetran.png',
        name: 'Juan',
        rol: 'Ruta',    
        href: '#'
    },
    [
       {
            icon: 'account_circle',
           name: 'Mi Perfil',
            href: '#'
       },
      {
           icon: 'settings',
           name: 'Configuración',
            href: '#'
       },
       {
           icon: 'exit_to_app',
           name: 'Cerrar Sesión',
           href: '#'
        }
    ]
),document.querySelector(".cuerpoDeLaPantalla")
);

function mensaje(){
  var madre = document.createElement('div');
  var mensaje = document.createElement('p');
  mensaje.innerHTML = "La asistencia fue creada exitosamente"
  madre.appendChild(mensaje);
  return madre;
 }
 function agregar(){
  location.href="../../modules/RegistroDeAsistencias/registroDeAsistencias.html"
}

document.querySelector('main').appendChild(
  createModal(
      'Asistencias', // El titulo del modal
      mensaje(), 
      [
         {
            name: 'Aceptar', // nombre del boton
            event: 'click', // evento al que va a reaccionar
            action: agregar, // metodo qeu va a ejecutar, echo por ustedes   nunca sin parentesis
            style:  buttons.PRIMARY // OPCIONAL
          }
       

      ],
      { 
          height: '40%', 
          width: '40%' 
      })
);
