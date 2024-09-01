import { useParams } from "react-router-dom";

const Success = () => {
  const { id: patientName } = useParams();
  return <div>{patientName}</div>;
};

export default Success;
