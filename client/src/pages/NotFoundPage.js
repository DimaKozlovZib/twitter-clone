import React from 'react';
import Layout from './Layout';
import NotFound from '../components/NotFound/NotFound';
import { PROJECT_NAME } from '../constans';
import { Helmet } from 'react-helmet';

const NotFoundPage = () => {
    return (
        <Layout>
            <Helmet title={`Страница не найдена | ${PROJECT_NAME} | Школьный проект КДМ`} />
            <NotFound />
        </Layout>
    );
}

export default NotFoundPage;
