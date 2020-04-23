const wrapperContainer = document.querySelector('.wrapperContainer');

document.querySelector('#btnSubmitForm').onclick = () => {
    const formData = {};
    const session = getSession;
    formData['pais'] = 'CostaRica';
    formData['dueno'] = session.correo;
    document.querySelectorAll('.fieldsWrapper input').forEach(inputEle => {
        // console.dir(inputEle.name);
        formData[inputEle.name] = inputEle.value;
    });
    document.querySelectorAll('.cardTypeList input').forEach(ele => {
        if (ele.checked) {
            // console.dir(ele.value);
            formData[ele.name] = ele.value;
        }
    });
    // for (let e of formData.keys()) {
    //     console.log(e, ':', formData.get(e));
    // }
    fetch(getCurrentURL + 'tarjetas/add', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.json())
        .then(result => {
            if (result.statusCode !== 201) {
                const error = new Error(result.message);
                throw error;
            }
            createModalMessage(result.message,
                () => window.location.assign(`${getCurrentURL}modules/configuracion/configuracion.html`));
        })
        .catch(err => {
            console.log(err)
        })

}

document.querySelectorAll('.cardTypeList .cardTypeList__item--cover').forEach(cardEle => {
    cardEle.addEventListener('click', e => {
        if (document.querySelector('.cardTypeList__item--active'))
            document.querySelector('.cardTypeList__item--active').classList.remove('cardTypeList__item--active');
        e.target.parentNode.classList.add('cardTypeList__item--active');
        e.target.parentNode.querySelector('input').click();
    });
});

const createModalMessage = (mes, action) => {
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
                    action: action, // metodo qeu va a ejecutar, echo por ustedes
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


wrapperContainer.querySelector('header').appendChild(
    createSidebar(getNavbarOpts)
);

wrapperContainer.querySelector('main').insertBefore(
    createTopNavbar(
        'Agregar Tarjeta',
        getTopNavOpts(),
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
