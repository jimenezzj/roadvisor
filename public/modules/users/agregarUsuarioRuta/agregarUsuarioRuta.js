const btnPicture = document.querySelector('.btnPicture');
const inputFieldPic = document.querySelector('#profilePicture');
const imageElement = document.querySelector('.picWrapper__picture');
const titlePictureName = document.querySelector('.pictureName');
const userRoutesFormValues = document.querySelectorAll('.form input');
const selectGender = document.querySelector('#genero');
const btnSubmitForm = document.querySelector('#btnSubmitForm');


const userForm = {
    "numeroCedula": {
        value: '',
        valid: false,
        validators: [required, onlyNumbers,
            minLengthOrEqual(9, 'La cédula debe contener 9 numeros'),
            maxLenghtOrEqual(9, 'La cédula debe contener 9 numeros')],
        errors: []
    },
    "nombre": {
        value: '',
        valid: false,
        validators: [required],
        errors: []
    },
    "pApellido": {
        value: '',
        valid: false,
        validators: [required],
        errors: []
    },
    "sApellido": {
        value: '',
        valid: false,
        validators: [required],
        errors: []
    },
    "fechaNacimiento": {
        value: '',
        valid: false,
        validators: [requiredO, isOverAge],
        errors: []
    },
    "email": {
        value: '',
        valid: false,
        validators: [required, isValidEmail],
        errors: []
    },
    "genero": {
        value: '',
        valid: false,
        validators: [required],
        errors: []
    },
    "profilePicture": {
        value: '',
        file: '',
        valid: true,
        validators: [isAnImage],
        errors: []
    }
}

const fillValue = input => {
    switch (input.type) {
        case 'date':
        case 'select-one':
        case 'text':
            userForm[input.id].value = input.value;
            break;

        default:
            userForm[input.id].value = input.value;
            break;
    }
    // console.log(userForm);dif
}


const validateField = (input) => {
    const inputData = userForm[input.id];
    const summaryStatus = [];
    inputData.validators
        .forEach(val => {
            const inputValue = inputData.value;
            const validationResult = val(inputValue);
            summaryStatus.push(validationResult.status.toString());
            console.log(validationResult);
            // remove error if validatonResult returns true
            if (validationResult.status) {
                // check the error code
                inputData.errors = inputData.errors.filter(error => {
                    if (error.code !== validationResult.error.code) {
                        return error;
                    }
                });

            } else {
                if (!(userForm[input.id].errors.find(err => err.code === validationResult.error.code))) {
                    inputData.errors.push(validationResult.error.message);
                }
            }
            // console.log(validationResult);
        });
    inputData.valid = summaryStatus.find(ele => ele === 'false') ? false : true;
}

const showErrors = (userKey) => {
    const errorElement = document.querySelector('#' + userKey + ' + .error');
    if (!(userForm[userKey].valid)) {
        errorElement.innerHTML = userForm[userKey].errors[0];
        errorElement.classList.add('error--show');
    } else {
        errorElement.classList.remove('error--show');
    }
}

const showAllErrors = () => {
    [...userRoutesFormValues, selectGender]
        .forEach(input => {
            validateField(input);
            showErrors(input.id);
        });
}

const checkFormValidations = () => {
    // devuelve el numero de inputs que son validos
    const numberFieldsValid = Object.keys(userForm).filter(key => userForm[key].valid).length;
    // cantidad de inputs en el form
    const numberOfFields = Object.keys(userForm).length;
    // si todos los inpput validos ei igual al total de espacios
    return numberFieldsValid === numberOfFields;
}

const sendForm = () => {
    const userJSON = {};
    const formTest = new FormData();
    Object.keys(userForm).forEach(key => {
        if (userForm[key].file) {
            formTest.append(key, userForm[key].file);
            userJSON[key] = userForm[key].value;
        }
        formTest.append(key, userForm[key].value);
    });
    // console.log(userJSON);
    fetch('http://localhost:8082/usuario/agregar', {
        method: 'POST',
        body: formTest
    })
        .then(res => res.json())
        .then(res => {
            if (res.statusCode !== 201) {
                const error = new Error(res.message);
                error.fields = res.fields;
                error.statusCode = res.statusCode;
                throw error;
            }
            console.log(res);
        })
        .catch(err => {
            console.error(err);
            console.log({ ...err });
            checkDbData(err);
        });
}

const changeFileInfo = (src, fileName, input) => {
    // let currentInputValue = userForm[input.id].value;
    imageElement.src = src;
    titlePictureName.innerHTML = fileName;
    userForm[input.id].value = !isEmpty(src) ? fileName : src;
    userForm[input.id].file = input.files[0];
    validateField(input);
    showErrors(input.id);
    if (!(userForm[input.id].errors.length) && userForm[input.id].value) {
        imageElement.classList.add('picWrapper__picture--show');
    } else {
        imageElement.classList.remove('picWrapper__picture--show');
    }
    // console.log(userForm[input.id]);
}

const uploadPicture = (input) => {
    const raeder = new FileReader();
    const fileVerification = inputFieldPic.files[0];
    raeder.onloadend = () => {
        changeFileInfo(raeder.result, fileVerification.name, input);
    }
    if (!!fileVerification) {
        raeder.readAsDataURL(fileVerification)
    } else {
        changeFileInfo('', 'Escoge una foto..', input);
    }
};

const checkDbData = (err) => {
    Object.keys(err.fields).forEach(fieldKey => {
        const currentInput = document.getElementById(fieldKey);
        switch (fieldKey) {
            case 'email':
                userForm[fieldKey].validators.push(
                    isNotEqualTo(
                        err.fields[fieldKey].value,
                        err.fields[fieldKey].errors[0] // xxx se debe asignar el correct xxxx
                    ));
                userForm[fieldKey].errors = err.fields[fieldKey].errors;
                userForm[fieldKey].valid = false;
                showErrors(fieldKey);
                break;

            default:
                break;
        }
    });
}

const clearForm = () => {
    Object.keys(userForm).forEach(key => {
        userForm[key].value = '';
        userForm[key].valid = key !== 'profilePicture' ? false : true;
        userForm[key].errors = [];
        if (userForm[key].file) {
            userForm[key].file = '';
        }
    });
    userRoutesFormValues.forEach(input => {
        if (input.type === 'file') {
            imageElement.src = '';
            input.value = '';
            document.querySelector('.pictureName').innerHTML = 'Escoge una foto..';
            imageElement.classList.remove('picWrapper__picture--show');
        } else {
            input.value = userForm[input.id].value;
        }
    });
}

userRoutesFormValues.forEach(input => {
    input.addEventListener('change', (e) => {
        if (e.target.type === 'file') {
            uploadPicture(e.target);
        } else {
            fillValue(e.target);
            validateField(e.target);
            showErrors(e.target.id)
        }
    });
});

selectGender.addEventListener('change', ({ target }) => {
    fillValue(target);
    validateField(target);
    showErrors(target.id);
});

btnPicture.addEventListener('click', () => {
    document.querySelector('#profilePicture').click();

});


btnSubmitForm.addEventListener('click', () => {
    if (checkFormValidations()) {
        sendForm();
    } else {
        showAllErrors();
    }
});