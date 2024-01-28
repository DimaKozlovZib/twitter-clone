import React from 'react';
import Layout from './Layout'
import FriendsList from '../modules/FriendsList/FriendsList';

const FriendPage = () => {
    return (
        <Layout isOnlyAuth>
            <FriendsList />
        </Layout>
    );
}

export default FriendPage;
