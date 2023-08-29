import { Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/404";
import SignIn from "./pages/authentication/SignIn";
import Email from "./pages/Email/Email";
import PrivateRoutes from "./common/routes/PrivateRoutes";
import SignUp from "./pages/authentication/SignUp";
import AccountManagement from "./pages/Setttings/AccountManagement/AccountManagement";
import useMailbox from "./common/hooks/mailbox";
import Callback from "./pages/Callback";
import MultiTabEmails from "./common/components/MultiTabEmails/MultiTabEmails";
import MobileDeviceEmail from "./common/components/MobileDeviceRoute";

const App = () => {
  useMailbox();
  return (
    <div className="w-full h-full main-body">
      <Routes>
        {/* dashboard nested routes */}
        <Route path="/email" element={<PrivateRoutes />}>
          {/* emails nested routes */}
          <Route path="/email" element={<Email />}>
            <Route path=":emailId" element={<MultiTabEmails />} />
          </Route>
          {/* mobile email detail */}
          <Route path="email-detail/:emailId" element={<MobileDeviceEmail />} />
          {/* setting route */}
          <Route path="settings/account" element={<AccountManagement />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route path="/callback" element={<Callback />} />
        {/* home page routing */}
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/unexpected-error"
          element={
            <PageNotFound heading="Something went wrong! Please Try again." />
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default App;
