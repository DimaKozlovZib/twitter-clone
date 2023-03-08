import React from 'react';
import EditForm from '../modules/EditForm/EditForm';
import Layout from './Layout';

const EditPage = () => {
    return (
        <Layout navPageName='edit'>
            <EditForm />
        </Layout>
    );
}

export default EditPage;
