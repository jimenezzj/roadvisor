const mainWrapper = document.querySelector('.wrapperContainer');
const uploadPicWrapper = document.querySelector('.uploadPicWrapper');
const picsWrapper = document.querySelector('.picsWrapper');
const imagesPreview = document.querySelector('.imagesPreview');
const imageFieldWrapper = document.querySelector('.imageFieldWrapper');
const btnUploadPicture = document.querySelector('.btnUploadPic');
const btnAddPic = document.querySelector('.btnAddPic');
const vehiImagesField = document.querySelector('#vehiImagesField');
const picsList = document.querySelector('.picsList');

let currentFiles = [];
let uploadFileInfo = {
    currentFiles: [],
    active: ''
}

const updateCurrentFiles = (filesUpload) => {
    let newPicItem;
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
};

const setActiveState = (index, e) => {
    // console.dir(e.target);
    if (e.target.innerHTML !== 'close') {
        document.querySelector('#picsList__item' + uploadFileInfo.active)
            .classList.remove('picsList__item--active');
        uploadFileInfo.active = index;
        document.querySelector('#picsList__item' + index).classList.add('picsList__item--active')
    }
}

const removeImageItem = (index) => {
    currentFiles = currentFiles.filter((_, i) => (i + 1) !== index); // updates currentFiles uploaded array
    // si el que se elimina es el active o es menor a la posicion actual del active
    // le resta 1 para mantener el mismo elmento seleccionado
    if (currentFiles.length > 0) {
        if (document.querySelector('#picsList__item' + index).classList.contains('picsList__item--active')
            || index < uploadFileInfo.active) {
            uploadFileInfo.active = uploadFileInfo.active - 1;
        }
        updateCurrentFiles([]);
    } else {
        uploadPicWrapper.classList.toggle('uploadPicWrapper--hide');
        picsWrapper.classList.remove('picsList--show');
        imagesPreview.classList.remove('picsList--show');
        imageFieldWrapper.classList.remove('imageFieldWrapper--full');
    }
}

btnUploadPicture.addEventListener('click', () => {
    vehiImagesField.click();
});

btnAddPic.addEventListener('click', () => {
    vehiImagesField.click();
});

vehiImagesField.addEventListener('change', (e) => {
    // console.dir(e.target);
    const filesLenght = e.target.files;
    if (filesLenght) {
        uploadPicWrapper.classList.add('uploadPicWrapper--hide');
        picsWrapper.classList.add('picsList--show');
        imagesPreview.classList.add('picsList--show');
        imageFieldWrapper.classList.add('imageFieldWrapper--full');
    }
    // uploadPicWrapper.classList.remove('uploadPicWrapper--hide');
    // picsWrapper.classList.remove('picsList--show');
    // imagesPreview.classList.remove('picsList--show');
    updateCurrentFiles(filesLenght);
});

mainWrapper.querySelector('header').appendChild(
    createSidebar([
        {
            name: 'Vehículos',
            icon: 'directions_car',
            href: '#',
            active: true
        }
    ])
);

mainWrapper.querySelector('main').insertBefore(
    createTopNavbar(
        'Vehiculos',
        {
            profilePic: 'http://localhost:8082/assets/images/userProfile/2020-03-30T055248.441Z_infinitystones@marvel.com_58af605285bfde99b935a47d590ca774.jpg',
            name: 'Pepe',
            rol: 'Tradicional',
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

/*
                            <div class="picsList__item">
                                <i class="material-icons">insert_photo</i>
                                <p>Nombre de foto.jpg</p>
                                <i class="material-icons">close</i>
                            </div>
*/
