import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

// import Users from "./users/pages/Users";
// import NewPlaces from "./places/pages/NewPlaces";
// import UserPlaces from "./places/pages/UserPlaces";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Auth from "./users/pages/Auth";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

const Users = React.lazy(() => import("./users/pages/Users"));
const NewPlaces = React.lazy(() => import("./places/pages/NewPlaces"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./users/pages/Auth"));

function App() {
  const { token, login, logout, userId } = useAuth();

  let route;

  if (token) {
    route = (
      <Routes>
        <Route path="/" exact element={<Users />} />
        <Route path="/:uid/places" exact element={<UserPlaces />} />
        <Route path="/places/new" exact element={<NewPlaces />} />
        <Route path="/places/:placeId" exact element={<UpdatePlace />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    );
  } else {
    route = (
      <Routes>
        <Route path="/" exact element={<Users />} />
        <Route path="/:uid/places" exact element={<UserPlaces />} />
        <Route path="/auth" exact element={<Auth />} />
        <Route path="*" element={<Navigate replace to="/auth" />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        login: login,
        userId: userId,
        logout: logout,
      }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>
          <Suspense fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }>
            {route}
          </Suspense>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
