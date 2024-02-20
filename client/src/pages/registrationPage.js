import React from 'react';
import RegistrationForm from '../modules/RegistrationForm/RegistrationForm';
import { Helmet } from 'react-helmet-async';
import { PROJECT_NAME } from '../constans';

const RegistrationPage = () => {
    return (
        <>
            <Helmet>
                <title>{`Регистрация | ${PROJECT_NAME} | Школьный проект КДМ`}</title>
            </Helmet>
            <RegistrationForm />
        </>
    );
}

export default RegistrationPage;