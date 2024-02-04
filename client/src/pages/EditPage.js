import React from 'react';
import EditForm from '../modules/EditForm/EditForm';
import Layout from './Layout';
import { PROJECT_NAME } from '../constans';
import { Helmet } from 'react-helmet';

const EditPage = () => {
    return (
        <Layout isOnlyAuth navPageName='edit'>
            <Helmet title={`Изменение профиля | ${PROJECT_NAME} | Школьный проект КДМ`} />
            <EditForm />
        </Layout>
    );
}

export default EditPage;
