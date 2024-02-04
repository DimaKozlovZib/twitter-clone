import React, { memo, useEffect, useState } from 'react';
import { getUsersData } from './API';
import UserElement from '../../components/UserElement/UserElement';
import './FriendsList.css'
import PageChanger from '../../components/PageChanger/PageChanger';
import LoaderHorizontally from '../../UI/LoaderHorizontally/LoaderHorizontally';

const FriendsList = memo(() => {
    const [isLoadData, setIsLoadData] = useState(false);
    const [friends, setFriends] = useState([]);
    const [friendsCount, setFriendsCount] = useState(null);
    const [page, setPage] = useState(0);
    const limit = 10;

    useEffect(() => {
        const getData = async () => {
            setIsLoadData(false)
            const res = await getUsersData(page, limit)

            if (res) {
                setFriends(res.data.rows)
                setFriendsCount(res.data.count)
            }
            setIsLoadData(true)
        }
        getData()
    }, [page]);

    return (
        <>
            <div className='FriendsList'>
                <div className='FriendsList-title'>
                    <h4>Ваши друзья</h4>
                </div>
                <div className='FriendsList-box'>
                    {isLoadData ?
                        (
                            friends.length > 0 ?
                                friends.map(user => <UserElement user={user} />) :
                                <p className='noOneFriend'>У вас нет друзей :(</p>
                        ) :
                        <LoaderHorizontally />
                    }
                </div>
            </div>
            {friendsCount > limit && <PageChanger page={page} setpage={setPage} limit={limit} count={friendsCount} />}
        </>

    );
})

export default FriendsList;