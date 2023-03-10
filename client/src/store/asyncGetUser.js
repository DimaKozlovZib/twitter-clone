import { setAuthAction, setUserAction } from ".";
import { login } from "../API/userApi";

export function getUser(setIsLoaderModalActive) {
    return async (dispatch) => {
        try {
            const classList = document.querySelector('body').classList;
            classList.add('load')

            let response = await login();

            if (response && response.status === 200) {
                dispatch(setUserAction(response.data.user))
                dispatch(setAuthAction(true))
            } else {
                dispatch(setAuthAction(false))
            }
            setIsLoaderModalActive(false);
            classList.remove('load')
        } catch (error) {
            console.error(error)
        }
    }
}