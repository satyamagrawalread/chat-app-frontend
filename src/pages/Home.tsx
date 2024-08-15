import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { removeToken } from "../helpers";
const Home = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/signin", { replace: true });
  };
  return (
    <div>
      {user ? (
        <div className="w-full flex justify-center mt-10">
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        <div className="w-screen h-screen flex justify-center items-center gap-5">
          <Button type="primary" onClick={() => {navigate('/signin')}}>
            Login
          </Button>
          <Button type="primary" onClick={() => {navigate('/signup')}}>
            Sign Up
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
