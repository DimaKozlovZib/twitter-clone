import React from "react";
import { Routes, Route } from 'react-router-dom';
import { userFriendsPath, userInfoPath, messagesPath, hashtagPath, registrationPath, loginPath, editPath, myFriendsPath, searchPath, messagePath, addMessagePath, addRetweetPath, NotFoundPath, onlyAuthPath } from "./routes";
import MessagesPage from "./pages/MessagesPage";
import UserPage from "./pages/UserPage";
import RegistrationPage from './pages/registrationPage'
import LoginPage from "./pages/LoginPage";
import EditPage from "./pages/EditPage";
import HashtagPage from "./pages/HashtagPage";
import FriendPage from "./pages/FriendPage";
import SearchPage from "./pages/SearchPage";
import MessageIdPage from "./pages/MessageIdPage";
import AddPostPage from "./pages/AddPostPage";
import NotFoundPage from "./pages/NotFoundPage";
import OnlyUsersPage from "./pages/OnlyUsersPage";

const AppRouter = () => {
    return (
        <Routes >
            <Route path={userInfoPath()} element={<UserPage />} />
            <Route path={hashtagPath()} element={<HashtagPage />} />
            <Route path={messagesPath} element={<MessagesPage />} />
            <Route path={registrationPath} element={<RegistrationPage />} />
            <Route path={loginPath} element={<LoginPage />} />
            <Route path={editPath} element={<EditPage />} />
            <Route path={myFriendsPath} element={<FriendPage />} />
            <Route path={searchPath()} element={<SearchPage />} />
            <Route path={messagePath()} element={<MessageIdPage />} />
            <Route path={addMessagePath} element={<AddPostPage />} />
            <Route path={addRetweetPath()} element={<AddPostPage retweet />} />
            <Route path={NotFoundPath} element={<NotFoundPage />} />
            <Route path={onlyAuthPath} element={<OnlyUsersPage />} />
            <Route path={'*'} element={<NotFoundPage />} />
        </Routes>
    )
}
export default AppRouter;