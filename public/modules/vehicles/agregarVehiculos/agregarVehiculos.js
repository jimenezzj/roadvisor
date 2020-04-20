const mainWrapper = document.querySelector('.wrapperContainer');
const uploadPicWrapper = document.querySelector('.uploadPicWrapper');
const picsWrapper = document.querySelector('.picsWrapper');
const imagesPreview = document.querySelector('.imagesPreview');
const imageFieldWrapper = document.querySelector('.imageFieldWrapper');
const btnUploadPicture = document.querySelector('.btnUploadPic');
const btnAddPic = document.querySelector('.btnAddPic');
const vehiImagesField = document.querySelector('#vehiImagesField');
const picsList = document.querySelector('.picsList');
const imagePreview = document.querySelector('#imagePreview');
const btnSubmitForm = document.querySelector('#btnSubmitForm');
const btnBack = document.querySelector('.btnBack');

const fieldWrapperCustomSelect = document.querySelector('.fieldWrapper--customSelect');
const brandOriginalSelect = document.querySelector('#brandOriginalSelect');

let currentFiles = [];
let uploadFileInfo = {
    currentFiles: [],
    active: ''
}

btnBack.href = getCurrentURL + 'modules/vehicles/vehiculos.html';

const updateCurrentFiles = (filesUpload) => {
    let newPicItem;
    if (currentFiles.length === 0) {
        toBase64(filesUpload[0])
            .then(data => {
                imagePreview.src = data;
            })
            .catch(err => {
                console.log(err);
            })
    }
    picsList.innerHTML = null;
    currentFiles = [...currentFiles, ...filesUpload];
    currentFiles.forEach((file, i) => {
        const nomarlIndex = i + 1;
        newPicItem = createListItem(file.name, nomarlIndex);
        if (!uploadFileInfo.active) {
            newPicItem.classList.add('picsList__item--active');
            uploadFileInfo.active = nomarlIndex;
        } else {
            if ((nomarlIndex) === uploadFileInfo.active) {
                newPicItem.classList.add('picsList__item--active');
            }
        }
        newPicItem.querySelector('.close-icon').onclick =
            removeImageItem.bind(this, nomarlIndex);
        picsList.appendChild(newPicItem);
    })
    console.dir(imagePreview);

};

const setActiveState = (index, e) => {
    // console.dir(e.target);
    if (e.target.innerHTML !== 'close') {
        document.querySelector('#picsList__item' + uploadFileInfo.active)
            .classList.remove('picsList__item--active');
        uploadFileInfo.active = index;
        document.querySelector('#picsList__item' + index).classList.add('picsList__item--active');
        toBase64(currentFiles[index - 1])
            .then(result => {
                imagePreview.src = result;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

const removeImageItem = (index) => {
    currentFiles = currentFiles.filter((_, i) => (i + 1) !== index); // updates currentFiles uploaded array
    // si el que se elimina es el active o es menor a la posicion actual del active
    // le resta 1 para mantener el mismo elmento seleccionado
    if (currentFiles.length > 0) {
        if (document.querySelector('#picsList__item' + index).classList.contains('picsList__item--active')
            || index < uploadFileInfo.active) {
            let imgPositionToLoad;
            uploadFileInfo.active = uploadFileInfo.active - 1;
            imgPositionToLoad = uploadFileInfo.active === 0 ? 0 : uploadFileInfo.active - 1;
            toBase64(currentFiles[imgPositionToLoad])
                .then(result => {
                    imagePreview.src = result;
                })
                .catch(err => console.error(err))
        }
        updateCurrentFiles([]);
    } else {
        uploadPicWrapper.classList.toggle('uploadPicWrapper--hide');
        picsWrapper.classList.remove('picsList--show');
        imagesPreview.classList.remove('picsList--show');
        imageFieldWrapper.classList.remove('imageFieldWrapper--full');
    }
}

const generateSelectOptions = () => {
    const option = document.createElement('option');
    vehiclesBrandList.forEach(objtName => {
        const newOptionEle = option.cloneNode(true);
        newOptionEle.innerHTML = objtName.name.toLocaleLowerCase().replace(/^\w/, c => c.toUpperCase());
        newOptionEle.value = objtName.name.split(' ').join('_');
        brandOriginalSelect.appendChild(newOptionEle);
    });
};

const sendVehicleInfo = () => {
    const form = new FormData();
    const inputElemts = document.querySelectorAll('.formWrapper input');
    const selectElemts = document.querySelectorAll('.formWrapper select');
    inputElemts.forEach(({ id, value }) => {
        if (id !== 'driver' && id !== 'brand' && id !== 'vehiImagesField') {
            form.append(id, value);
        }
    });
    selectElemts.forEach(({ id, value }) => {
        if (id === 'brandOriginalSelect') form.append('marca', value);
        form.append(id, value);
    });
    currentFiles.forEach(file => {
        form.append('vehiclePictures', file);
    })
    form.append('correo', getSession.correo);
    form.append('type', 'carro');
    // for (let e of form.keys()) {
    //     console.log(e, ':', form.get(e));
    // }
    fetch('http://localhost:8082/vehicles/add', {
        method: 'POST',
        body: form
    })
        .then(res => res.json())
        .then(res => {
            if (res.statusCode !== 201) {
                throw new Error(res.message);
            }
            createModalMessage(res.message + ', con el # de placa: ' + res.data.numeroPlaca)
        })
        .catch(err => {
            console.log(err);
            createModalMessage(err.message);
        });
}

function agregarConductor() {
    const capaPrincipal = document.querySelectorAll('.capaPrincipal input[type=radio]');
    let fieldChecked;
    capaPrincipal.forEach(field => {
        if (field.checked) {
            fieldChecked = field.value;
        }
    });
    if (fieldChecked) {
        document.querySelector('#driver').value = fieldChecked;
        console.dir(fieldChecked);
        console.dir(document.querySelector('#driver'));
        closeModal();
    }

}

btnUploadPicture.addEventListener('click', () => {
    vehiImagesField.click();
});

btnAddPic.addEventListener('click', () => {
    vehiImagesField.click();
});

btnSubmitForm.onclick = sendVehicleInfo;

vehiImagesField.addEventListener('change', (e) => {
    // console.dir(e.target);
    const filesLenght = e.target.files;
    if (filesLenght) {
        uploadPicWrapper.classList.add('uploadPicWrapper--hide');
        picsWrapper.classList.add('picsList--show');
        imagesPreview.classList.add('picsList--show');
        imageFieldWrapper.classList.add('imageFieldWrapper--full');
    }
    updateCurrentFiles(filesLenght);
});

document.querySelector('#driver').addEventListener('click', () => {
    document.querySelector('main').appendChild(
        createModal(
            'Agregar',
            asignarConductor(),
            [

                {
                    name: 'Cancelar', // nombre del boton
                    event: 'click', // evento al que va a reaccionar
                    action: cancelar, // metodo qeu va a ejecutar, echo por ustedes   nunca sin parentesis
                    style: buttons.SECONDARY // OPCIONAL
                },
                {
                    name: 'Agregar', // nombre del boton
                    event: 'click', // evento al que va a reaccionar
                    action: agregarConductor, // metodo qeu va a ejecutar, echo por ustedes   nunca con parentesis
                    style: buttons.PRIMARY // OPCIONAL
                }


            ],
            { // objeto con ajustes del modal
                position: { // posicion de los elementos de modal
                    header: 'center', // titulo acepta: 'start', 'center' & 'end'
                    body: '',  // body del modal acepta: 'start', 'center' & 'end'
                    actions: 'center' // contenedor de botones acepta: 'start', 'center' & 'end'
                },
                height: '85%', // altura custom del modal, SOLO USAR PORCENTAJES (MAX=88%)
                width: '70%' // ancho custom del modal, SOLO USAR PORCENTAJES (MAX=91%)
            })
    );
    openModal()
});

mainWrapper.querySelector('header').appendChild(
    createSidebar(getNavbarOpts)
);

mainWrapper.querySelector('main').insertBefore(
    createTopNavbar(
        'Usuarios',
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
    document.querySelector('.breadCrumb')
);

const createListItem = (picName, indexPos) => {
    let imageItem;
    const picItemElement = document.createElement('div');
    const iconElement = document.createElement('i');
    iconElement.classList.add('material-icons');
    const picNameElement = document.createElement('p');
    const xIcon = iconElement.cloneNode(true);
    const imageIcon = iconElement.cloneNode(true);
    xIcon.classList.add('close-icon');
    picItemElement.classList.add('picsList__item');
    picNameElement.innerHTML = picName;
    xIcon.innerHTML = 'close';
    imageIcon.innerHTML = 'insert_photo';
    picItemElement.appendChild(imageIcon);
    picItemElement.appendChild(picNameElement);
    picItemElement.appendChild(xIcon);
    imageItem = picItemElement.cloneNode(true);
    imageItem.id = 'picsList__item' + indexPos;
    imageItem.onclick = setActiveState.bind(this, indexPos);
    return imageItem;
}


fieldWrapperCustomSelect.addEventListener('click', (e) => {
    console.log(e.target);
});

document.querySelector('.actionHelperEle').style.width =
    document.querySelector('.btnBack').offsetWidth + 'px';

const createModalMessage = (mes) => {
    const pEle = document.createElement('p');
    pEle.innerHTML = mes;

    document.body.appendChild(
        createModal(
            'Exito!', // El titulo del modal
            pEle,    // Pegan el contenido perzonalizado que necesitan meter en  el modal
            // un  arreglo de botones, que ajusta sus propiedades
            [
                {
                    name: 'Ok', // nombre del boton
                    event: 'click', // evento al que va a reaccionar
                    action: closeModal, // metodo qeu va a ejecutar, echo por ustedes
                    style: buttons.PRIMARY // OPCIONAL
                }
            ],
            { // objeto con ajustes del modal
                position: { // posicion de los elementos de modal
                    header: '', // titulo acepta: 'start', 'center' & 'end'
                    body: '',  // body del modal acepta: 'start', 'center' & 'end'
                    action: '' // contenedor de botones acepta: 'start', 'center' & 'end'
                },
            }
        )
    );
    openModal();
};

function asignarConductor() {
    const capaPrincipal = document.createElement('div');
    fetch("/users/", {
        headers: {
            'Authorization': getSession.token
        }
    }).then(res => {
        return res.json();
    }).then(result => {
        const data = result.data;
        capaPrincipal.classList.add('capaPrincipal')
        capaPrincipal.id = 'principal';
        const listaUsuarios = document.createElement('p');
        listaUsuarios.innerHTML = "Lista de usuarios disponibles";
        capaPrincipal.appendChild(listaUsuarios);
        if (capaPrincipal) {
            console.log(data);

            for (var i = 0; i < data.length; i++) {
                const capaUsuario = document.createElement('div');
                capaUsuario.classList.add('capaUsuario');
                const nombreUsuario = document.createElement('p');
                nombreUsuario.classList.add('nombreUsuarios');
                nombreUsuario.innerHTML = data[i].nombre;
                const check = document.createElement("input");
                check.type = 'radio'
                check.name = 'seleccion'
                check.id = data[i].email;
                check.value = data[i].email;
                check.classList.add('check');
                const correoUsuario = document.createElement('p');
                correoUsuario.innerHTML = data[i].email;
                const fotoUsuario = document.createElement('img');
                fotoUsuario.src = getCurrentURL + data[i].profilePicture;
                fotoUsuario.classList.add('fotoUsuario');
                capaUsuario.appendChild(check);
                capaUsuario.appendChild(fotoUsuario);
                capaUsuario.appendChild(nombreUsuario);
                capaUsuario.appendChild(correoUsuario);
                capaPrincipal.appendChild(capaUsuario);
            }
        }

    })
        .catch(err => {
            console.log(err);
        });
    console.log(capaPrincipal);

    return capaPrincipal;
}


function cancelar() {
    closeModal()
}

generateSelectOptions();

