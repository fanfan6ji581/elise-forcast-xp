import { useParams } from "react-router-dom";
import { xpConfigS } from "../../../slices/gameSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";

const InstructionPage = () => {
  const { alias } = useParams()
  const navigate = useNavigate();
  const xpConfig = useSelector(xpConfigS);

  useEffect(() => {
    if (xpConfig) {
      switch (xpConfig.treatment) {
        case 3:
          return navigate(`/xp/${alias}/instruction3`)
        case 2:
          return navigate(`/xp/${alias}/instruction2`)
        case 1:
        default:
          return navigate(`/xp/${alias}/instruction1`)
      }
    }
    // eslint-disable-next-line
  }, [])
};

export default InstructionPage;
