// const validators = {
const required = (val) => {
    const errorCode = 're01';
    return (!(val))
        ? formError(false, 'Este campo es requerido', errorCode, val)
        : formError(true, null, errorCode, val)
};

const requiredO = (val) => {
    const errorCode = 're01O';
    let status = false;
    // crea un arreglo de booleanos y determina si hay un false, si hay un false falla
    status = Object.keys(val).map(key => (!!val[key])).filter(con => !con).length === 0
        ? true
        : false;
    return (status)
        ? formError(true, null, errorCode, val)
        : formError(false, 'Este campo es requerido', errorCode, val)
};

const isOverAge = (dateString) => {
    const errorCode = 'ioa01';
    const currentDate = new Date();
    const inputDate = new Date(dateString);
    const relativeAge = currentDate.getFullYear() - inputDate.getFullYear();
    const dateVerification = {
        anio: relativeAge >= 18,
        mes: (currentDate.getMonth() >= inputDate.getMonth()),
        dia: (currentDate.getDate() >= inputDate.getDate())
    };
    let errorMessage = 'Debes ser mayor de edad';
    if (!dateVerification.anio) {
        return formError(false, errorMessage, errorCode, dateString);
    }
    if (!dateVerification.mes && relativeAge <= 18) {
        return formError(false, errorMessage, errorCode, dateString);
    }
    if (!dateVerification.dia && relativeAge <= 18) {
        return formError(false, errorMessage, errorCode, dateString);
    }
    errorMessage = null;
    return formError(true, errorMessage, errorCode, dateString);


}

const isAnImage = (name, errorMessage = 'El archivo debe ser una imagen (png o jpg)') => {
    const errorCode = 'isai01';
    return /\.jpg$|\.png$/.test(name.toLowerCase()) || isEmpty(name)
        ? formError(true, null, errorCode, name)
        : formError(false, errorMessage, errorCode, name);
}

const maxLenght = (len, mess = ['El valor debe ser menor a ', ' caracteres']) => {
    const errorCode = 'mxl01';
    const errorMess = typeof mess !== 'string'
        ? mess[0] + len + mess[1]
        : mess;
    return (val) => {
        return val.length < len
            ? formError(true, null, errorCode, val)
            : formError(false, errorMess, errorCode, val);
    };
};

const maxLenghtOrEqual = (len, mess = ['El valor debe ser menor o igual a ', ' caracteres']) => {
    const errorCode = 'mxl01';
    const errorMess = typeof mess !== 'string'
        ? mess[0] + len + mess[1]
        : mess;
    return (val) => {
        return val.length <= len
            ? formError(true, null, errorCode, val)
            : formError(false, errorMess, errorCode, val);
    };
};
;

const minLength = (len, mess = ['El valor debe ser mayor a ', ' caracteres']) => {
    const errorCode = 'minl01';
    const errorMess = typeof mess !== 'string'
        ? mess[0] + len + mess[1]
        : mess;
    return (val) => {
        return val.length > len
            ? formError(true, null, errorCode, val)
            : formError(false, errorMess, errorCode, val);
    };
};

const minLengthOrEqual = (len, mess = ['El valor debe ser mayor o igual a ', ' caracteres']) => {
    const errorCode = 'minl01';
    const errorMess = typeof mess !== 'string'
        ? mess[0] + len + mess[1]
        : mess;
    return (val) => {
        return val.length >= len
            ? formError(true, null, errorCode, val)
            : formError(false, errorMess, errorCode, val);
    };
};

const isValidEmail = (email) => {
    const errorCode = 'ive01';
    const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailReg.test(email) || email.trim().length < 1
        ? formError(true, null, errorCode, email)
        : formError(false, 'Correo es invalido', errorCode, email);
}

const isString = (val) => typeof val === 'string'
    ? formError(true, null, val)
    : formError(false, 'El valor debe ser un texto', errorCode, val);

const onlyNumbers = (val, errorCode = 'onum01') => /^\d+$/.test(val)
    ? formError(true, null, errorCode, val)
    : formError(false, 'Solo se deben ingresar numeros', errorCode, val);

const isEmpty = (val) => val.trim().length < 1;

const isNotEqualTo = (val2, customeMessage = 'El valor es diferente') => {
    return (val1) => {
        const errorCode = 'aeq01';
        const verfication = val1 !== val2
            ? formError(true, null, errorCode, { firstVal: val1, secondVal: val2 })
            : formError(false, customeMessage, errorCode, { firstVal: val1, secondVal: val2 });
        return verfication;
    }
};

const formError = (status, messageIn, customeCode, value) => ({
    status: status,
    error: {
        code: customeCode,
        message: messageIn
    },
    value: value
});


