import React from 'react';
import MessageList from '../MessageList/MessageList';
import Layout from './Layout';

const MessagesPage = () => {
    return (
        <Layout navPageName='home'>
            <MessageList />
        </Layout>
    );
}

export default MessagesPage;
