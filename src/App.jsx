import { useEffect, useState, createContext, useContext } from "react";
import Login from "./pages/login.page.jsx";
import Index from "./Index.jsx";
import Feed from "./pages/Feed.page.jsx";
import Register from "./pages/Register.page.jsx";
import UserInfo from "./pages/UserInfo.page.jsx";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Friends from "./pages/Friends.page.jsx";
import axios from "axios";
import ProfilePage from "./pages/Profile.page.jsx";
import AddPost from "./components/createPost/AddPost.jsx";
import Save from "./pages/Save.page.jsx";
import SearchPage from "./pages/Search.page.jsx";

// import './App.css'

export const AppContext = createContext(null);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/get-user",
          { withCredentials: true }
        );
        setUser(response.data.user);
        setIsAuthenticated(true);
        // navigate("/");
      } catch (error) {
        console.log("User not authenticated");
        navigate("/login-user");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const RequireAuth = ({ children }) => {
    const { isAuthenticated } = useContext(AppContext);
    return isAuthenticated ? children : <Navigate to="/login-user" />;
  };

  const HasAuth = ({ children }) => {
    const { isAuthenticated } = useContext(AppContext);
    return !isAuthenticated ? children : <Navigate to="/" />;
  };

  return (
    <AppContext.Provider value={{ user, isAuthenticated, setIsAuthenticated }}>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Index />
            </RequireAuth>
          }
        >
          <Route index element={<Feed />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/user-profile/:userId" element={<ProfilePage />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/save" element={<Save />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
        <Route
          path="/login-user"
          element={
            <HasAuth>
              <Login />
            </HasAuth>
          }
        />
        <Route path="/update-profile/:userId" element={<UserInfo />} />
        <Route path="/register-new-user" element={<Register />} />
      </Routes>
    </AppContext.Provider>
  );
}

export default App;
