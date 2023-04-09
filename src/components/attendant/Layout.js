import {
  useParams,
  useLocation,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { loginAttendant } from "../../slices/attendantSlice";
import { useEffect } from "react";
import { CssBaseline } from '@mui/material';

const Layout = () => {
  const { alias } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const loginAttendantS = useSelector(loginAttendant);

  const auth = () => {
    if (
      !loginAttendantS &&
      (!location.pathname.includes(`login`) &&
        !location.pathname.includes(`signup`))
    ) {
      navigate(`/xp/${alias}/signup`);
    }
  };

  useEffect(() => {
    auth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CssBaseline />
      <Outlet />
    </>
  );
};

export default Layout;
