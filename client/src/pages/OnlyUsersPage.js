import React from 'react';
import Layout from './Layout';
import OnlyUsers from '../components/OnlyUsers/OnlyUsers';
import { Helmet } from 'react-helmet-async';
import { PROJECT_NAME } from '../constans';

const OnlyUsersPage = () => {
    return (
        <Layout>
            <Helmet>
                <title>{`Страница только для пользователей | ${PROJECT_NAME} | Школьный проект КДМ`}</title>
            </Helmet>
            <OnlyUsers />
        </Layout>
    );
}

export default OnlyUsersPage;
