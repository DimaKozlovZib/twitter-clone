import React from "react";
import { Routes, Route } from 'react-router-dom';
import { userFriendsPath, userInfoPath, messagesPath, hashtagPath, registrationPath } from "../routes";
import MessagesPage from "./pages/MessagesPage";
import UserPage from "./pages/UserPage";
import RegistrationPage from './pages/registrationPage'

const AppRouter = () => {
    return (
        <Routes >
            <Route path={userInfoPath} element={<UserPage />} />
            <Route path={messagesPath} element={<MessagesPage />} />
            <Route path={registrationPath} element={<RegistrationPage />} />
            <Route path={'*'} element={<MessagesPage />} />
        </Routes>
    )
}
export default AppRouter;