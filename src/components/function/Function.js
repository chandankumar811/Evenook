import axios from "axios";
import { AppContext } from "../../App";

const handleLogout = async (navigate, setIsAuthenticated) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/v1/users/logout",
      {},
      { withCredentials: true }
    );

    if (response.status === 200) {
      // Clear auth info
      setIsAuthenticated(false); // 🚀 This triggers UI update
      navigate("/login-user");
    }
  } catch (error) {
    console.log("Error during logout", error);
  }
};

const handleFollow = async (userId, setSuggestionUsers) => {
  try {
    const response = await axios.post(
      `http://localhost:8000/api/v1/connection/follow/${userId}`,
      {},
      { withCredentials: true }
    );
    if (response.status === 200) {
      console.log("Followed user successfully");
      setSuggestionUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
    }
  } catch (error) {
    console.log("Error following user", error.message);
  }
};

export { handleLogout, handleFollow };
