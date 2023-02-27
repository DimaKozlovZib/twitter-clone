import React from 'react';
import Layout from './Layout';
import UserInfo from '../modules/UserInfo/UserInfo';
import MessageList from '../modules/MessageList/MessageList';

const UserPage = () => {
    return (
        <Layout>
            <UserInfo />
            <MessageList />
        </Layout>
    );
}

export default UserPage;

