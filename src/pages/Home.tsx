import { Button, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { removeToken } from "../helpers";
import Chats from "../components/Chats";
import CreateSession from "../components/modal/CreateSession";
import { useEffect, useState } from "react";


const Home = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if(user) {
        setLoading(false);
    }
    else {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }
  }, [user])
  const handleLogout = () => {
    setUser(undefined);
    removeToken();
    navigate("/signin", {replace: true});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div>
      {user ? (
        <div className="w-screen h-screen flex flex-col">
          <div className="w-screen flex justify-between py-5 px-5 bg-gray-100 border-b border-gray-500">
            <span className="text-emerald-800 font-semibold">Username: {user.username}</span>
            <div className="flex justify-end gap-5">
            <div>
              <button
                className=" bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded shadow hover:shadow-lg "
                onClick={() => setShowModal(true)}
              >
                Create Session
              </button>
              {showModal ? (<CreateSession setShowModal={setShowModal} />) : null}
            </div>
            <button className=" bg-red-700 hover:bg-red-900 text-white text-sm px-4 py-2 rounded shadow hover:shadow-lg " onClick={handleLogout}>
              Logout
            </button>
            </div>
          </div>
          <Chats />
        </div>
      ) : (
        <div className="w-screen h-screen flex justify-center items-center gap-5">
          <Button
            type="primary"
            onClick={() => {
              navigate("/signin");
            }}
          >
            Login
          </Button>
          <Button
            type="primary"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign Up
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
