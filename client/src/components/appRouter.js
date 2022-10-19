import React from "react";
import { Routes, Route } from 'react-router-dom';
import { userFriendsPath, userInfoPath, messagesPath, hashtagPath } from "../routes";
import MessagesPage from "./pages/MessagesPage";
import UserPage from "./pages/UserPage";

const AppRouter = () => {
    return (
        <Routes >
            <Route path={userInfoPath} element={<UserPage />} />
            <Route path={messagesPath} element={<MessagesPage />} />
            <Route path={'*'} element={<MessagesPage />} />
        </Routes>
    )
}
export default AppRouter;