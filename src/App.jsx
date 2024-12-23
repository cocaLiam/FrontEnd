// App.jsx
import React, { Suspense, useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/templates/MainLayout";

// 각 페이지들
const Home      = React.lazy(() => import("./pages/Home"      ));
const Routine   = React.lazy(() => import("./pages/Routine"   ));
const My        = React.lazy(() => import("./pages/My"        ));
const AddDevice = React.lazy(() => import("./pages/AddDevice" ));
const Settings  = React.lazy(() => import("./pages/Settings"  ));
const Debug     = React.lazy(() => import("./pages/Debug"     ));
const Auth      = React.lazy(() => import("./pages/Auth"      ));

// Atoms 파일
import LoadingSpinner from './components/atoms/LoadingSpinner';

// Context 파일
import { LoadingProvider } from "./context/LoadingContext";
// import { AuthProvider } from './context/AuthContext';
import { AuthContext } from "./context/AuthContext";

// App.jsx
function App() {
  console.log("#Start APP#");
  const authStatus = useContext(AuthContext)

  useEffect(() => {
    console.log("authStatus in App.jsx:", authStatus);
  }, [authStatus]);

  let routingPages;
  if (authStatus.isLoggedIn){
    routingPages = (
      <React.Fragment>
        {/* Bottom GNB 영역 */}
        <Route path="/" element={<Home />} />
        <Route path="/Routine" element={<Routine />} />
        <Route path="/My" element={<My />} />
  
        {/* Side Bar 영역 */}
        <Route path="/AddDevice" element={<AddDevice />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/Login" element={<Auth />} />
        <Route path="/Debug" element={<Debug />} />
      </React.Fragment>
    );
  } else{
    routingPages = (
      <React.Fragment>
        {/* Bottom GNB 영역 */}
        <Route path="/" element={<Auth />} />
        <Route path="/Routine" element={<Auth />} />
        <Route path="/My" element={<Auth />} />
 
        {/* Side Bar 영역 */}
        <Route path="/AddDevice" element={<Auth />} />
        <Route path="/Settings" element={<Auth />} />
        <Route path="/Login" element={<Auth />} />
        <Route path="/Debug" element={<Debug />} />
      </React.Fragment>
    );
  }

  return (
    // <AuthContext.Provider value={{
    //   isLoggedIn: !!token,
    //   token: token,
    //   userId: userId,
    //   login: login,
    //   logout: logout
    // }}>
    // <AuthProvider>
    <LoadingProvider>  {/*Context API(전역 상태 관리) 를 써서 앱 전체에서 로딩 상태를 공유하기 위해 최상위 컴포넌트인 App을 Provider로 감싸야함*/}

      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner/>}>  {/* React.lazy 동적 컴포넌트(Pages)들이 로딩 될때 까지 fallback 함수실행 */}
          <Routes>

            <Route element={<MainLayout />}> {/* MainLayout을 부모 Route로 설정 */}
                {routingPages}
                <Route path="*" element={<Navigate to="/" />} /> {/* Routing 하는 경로 이외의 Link 는 / <- Home 으로 리다이렉팅 */}
            </Route>

          </Routes>
        </Suspense>
      </BrowserRouter>
    </LoadingProvider>

    // </AuthContext.Provider>
    // </AuthProvider>
  );
}

export default App;
