import React, { useEffect } from "react";
import { GetCurrentUser } from "../calls/users";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { message, Layout, Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { Header } from "antd/es/layout/layout";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { setUser } from "../redux/userSlice";
import { Menu as MenuComponent } from "antd";


const roleRoutes = {
  "/admin": "admin",
  "/partner": "partner",
};

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.user);
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  // const location = useLocation();

  const navItems = [
      {
        label: "Home",
        icon: <HomeOutlined />,
        onClick: () => navigate("/")
      },
      {
        label: user ? user.name : "",
        icon: <UserOutlined />,
        children: [
          {
            label: (
              <span
                onClick={() => {
                  if (user.role === 'admin') {
                    navigate("/admin");
                  } else if (user.role === 'partner') {
                    navigate("/partner");
                  } else {
                    navigate("/profile");
                  }
                }}
              >
                My Profile
              </span>
            ),
            icon: <ProfileOutlined />,
          },
          {
            label: (
              <Link
                to="/login"
                onClick={() => {
                  localStorage.removeItem("token");
                }}
              >
                Log Out
              </Link>
            ),
            icon: <LogoutOutlined />,
          },
        ],
      },
    ];

  const getValidUser = async () => {
    try {
      dispatch(showLoading());
      const response = await GetCurrentUser();
      dispatch(setUser(response.data));
      dispatch(hideLoading());
    } catch (error) {
      dispatch(setUser(null));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getValidUser();
    } else {
      navigate("/login");
    }
  }, []);

  if (!user) {
    return null; // Optionally show a loader or placeholder here
  }

  const requiredRole = roleRoutes[location.pathname];
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;  
  }

  return (
    user && (
      <Layout>
        <Header
          className="d-flex justify-content-between"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <h3 className="demo-logo text-white m-0" style={{ color: "white" }}>
            Book My Show
          </h3>
          <Menu theme="dark" mode="horizontal" items={navItems} />
        </Header>
        <div style={{ padding: 24, minHeight: 380, background: "#fff" }}>
          {children}
        </div>
      </Layout>
    )
  );
}

export default ProtectedRoute;