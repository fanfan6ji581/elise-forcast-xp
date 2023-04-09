import Pretask from "./Pretask";
import TrainingTimer from "../trial/TrainingTimer"
import {
  removeData,
} from "../../../slices/pretaskSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

const PretaskPage = () => {
  const { alias } = useParams()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = () => {
    dispatch(removeData());
    navigate(`/xp/${alias}/pretask/start`);
  }
  return (
    <>
      <Pretask isTraining={true} />
      <TrainingTimer trainingSessionSeconds={60 * 2} onFinish={onFinish} />
    </>
  );
};

export default PretaskPage;
