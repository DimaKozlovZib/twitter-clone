const validationsPassword = {
    minLength: 8,
    isEmpty: true,
}

const validationsEmail = {
    isEmail: true,
    isEmpty: true,
}

const validationsName = {
    isEmpty: true,
}

export {
    validationsEmail, validationsName, validationsPassword
}