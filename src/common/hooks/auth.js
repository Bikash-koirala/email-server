import Auth from "../apis/Auth";
import { isTokenValid, parseUser } from "../../utils/http-utils";
import { useDispatch } from "react-redux";
import { removeProfile, updateProfile } from "../../store/users";

export const useAuth = () => {
  const token = Auth.getLocalAccessToken();
  const isAuth = isTokenValid(token);
  const dispatch = useDispatch();

  if (!isAuth) {
    Auth.removeUser();
    dispatch(removeProfile());
  } else {
    // setAuthToken()
    const profile = parseUser(token);
    dispatch(updateProfile(profile));
  }

  return { isAuth: isAuth || false };
};
