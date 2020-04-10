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

const updateCurrentFiles = (filesUpload) => {
    currentFiles = [...currentFiles, ...filesUpload];
    currentFiles.forEach(file => {
        picsList.appendChild(
            createListItem(file.name)
        );
    })
    console.log(filesListElements);
};

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
    } else {
        uploadPicWrapper.classList.remove('uploadPicWrapper--hide');
        picsWrapper.classList.remove('picsList--show');
        imagesPreview.classList.remove('picsList--show');
    }
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

const createListItem = (picName) => {
    const picItemElement = document.createElement('div');
    const iconElement = document.createElement('i');
    iconElement.classList.add('material-icons');
    const picNameElement = document.createElement('p');
    const xIcon = iconElement.cloneNode(true);
    const imageIcon = iconElement.cloneNode(true);
    picItemElement.classList.add('picsList__item');
    picNameElement.innerHTML = picName;
    xIcon.innerHTML = 'insert_photo';
    imageIcon.innerHTML = 'close';
    picItemElement.appendChild(xIcon);
    picItemElement.appendChild(picNameElement);
    picItemElement.appendChild(imageIcon);
    return picItemElement.cloneNode(true);
}
/*
                            <div class="picsList__item">
                                <i class="material-icons">insert_photo</i>
                                <p>Nombre de foto.jpg</p>
                                <i class="material-icons">close</i>
                            </div>
*/
