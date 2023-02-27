import React, { useState } from 'react';
import FormInput from "../../components/FormInput/FormInput";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import emailFormInput from "../../images/emailFormImg.svg";
import passwordFormInput from "../../images/passwordFormImg.svg";
import { validationsEmail, validationsPassword } from './validations';
import { login } from './API';
import { messagesPath, registrationPath } from '../../routes';
import { setAuthAction, setUserAction } from '../../store';

const LoginForm = () => {
	const dispatch = useDispatch();
	const History = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [errorEmail, setErrorEmail] = useState(null);
	const [errorPassword, setErrorPassword] = useState(null);

	const [errorFromServer, setErrorFromServer] = useState(null);

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

	const onSubmit = async (e) => {
		e.preventDefault();
		if (errorEmail || errorPassword) return false;

		setErrorFromServer(null);

		const result = await login(email, password,);

		if (result) {
			localStorage.setItem(
				"accessToken",
				result.data?.accessToken
			);

			dispatch(setUserAction(result.data.user));
			dispatch(setAuthAction(true))
			History(`/${messagesPath}`);
		} else {
			setErrorFromServer(result.data?.message);
		}
	}

	return (
		<div className="LoginForm-wrapper center-form">
			<div className="LoginForm">
				<div className="LoginForm-title">
					<h2>Вход</h2>
				</div>
				<form
					onSubmit={onSubmit}
					className="Login-form"
				>
					{
						[emailObj, passwordObj]
							.map(item => <FormInput {...item} key={item.title} />)
					}

					{
						errorFromServer && (
							<p className="error errorFromServer">
								{errorFromServer}
							</p>
						)
					}
					<div className="LoginForm_submit-button">
						<button>Войти</button>
					</div>
					<div className="registration">
						Нет аккаунта? <Link to={`/${registrationPath}`}>Создать</Link>
					</div>
				</form>
			</div>
		</div>
	);
}

export default LoginForm;
