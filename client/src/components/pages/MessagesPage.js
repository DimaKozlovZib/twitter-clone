import React from 'react';
import AddMessage from '../AddMessage/AddMessage';
import MessageList from '../MessageList/MessageList';
import Layout from './Layout';

const MessagesPage = () => {
    return (
        <Layout navPageName='home'>
            <AddMessage />
            <MessageList />
        </Layout>
    );
}

export default MessagesPage;
