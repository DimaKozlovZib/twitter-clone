import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import { useParams } from 'react-router-dom';
import UserInfo from '../modules/UserInfo/UserInfo';
import { getUser } from '../API/userApi';
import { useSelector } from 'react-redux';
import MessageList from '../modules/MessageList/MessageList';

const UserPage = () => {
    const { id } = useParams();
    const isAuth = useSelector(state => state.isAuth)
    const [user, setUser] = useState({});
    const [canEdit, setCanEdit] = useState(null);

    useEffect(() => {
        const getData = async () => {
            if (isAuth !== null) {
                const userInfo = await getUser(id, isAuth);
                setUser(userInfo.data.user)
                setCanEdit(userInfo.data.canEdit)
            }
        }
        getData()
    }, [id, isAuth]);

    return (
        <Layout>
            <UserInfo user={user} canEdit={canEdit} />
            <MessageList onlyThisUserId={id} />
        </Layout>
    );
}

export default UserPage;

