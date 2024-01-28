import React from 'react';
import Layout from './Layout';
import AddMessage from '../modules/AddMessage/AddMessage';

const AddPostPage = ({ retweet = false }) => {
    return (
        <Layout isOnlyAuth>
            <AddMessage isRetweet={retweet} />
        </Layout>
    );
}

export default AddPostPage;
