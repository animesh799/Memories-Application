import React from "react";
import { Suspense } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import MainNavigation from "./Shared/Components/Header/MainNavigation";
import { AuthContext } from "./Shared/Components/Context/Auth-context";
import useAuth from "./Shared/hooks/Auth-Hook";
import LoadingSpinner from "./Shared/Components/Utility/LoadingSpinner";

const Users = React.lazy(() => import("./Users/Pages/users"));
const Auth = React.lazy(() => import("./Users/Pages/Auth"));
const UpdatePlaces = React.lazy(() => import("./Places/Pages/UpdatePlace"));
const Places = React.lazy(() => import("./Places/Pages/Places"));
const NewPlace = React.lazy(() => import("./Places/Pages/NewPlace"));
function App() {
  const { token, userId, loginHandler, logoutHandler } = useAuth();
  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users></Users>
        </Route>
        <Route path="/places" exact>
          <Places></Places>
        </Route>
        <Route path="/:uid/places" exact>
          <Places></Places>
        </Route>
        <Route path="/places/new" exact>
          <NewPlace></NewPlace>
        </Route>
        <Route path="/places/:uid" exact>
          <UpdatePlaces></UpdatePlaces>
        </Route>

        <Redirect to="/"></Redirect>
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users></Users>
        </Route>
        <Route path="/:uid/places" exact>
          <Places></Places>
        </Route>
        <Route path="/places" exact>
          <Places></Places>
        </Route>
        <Route path="/auth" exact>
          <Auth></Auth>
        </Route>
        <Redirect to="/auth"></Redirect>
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        userId,
        isLoggedIn: !!token,
        logout: logoutHandler,
        login: loginHandler,
        token: token,
      }}
    >
      <BrowserRouter>
        <MainNavigation></MainNavigation>
        <main>
          <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
            {routes}
          </Suspense>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
