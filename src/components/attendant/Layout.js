import {
  useParams,
  useLocation,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { loginAttendant } from "../../slices/attendantSlice";
import { setXpConfig } from "../../slices/gameSlice";
import { getPretask } from "../../database/pretask";
import { useEffect } from "react";
import { CssBaseline } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";

const Layout = () => {
  const { alias } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const loginAttendantS = useSelector(loginAttendant);

  const fetchPretask = async () => {
    const xpConfig = await getPretask(alias)
    dispatch(setXpConfig(xpConfig));
  }

  const auth = async () => {
    if (
      !loginAttendantS &&
      (!location.pathname.includes(`login`) &&
        !location.pathname.includes(`signup`))
    ) {
      return navigate(`/xp/${alias}/signup`);
    }
    await fetchPretask();
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
