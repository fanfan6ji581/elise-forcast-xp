import { useParams } from "react-router-dom";
import { xpConfigS } from "../../slices/gameSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";

const QuizPage = () => {
  const { alias } = useParams()
  const navigate = useNavigate();
  const xpConfig = useSelector(xpConfigS);

  useEffect(() => {
    if (xpConfig) {
      switch (xpConfig.treatment) {
        case 3:
          return navigate(`/xp/${alias}/quiz3`)
        case 2:
          return navigate(`/xp/${alias}/quiz2`)
        case 1:
        default:
          return navigate(`/xp/${alias}/quiz1`)
      }
    }
    // eslint-disable-next-line
  }, [])
};

export default QuizPage;
