import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    navigate("/login");
  }
  navigate('/testing')
  return <></>;
}
