import React from 'react';
import Layout from './Layout';
import MessageInfo from '../modules/MessageInfo/MessageInfo';
import { Helmet } from 'react-helmet-async';
import { PROJECT_NAME } from '../constans';

const MessageIdPage = () => {
    return (
        <Layout>
            <Helmet>
                <title>{`Сообщение | ${PROJECT_NAME} | Школьный проект КДМ`}</title>
            </Helmet>
            <MessageInfo />
        </Layout>
    );
}

export default MessageIdPage;
