import React from 'react';
import './UserAvatar.css';

const UserAvatar = ({ url }) => {
    return (
        <div>
            {
                url ?
                    (
                        <div className='UserAvatar'>
                            <img src={user.url} alt="" />
                        </div>
                    ) : (
                        <div className='NullAvatar'>
                            <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.5714 5.44444C13.5714 6.62318 13.0898 7.75365 12.2325 8.58714C11.3752 9.42064 10.2124 9.88889 9 9.88889C7.78758 9.88889 6.62482 9.42064 5.76751 8.58714C4.9102 7.75365 4.42857 6.62318 4.42857 5.44444C4.42857 4.2657 4.9102 3.13524 5.76751 2.30175C6.62482 1.46825 7.78758 1 9 1C10.2124 1 11.3752 1.46825 12.2325 2.30175C13.0898 3.13524 13.5714 4.2657 13.5714 5.44444ZM9 13.2222C6.87827 13.2222 4.84344 14.0417 3.34315 15.5003C1.84285 16.9589 1 18.9372 1 21H17C17 18.9372 16.1571 16.9589 14.6569 15.5003C13.1566 14.0417 11.1217 13.2222 9 13.2222Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )
            }
        </div>
    );
}

export default UserAvatar;