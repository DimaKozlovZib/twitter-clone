import React from 'react';
import Layout from './Layout';
import UserInfo from '../modules/UserInfo/UserInfo';
import { Helmet } from 'react-helmet-async';
import { PROJECT_NAME } from '../constans';

const UserPage = () => {
    return (
        <Layout>
            <Helmet>
                <title>{`Пользователь | ${PROJECT_NAME} | Школьный проект КДМ`}</title>
            </Helmet>
            <UserInfo />
        </Layout>
    );
}

export default UserPage;

