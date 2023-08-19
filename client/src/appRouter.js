import React from "react";
import { Routes, Route } from 'react-router-dom';
import { userFriendsPath, userInfoPath, messagesPath, hashtagPath, registrationPath, loginPath, editPath, myFriendsPath, searchPath, messagePath } from "./routes";
import MessagesPage from "./pages/MessagesPage";
import UserPage from "./pages/UserPage";
import RegistrationPage from './pages/registrationPage'
import LoginPage from "./pages/LoginPage";
import EditPage from "./pages/EditPage";
import HashtagPage from "./pages/HashtagPage";
import FriendPage from "./pages/FriendPage";
import SearchPage from "./pages/SearchPage";
import MessageIdPage from "./pages/MessageIdPage";

const AppRouter = () => {
    return (
        <Routes >
            <Route path={userInfoPath} element={<UserPage />} />
            <Route path={hashtagPath} element={<HashtagPage />} />
            <Route path={messagesPath} element={<MessagesPage />} />
            <Route path={registrationPath} element={<RegistrationPage />} />
            <Route path={loginPath} element={<LoginPage />} />
            <Route path={editPath} element={<EditPage />} />
            <Route path={myFriendsPath} element={<FriendPage />} />
            <Route path={searchPath} element={<SearchPage />} />
            <Route path={messagePath} element={<MessageIdPage />} />
            <Route path={'*'} element={<MessagesPage />} />
        </Routes>
    )
}
export default AppRouter;