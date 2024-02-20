import React from 'react';
import EditForm from '../modules/EditForm/EditForm';
import Layout from './Layout';
import { PROJECT_NAME } from '../constans';
import { Helmet } from 'react-helmet-async';

const EditPage = () => {
    return (
        <Layout isOnlyAuth navPageName='edit'>
            <Helmet>
                <title>{`Изменение профиля | ${PROJECT_NAME} | Школьный проект КДМ`}</title>
            </Helmet>
            <EditForm />
        </Layout>
    );
}

export default EditPage;
