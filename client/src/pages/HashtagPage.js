import React from 'react';
import Layout from './Layout';
import MessageList from '../modules/MessageList/MessageList'
import HashtagInfo from '../modules/HashtagInfo/HashtagInfo';

const HashtagPage = () => {
    return (
        <Layout canClose>
            <HashtagInfo />
            <MessageList />
        </Layout>
    );
}

export default HashtagPage;
