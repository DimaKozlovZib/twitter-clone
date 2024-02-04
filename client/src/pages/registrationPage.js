import React from 'react';
import RegistrationForm from '../modules/RegistrationForm/RegistrationForm';
import { Helmet } from 'react-helmet';
import { PROJECT_NAME } from '../constans';

const RegistrationPage = () => {
    return (
        <>
            <Helmet title={`Регистрация | ${PROJECT_NAME} | Школьный проект КДМ`} />
            <RegistrationForm />
        </>
    );
}

export default RegistrationPage;