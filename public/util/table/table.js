const CAP_STYLES = {
    active: 'rowStatus--active',
    disable: 'rowStatus--disable'
}
/**********************************************
 * TABLE
 **********************************************/
let tableHeaders;
const statesToCheck = [];

const createActions = (actions, rowInfo) => {
    const tableActions = document.createElement('div');
    const icon = document.createElement('i');

    tableActions.classList.add('tableActions', 'row__text');
    icon.classList.add('material-icons');

    actions.forEach(actionObj => {
        const newIcon = icon.cloneNode(true);
        newIcon.innerHTML = actionObj.icon;
        newIcon.onclick = () => actionObj.action(rowInfo);
        tableActions.appendChild(newIcon);
    });
    // console.dir(tableActions);
    return tableActions;
}

const setStatus = (key, states) => {
    statesToCheck.push({ key: key, states: states });
}

const generateAndCheckCapStyles = (key, val) => {
    const settings = statesToCheck.find(obj => obj.key === key);
    const capsuleEle = document.createElement('div');
    const capsuleSpan = document.createElement('span');
    capsuleEle.classList.add('row__item');
    capsuleSpan.classList.add('rowStatus');
    if (settings) {
        if (settings.states) {
            const getStatus = settings.states.find(obj => obj.sName.toLowerCase() === val.toLowerCase());
            if (getStatus) capsuleSpan.classList.add(getStatus.cssClass);
        }
    }
    capsuleSpan.innerHTML = val;
    capsuleEle.appendChild(capsuleSpan);
    return capsuleEle;
}

const tableLength = () => document.querySelectorAll('.tableBody .checkboxField').length;

const addCheckbox = (rowInfo, keyToMap) => {
    const checkboxField = document.createElement('input');
    checkboxField.classList.add('checkboxField');
    checkboxField.type = 'checkbox';
    checkboxField.value = rowInfo[keyToMap];
    checkboxField.onclick = (e) => {
        // console.log(e.target);
        // const isSelected = selectedFields.find(info => info.id === rowInfo.id);
        // if (isSelected) {
        //     selectedFields = selectedFields.filter(info => info.id !== rowInfo.id);
        // } else {
        //     selectedFields.push(rowInfo);
        // }
        // console.log(selectedFields);
    };
    return checkboxField;
}

const createHeaders = (headers) => {
    tableHeaders = headers;
    const tableHeader = document.createElement('div');
    const checkboxField = document.createElement('input');
    const spanHeader = document.createElement('span');

    tableHeader.classList.add('tableHeader');
    checkboxField.classList.add('checkboxField');
    spanHeader.classList.add('column');
    checkboxField.type = 'checkbox';
    checkboxField.id = 'checkCol';
    checkboxField.onclick = markAllBoxes;
    tableHeader.appendChild(checkboxField);

    headers.map(({ key, as, type }) => {
        const spanEle = spanHeader.cloneNode(true);
        spanEle.innerHTML = as.split('').map((l, i) => {
            if (i === 0) {
                return l.toUpperCase();
            }
            return l;
        }).join('');
        return spanEle.cloneNode(true);
    }).forEach(span => {
        tableHeader.appendChild(span);
    });
    spanHeader.innerHTML = 'Acciones';
    tableHeader.appendChild(spanHeader);
    // console.log(tableHeader);
    return tableHeader;
};
const createTableBody = (list, actions, checkBoxKey) => {
    const tableBody = document.createElement('div');
    const rowGenrator = document.createElement('div');
    tableBody.classList.add('tableBody');
    rowGenrator.classList.add('row');

    list.map((obj, listIndex) => {
        let rowWrapper = rowGenrator.cloneNode('true');
        rowWrapper.appendChild(addCheckbox(obj, checkBoxKey));
        tableHeaders.forEach(tHeader => {
            const currentValue = obj[tHeader.key];
            if (currentValue) {
                switch (tHeader.type) {
                    case 'text':
                        const rowSpan = document.createElement('span');
                        rowSpan.classList.add('row__item');
                        rowSpan.innerHTML = currentValue;
                        rowWrapper.appendChild(rowSpan);
                        break;

                    case 'pic':
                        const tableImageWrapper = document.createElement('div');
                        const tableImagaDelimitter = document.createElement('div');
                        const tableImage = document.createElement('img');
                        tableImageWrapper.classList.add('tableImage');
                        tableImagaDelimitter.classList.add('tableImagaDelimitter');
                        tableImage.src = currentValue;
                        tableImage.alt = tHeader.key + '_' + listIndex;
                        tableImagaDelimitter.appendChild(tableImage);
                        tableImageWrapper.appendChild(tableImagaDelimitter);
                        rowWrapper.appendChild(tableImageWrapper);
                        break;

                    case 'capsule':
                        rowWrapper.appendChild(
                            generateAndCheckCapStyles(tHeader.key, currentValue)
                        );
                        break;

                    default:
                        break;
                }

            } else {
                rowWrapper.appendChild(
                    document.createElement('div')
                );
            }
        });
        rowWrapper.appendChild(createActions(actions, obj));
        // console.dir(rowWrapper);
        return rowWrapper;
    }).forEach(rowEle => {
        tableBody.appendChild(rowEle);
    });
    // console.log(tableBody);
    return tableBody;
}

const createTable = (keys, list, actions, checkBoxKey) => {
    const tableWrapper = document.createElement('div');
    const tableDivition = document.createElement('div');
    tableWrapper.classList.add('tableWrapper');
    tableDivition.classList.add('tableDivition');

    tableWrapper.appendChild(
        createHeaders(keys)
    );
    tableWrapper.appendChild(
        tableDivition
    );
    tableWrapper.appendChild(
        createTableBody(list, actions, checkBoxKey)
    );
    console.dir(tableWrapper.childNodes);

    return tableWrapper;
}

const markAllBoxes = () => {
    const checkColEleVerif = document.querySelector('#checkCol').checked;
    [...document.querySelectorAll('.checkboxField')]
        .filter(ele => ele.id !== 'checkCol')
        .forEach(ele => {
            if (checkColEleVerif) {
                if (!ele.checked) ele.click();
            } else {
                if (ele.checked) ele.click();
            }
        });
}

const getCheckedEles = () => {
    return [...document.querySelectorAll('.tableBody .checkboxField')]
        .filter(ele => ele.checked)
        .map(ele => {
            return ele.value
        });
}

/**********************************************
* TABLE
**********************************************/


/*************** EXAMPLE *************/

// createHeaders([
//     { key: 'profilePicture', as: 'Foto', type: 'pic' },
//     { key: 'nombre', as: 'Nombre', type: 'text' },
//     { key: 'email', as: 'correo', type: 'text' },
//     { key: 'numeroCedula', as: '# cédula', type: 'text' },
//     { key: 'tipo', as: 'Tipo', type: 'text' },
//     { key: 'status', as: 'Estatus', type: 'text' },
//     { key: 'phoneNumber', as: 'Télefono', type: 'text' },
//     { key: 'nombre', as: 'Nombre', type: 'text' }
// ]);
// createTableBody([
//     {
//         _id: '8465468dgdgr8',
//         tipo: 'ruta',
//         genero: 'femenino',
//         numeroCedula: 112346598,
//         nombre: 'Bruce Wayne Wayne',
//         fechaNacimiento: '2005-11-09',
//         email: 'some@gamil.com',
//         profilePicture: 'http://localhost:8082/assets/images/userProfile/2020-04-13T172744.835Z_infinitystones@marvel.com_b9bd498e5a4cfbb42583e792d414c911.jpg',
//         phoneNumber: '8888-88888',
//         status: 'Habilitado'
//     },
//     {
//         _id: '8465468dgdgr8',
//         tipo: 'ruta',
//         genero: 'femenino',
//         numeroCedula: 112346598,
//         nombre: 'Steve Rogers Rogers',
//         fechaNacimiento: '2005-11-09',
//         email: 'some@gamil.com',
//         profilePicture: 'http://localhost:8082/assets/images/userProfile/2020-04-13T172744.835Z_infinitystones@marvel.com_b9bd498e5a4cfbb42583e792d414c911.jpg',
//         phoneNumber: '8888-88888',
//         status: 'Habilitado'
//     },
//     {
//         _id: '8465468dgdgr8',
//         tipo: 'ruta',
//         genero: 'femenino',
//         numeroCedula: 112346598,
//         nombre: 'Peter Parker Parker',
//         fechaNacimiento: '2005-11-09',
//         email: 'some@gamil.com',
//         profilePicture: 'http://localhost:8082/assets/images/userProfile/2020-04-13T172744.835Z_infinitystones@marvel.com_b9bd498e5a4cfbb42583e792d414c911.jpg',
//         phoneNumber: '8888-88888',
//         status: 'Habilitado'
//     }
// ]);
