import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register.jsx";
import SignIn from "./pages/SignIn.jsx";
import AddDesk from "./pages/AddDesk.jsx";
import Layout from "./layouts/Layout.jsx";
import { useAppContext } from "./contexts/AppContext";
import MyDesks from "./pages/MyDesks.jsx";
import EditDesk from "./pages/EditDesk.jsx";
import Search from "./pages/Search.jsx";
import * as apiClient from "./api-client";
import MyUsers from "./pages/MyUsers.jsx";
import EditUser from "./pages/EditUser.jsx";
import MyBookings from "./pages/MyBookings.jsx";
function App() {
  const { isLoggedIn } = useAppContext();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await apiClient.validateToken();
        setUserRole(response.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchUserRole();
    }
  }, [isLoggedIn]);

  console.log("isLoggedIn:", isLoggedIn);
  console.log("userRole:", userRole);
  const isAdmin = userRole === "IT Admin";
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/search" replace />
            ) : (
              <Navigate to="/sign-in" replace />
            )
          }
        />
        /{/* routes for admin only */}
        {isLoggedIn && isAdmin && (
          <>
            <Route
              path="/register"
              element={
                <Layout>
                  <Register />
                </Layout>
              }
            />
            <Route
              path="/add-desk"
              element={
                <Layout>
                  <AddDesk />
                </Layout>
              }
            />
            <Route
              path="/edit-desk/:deskId"
              element={
                <Layout>
                  <EditDesk />
                </Layout>
              }
            />
            <Route
              path="/my-desks"
              element={
                <Layout>
                  <MyDesks />
                </Layout>
              }
            />
            <Route
              path="/my-users"
              element={
                <Layout>
                  <MyUsers />
                </Layout>
              }
            />
            <Route
              path="/edit-user/:userId"
              element={
                <Layout>
                  <EditUser />
                </Layout>
              }
            />
          </>
        )}
        {/* routes for all users */}
        {isLoggedIn && (
          <>
            <Route
              path="/search"
              element={
                <Layout isLoggedIn={isLoggedIn}>
                  <Search />
                </Layout>
              }
            />
            <Route
              path="/detail/:deskId"
              element={
                <Layout isLoggedIn={isLoggedIn}>
                  <Search />
                </Layout>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <Layout>
                  <MyBookings />
                </Layout>
              }
            />
          </>
        )}
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
