const validationsPassword = {
    minLength: 8,
    isNotEmpty: true,
}

const validationsEmail = {
    isEmail: true,
    isNotEmpty: true,
}

const validationsName = {
    isNotEmpty: true,
}

export {
    validationsEmail, validationsName, validationsPassword
}