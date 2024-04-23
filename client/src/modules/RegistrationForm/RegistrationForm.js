import React, { useState } from "react";
import FormInput from "../../components/FormInput/FormInput";
import {
	validationsEmail,
	validationsName,
	validationsPassword,
} from "./validations";
import { registration } from "./API";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { NavigatePath, loginPath, messagesPath } from "../../routes";
import { setAuthAction, setUserAction } from "../../store";
import ButtonBlue from "../../UI/ButtonBlue/ButtonBlue";

const RegistrationForm = () => {

	const dispatch = useDispatch();
	const History = useNavigate();

	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [date, setDate] = useState("");

	const [errorPassword, setErrorPassword] = useState(null);
	const [errorName, setErrorName] = useState(null);
	const [errorEmail, setErrorEmail] = useState(null);

	const [errorFromServer, setErrorFromServer] = useState(null);

	const onSubmit = async (e) => {
		e.preventDefault();

		const errorsCount = [
			errorEmail,
			errorName,
			errorPassword,
		].filter((i) => i !== null).length;

		if (errorsCount === 0) {
			setErrorFromServer(null);

			const result = await registration(
				name,
				email,
				password,
				date
			);

			if (result?.status === 200) {

				localStorage.setItem(
					"accessToken",
					result.data.accessToken
				);
				dispatch(setUserAction(result.data.user));
				dispatch(setAuthAction(true))
				History(NavigatePath(messagesPath));
			} else {
				setErrorFromServer(
					result.response?.data?.message
				);
			}
		}
	};

	const nameObj = {
		placeholder: "введите имя",
		type: "text",
		img: (
			<svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 5C12 6.06087 11.5786 7.07828 10.8284 7.82843C10.0783 8.57857 9.06087 9 8 9C6.93913 9 5.92172 8.57857 5.17157 7.82843C4.42143 7.07828 4 6.06087 4 5C4 3.93913 4.42143 2.92172 5.17157 2.17157C5.92172 1.42143 6.93913 1 8 1C9.06087 1 10.0783 1.42143 10.8284 2.17157C11.5786 2.92172 12 3.93913 12 5ZM8 12C6.14348 12 4.36301 12.7375 3.05025 14.0503C1.7375 15.363 1 17.1435 1 19H15C15 17.1435 14.2625 15.363 12.9497 14.0503C11.637 12.7375 9.85652 12 8 12Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		),
		state: name,
		setState: setName,
		validations: validationsName,
		setError: setErrorName,
		title: "Имя"
	};
	const emailObj = {
		placeholder: "введите почту",
		type: "email",
		img: (
			<svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M1.47217 4.69444L9.36217 9.95444C9.69083 10.1737 10.0771 10.2907 10.4722 10.2907C10.8673 10.2907 11.2535 10.1737 11.5822 9.95444L19.4722 4.69444M3.47217 15.6944H17.4722C18.0026 15.6944 18.5113 15.4837 18.8864 15.1087C19.2615 14.7336 19.4722 14.2249 19.4722 13.6944V3.69444C19.4722 3.16401 19.2615 2.6553 18.8864 2.28023C18.5113 1.90516 18.0026 1.69444 17.4722 1.69444H3.47217C2.94173 1.69444 2.43303 1.90516 2.05795 2.28023C1.68288 2.6553 1.47217 3.16401 1.47217 3.69444V13.6944C1.47217 14.2249 1.68288 14.7336 2.05795 15.1087C2.43303 15.4837 2.94173 15.6944 3.47217 15.6944Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		),
		state: email,
		setState: setEmail,
		validations: validationsEmail,
		setError: setErrorEmail,
		title: "Почта"
	}
	const passwordObj = {
		placeholder: "введите пароль",
		type: "password",
		img: (
			<svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M9 13V15M3 19H15C15.5304 19 16.0391 18.7893 16.4142 18.4142C16.7893 18.0391 17 17.5304 17 17V11C17 10.4696 16.7893 9.96086 16.4142 9.58579C16.0391 9.21071 15.5304 9 15 9H3C2.46957 9 1.96086 9.21071 1.58579 9.58579C1.21071 9.96086 1 10.4696 1 11V17C1 17.5304 1.21071 18.0391 1.58579 18.4142C1.96086 18.7893 2.46957 19 3 19ZM13 9V5C13 3.93913 12.5786 2.92172 11.8284 2.17157C11.0783 1.42143 10.0609 1 9 1C7.93913 1 6.92172 1.42143 6.17157 2.17157C5.42143 2.92172 5 3.93913 5 5V9H13Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		),
		state: password,
		setState: setPassword,
		validations: validationsPassword,
		setError: setErrorPassword,
		title: "Пароль"
	}
	const dateObj = {
		type: "date",
		state: date,
		setState: setDate,
		title: "Дата рождения"
	}

	return (
		<div className="RegistrationForm-wrapper center-form">
			<div className="RegistrationForm">
				<div className="RegistrationForm-title">
					<h2>Регистрация</h2>
				</div>
				<form
					onSubmit={onSubmit}
					className="RegistrationForm-form"
				>
					{
						[nameObj, emailObj, passwordObj, dateObj]
							.map(item => <FormInput {...item} key={item.title} />)
					}

					{
						errorFromServer && (
							<p className="error errorFromServer">
								{errorFromServer}
							</p>
						)
					}
					<div className="RegistrationForm_submit-button">
						<ButtonBlue>Зарегистрироваться</ButtonBlue>
					</div>
					<div className="login">
						Уже есть аккаунт? <Link to={NavigatePath(loginPath)}>Войти.</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default RegistrationForm;
