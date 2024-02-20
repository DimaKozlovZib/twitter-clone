import React from 'react';
import MessageList from '../modules/MessageList/MessageList';
import Layout from './Layout';
import { Helmet } from 'react-helmet-async';
import { PROJECT_NAME } from '../constans';

const MessagesPage = () => {
    return (
        <Layout navPageName='home'>
            <Helmet>
                <title>{`Главная | ${PROJECT_NAME} | Школьный проект КДМ`}</title>
            </Helmet>
            <MessageList />
        </Layout>
    );
}

export default MessagesPage;
