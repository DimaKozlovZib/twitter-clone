const host = ''//on server will https://domen.ru/

export const userFriendsPath = (id = ':id') =>
    host + `dreamscape/user/${id}/friends`;

export const userInfoPath = (userId = ':userId') =>
    host + `dreamscape/user/${userId}`;

export const hashtagPath = (hashtagName = ':hashtagName') =>
    host + `dreamscape/hashtag/${hashtagName}`;

export const searchPath = (model = ':model', searchText = ':searchText') =>
    host + `dreamscape/search/${model}/${searchText}`;

export const messagePath = (id = ':id') =>
    host + `dreamscape/message/${id}`;

export const addRetweetPath = (id = ':id') =>
    host + `dreamscape/message/${id}/retweet`;


export const myFriendsPath = host + 'dreamscape/friends';
export const messagesPath = host + 'dreamscape/messages';
export const registrationPath = host + 'dreamscape/registration';
export const loginPath = host + 'dreamscape/login';
export const editPath = host + 'dreamscape/edit';
export const addMessagePath = host + 'dreamscape/message/add';
export const NotFoundPath = host + 'dreamscape/notFound';
export const onlyAuthPath = host + 'dreamscape/onlyUsers';

const navigatePreficx = '/'

export const NavigatePath = (path) => navigatePreficx + path;