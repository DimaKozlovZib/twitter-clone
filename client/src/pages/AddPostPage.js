import React from 'react';
import Layout from './Layout';
import AddMessage from '../modules/AddMessage/AddMessage';

const AddPostPage = ({ retweet }) => {
    return (
        <Layout>
            <AddMessage isRetweet={retweet} />
        </Layout>
    );
}

export default AddPostPage;
