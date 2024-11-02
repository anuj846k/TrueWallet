import { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
import Balance from "../components/Balance";
import Users from "../components/Users";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/account/balance",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setBalance(response.data.balance);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          toast.error("Session Expired ! Please sign in to continue");
          navigate("/signin");
        } else {
          toast.error("Error while fetching balance");
        }
        console.log("Error while fetching balance", err);
      }
    };
    fetchBalance();
  },[]);

  return (
    <div>
      <Appbar />
      <div className="m-8">
        <Balance value={balance} />
        <Users />
      </div>
    </div>
  );
};
export default Dashboard;
