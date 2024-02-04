import React from 'react';
import LoginForm from '../modules/LoginForm/LoginForm';
import { Helmet } from 'react-helmet';
import { PROJECT_NAME } from '../constans';

const LoginPage = () => {
    return (
        <>
            <Helmet title={`Вход в аккаунт | ${PROJECT_NAME} | Школьный проект КДМ`} />
            <LoginForm />
        </>
    );
}

export default LoginPage;
