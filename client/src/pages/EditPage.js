import React from 'react';
import EditForm from '../modules/EditForm/EditForm';
import Layout from './Layout';

const EditPage = () => {
    return (
        <Layout isOnlyAuth navPageName='edit'>
            <EditForm />
        </Layout>
    );
}

export default EditPage;
