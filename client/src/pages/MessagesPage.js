import React from 'react';
import AddMessage from '../modules/AddMessage/AddMessage';
import MessageList from '../modules/MessageList/MessageList';
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
