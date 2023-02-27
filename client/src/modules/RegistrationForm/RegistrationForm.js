import React, { useState } from "react";
import FormInput from "../../components/FormInput/FormInput";
import nameFormInput from "../../images/nameFormImg.svg";
import emailFormInput from "../../images/emailFormImg.svg";
import passwordFormInput from "../../images/passwordFormImg.svg";
import {
	validationsEmail,
	validationsName,
	validationsPassword,
} from "./validations";
import { registration } from "./API";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginPath, messagesPath } from "../../routes";
import { setAuthAction, setUserAction } from "../../store";

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
				History(`/${messagesPath}`);
			} else {
				setErrorFromServer(
					result?.message
				);
			}
		}
	};

	const nameObj = {
		placeholder: "введите имя",
		type: "text",
		imgUrl: nameFormInput,
		state: name,
		setState: setName,
		validations: validationsName,
		setError: setErrorName,
		title: "Имя"
	};
	const emailObj = {
		placeholder: "введите почту",
		type: "email",
		imgUrl: emailFormInput,
		state: email,
		setState: setEmail,
		validations: validationsEmail,
		setError: setErrorEmail,
		title: "Почта"
	}
	const passwordObj = {
		placeholder: "введите пароль",
		type: "password",
		imgUrl: passwordFormInput,
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
						<button>Зарегистрироваться</button>
					</div>
					<div className="login">
						Уже есть аккаунт? <Link to={`/${loginPath}`}>Войти.</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default RegistrationForm;
