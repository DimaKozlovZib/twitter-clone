import React from 'react';
import Layout from './Layout'
import FriendsList from '../modules/FriendsList/FriendsList';
import { Helmet } from 'react-helmet-async';
import { PROJECT_NAME } from '../constans';

const FriendPage = () => {
    return (
        <Layout isOnlyAuth>
            <Helmet>
                <title>{`Подписки | ${PROJECT_NAME} | Школьный проект КДМ`}</title>
            </Helmet>
            <FriendsList />
        </Layout>
    );
}

export default FriendPage;
