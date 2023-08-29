import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Auth from '../apis/Auth';


const useMailbox = () => {
  const navigate = useNavigate();
  const mailBoxes = Auth.getMailboxes();
  const {pathname} = useLocation();
  useEffect(() => {
    if((!mailBoxes || mailBoxes.length === 0) && pathname !== '/callback') {
      navigate("/email/settings/account")
    }
  }, []);
  return mailBoxes;
}

export default useMailbox;