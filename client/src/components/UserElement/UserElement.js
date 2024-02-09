import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import { useSelector } from 'react-redux';
import './UserElement.css'
import { Subscribe, Unsubscribe } from './API';
import { NavigatePath } from '../../routes';

const UserElement = ({ user, subscribeBtn = false }) => {
    const [subscribedUser, setSubscribedUser] = useState(null);
    const userIdAuth = useSelector(state => state.user.id);
    const isAuth = useSelector(state => state.isAuth);
    const { id, img, email, name, friends } = user;

    useEffect(() => {
        if (friends?.length > 0 && friends[0]?.userId === userIdAuth && isAuth) {
            return setSubscribedUser(true)
        }
        setSubscribedUser(false)
    }, []);

    const onClick = async () => {
        try {
            if (!isAuth) return

            if (subscribedUser) {
                const res = await Unsubscribe(id)
                if (res) setSubscribedUser(false)

            } else {
                const res = await Subscribe(id)
                if (res) setSubscribedUser(true)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className='UserElement'>
            <Link to={NavigatePath(userInfoPath(id))}>
                <UserAvatar isNotLink url={img} />
                <div className='UserElement__info'>
                    <div className='info__name'>
                        <h3>{name}</h3>
                    </div>
                    <div className='info__email'>
                        <h4>{email}</h4>
                    </div>
                </div>
            </Link>
            {(isAuth && subscribeBtn) &&
                (<button className='subscribe-btn' onClick={onClick}>
                    {subscribedUser ?
                        (<svg width="21" height="21" className='unsubscribe' viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.8669 10.3726H13.8669M11.8669 5.37256C11.8669 6.43342 11.4455 7.45084 10.6954 8.20099C9.94523 8.95113 8.92781 9.37256 7.86694 9.37256C6.80608 9.37256 5.78866 8.95113 5.03852 8.20099C4.28837 7.45084 3.86694 6.43342 3.86694 5.37256C3.86694 4.31169 4.28837 3.29428 5.03852 2.54413C5.78866 1.79399 6.80608 1.37256 7.86694 1.37256C8.92781 1.37256 9.94523 1.79399 10.6954 2.54413C11.4455 3.29428 11.8669 4.31169 11.8669 5.37256ZM7.86694 12.3726C6.27564 12.3726 4.74952 13.0047 3.6243 14.1299C2.49908 15.2551 1.86694 16.7813 1.86694 18.3726V19.3726H13.8669V18.3726C13.8669 16.7813 13.2348 15.2551 12.1096 14.1299C10.9844 13.0047 9.45824 12.3726 7.86694 12.3726Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        ) :
                        (<svg width="20" height="20" className='subscribe'
                            viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 7V10M16 10V13M16 10H19M16 10H13M11 5C11 6.06087 10.5786 7.07828 9.82843 7.82843C9.07828 8.57857 8.06087 9 7 9C5.93913 9 4.92172 8.57857 4.17157 7.82843C3.42143 7.07828 3 6.06087 3 5C3 3.93913 3.42143 2.92172 4.17157 2.17157C4.92172 1.42143 5.93913 1 7 1C8.06087 1 9.07828 1.42143 9.82843 2.17157C10.5786 2.92172 11 3.93913 11 5ZM1 18C1 16.4087 1.63214 14.8826 2.75736 13.7574C3.88258 12.6321 5.4087 12 7 12C8.5913 12 10.1174 12.6321 11.2426 13.7574C12.3679 14.8826 13 16.4087 13 18V19H1V18Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>)}
                </button>)}
        </div>
    );

}

export default UserElement;
