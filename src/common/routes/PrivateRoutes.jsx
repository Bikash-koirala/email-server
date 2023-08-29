import { Navigate } from "react-router-dom";
import DashboardLayout from "../Layouts/DashboardLayout/DashboardLayout";
import {useAuth} from "../hooks/auth"

const PrivateRoutes = () => {
  let {isAuth} = useAuth();
  return <>{isAuth ? <DashboardLayout /> : <Navigate to="/" />}</>;
};

export default PrivateRoutes;
