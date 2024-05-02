export const userFriendsPath = (id = ':id') =>
    `dreamscape/user/${id}/friends`;

export const userInfoPath = (userId = ':userId') =>
    `dreamscape/user/${userId}`;

export const hashtagPath = (hashtagName = ':hashtagName') =>
    `dreamscape/hashtag/${hashtagName}`;

export const searchPath = (model = ':model', searchText = ':searchText') =>
    `dreamscape/search/${model}/${searchText}`;

export const messagePath = (id = ':id') =>
    `dreamscape/message/${id}`;

export const addRetweetPath = (id = ':id') =>
    `dreamscape/message/${id}/retweet`;


export const myFriendsPath = 'dreamscape/subscriptions';
export const messagesPath = 'dreamscape';
export const registrationPath = 'dreamscape/registration';
export const loginPath = 'dreamscape/login';
export const editPath = 'dreamscape/edit';
export const addMessagePath = 'dreamscape/message/add';
export const NotFoundPath = 'dreamscape/notFound';
export const onlyAuthPath = 'dreamscape/onlyUsers';

const navigatePreficx = '/'

export const NavigatePath = (path) => navigatePreficx + path;