import { setAuthAction, setUserAction } from ".";
import { login } from "../API/userApi";

export function getUser() {
    return async (dispatch) => {
        try {
            let response = await login()

            if (response && response.status === 200) {
                dispatch(setUserAction(response.data.user))
                dispatch(setAuthAction(true))
                return;
            }
            dispatch(setAuthAction(false))
        } catch (error) {
            console.error(error)
        }
    }
}