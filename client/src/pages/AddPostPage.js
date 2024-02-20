import React from 'react';
import Layout from './Layout';
import AddMessage from '../modules/AddMessage/AddMessage';
import { Helmet } from 'react-helmet-async';
import { PROJECT_NAME } from '../constans';

const AddPostPage = ({ retweet = false }) => {
    return (
        <Layout isOnlyAuth>
            <Helmet>
                <title>{`Добавление сообщения | ${PROJECT_NAME} | Школьный проект КДМ`}</title>
            </Helmet>
            <AddMessage isRetweet={retweet} />
        </Layout>
    );
}

export default AddPostPage;
