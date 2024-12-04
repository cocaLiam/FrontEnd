import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

// import Users        from './user/pages/Users';
// import UserPlaces   from './places/pages/UserPlaces';
// import NewPlace     from './places/pages/NewPlace';
// import UpdatePlace  from './places/pages/UpdatePlace';
// import Auth         from './user/pages/Auth';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';


const Users = React.lazy(() => import('./user/pages/Users'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Auth = React.lazy(() => import('./user/pages/Auth'));





// function App() {
//   return <h1>Let's start!</h1>;
// }

const App = () => {
  console.log("#Start APP#");
  const { userId, token, login, logout } = useAuth();

  let routes;

  // if (token) {
  //   /** 로그인 중일 때 */
  //   routes = (
  //     <Switch>
  //       <Route path="/" exact={true}>
  //         <Users />
  //       </Route>
  //       <Route path="/:userId/places" exact>
  //         <UserPlaces />
  //       </Route>
  //       <Route path="/places/new" exact>
  //         <NewPlace />
  //       </Route>
  //       {/* <Route path="/places/new" element={<NewPlace />} /> */}
  //       {/* /places/new 링크에서 new가 placeId로 인식되기 때문에
  //       /places/new 와 /places/:placeId 둘다 렌더링 된다.
  //       이를 해결 하기 위해서는 <Switch>태그를 사용해 조건에 부합하는
  //       하나의링크만 렌더링 되게끔 해야 한다. */}
  //       <Route path="/places/:placeId">
  //         <UpdatePlace />
  //       </Route>
  //       {/* 위에 정의된 경로 외에 경로는 전부 '/'로 향하게 한다. */}
  //       <Redirect to="/" />
  //     </Switch>
  //   );
  // } else {
  //   /** 로그인 중이 아닐 때 */
  //   routes = (
  //     <Switch>
  //       <Route path="/" exact={true}>
  //         <Users />
  //       </Route>
  //       <Route path="/:userId/places" exact>
  //         <UserPlaces />
  //       </Route>
  //       <Route path="/auth">
  //         <Auth />
  //       </Route>
  //       <Redirect to="/auth" />
  //     </Switch>
  //   );
  // }

  
  if (token) {
    /** 로그인 중일 때 */
    routes = (
      <Switch>
        <Route path="/" exact={true}>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        {/* <Route path="/places/new" element={<NewPlace />} /> */}
        {/* /places/new 링크에서 new가 placeId로 인식되기 때문에
        /places/new 와 /places/:placeId 둘다 렌더링 된다.
        이를 해결 하기 위해서는 <Switch>태그를 사용해 조건에 부합하는
        하나의링크만 렌더링 되게끔 해야 한다. */}
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        {/* 위에 정의된 경로 외에 경로는 전부 '/'로 향하게 한다. */}
        <Redirect to="/" />
      </Switch>
    );
  } else {
    /** 로그인 중이 아닐 때 */
    routes = (
      <Switch>
        <Route path="/" exact={true}>
          <Users />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth"/>
      </Switch>
    );
  }

  // return <h1>Let's start!</h1>;
  return (
    <AuthContext.Provider value={{
      isLoggedIn: !!token,
      token: token,
      userId: userId,
      login: login,
      logout: logout
    }}>
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }>
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
