import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUsersData } from './API';
import UserElement from '../../components/UserElement/UserElement';

const FriendsList = () => {
    const isAuth = useSelector(state => state.isAuth)

    const [friends, setFriends] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const getData = async () => {
            const res = await getUsersData(page)

            if (res) setFriends(res.data.rows)
        }
        getData()
    }, []);

    return (
        <div className='FriendsList'>
            {
                friends.length > 0 &&
                friends.map(user => <UserElement user={user} />)
            }
        </div>
    );
}

export default FriendsList;
