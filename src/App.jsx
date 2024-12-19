// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/templates/MainLayout";

// // 각 페이지 컴포넌트들
import Home from "./components/pages/Home";
import Routine from "./components/pages/Routine";
import My from "./components/pages/My";
import Settings from "./components/pages/Settings";
import Profile from "./components/pages/Profile";
import Debug from "./components/pages/Debug";
import Auth from "./components/pages/Auth";

import { LoadingProvider } from "./context/LoadingContext";

// App.jsx
function App() {
  return (
    <LoadingProvider>  {/*Context API(전역 상태 관리) 를 써서 앱 전체에서 로딩 상태를 공유하기 위해 최상위 컴포넌트인 App을 Provider로 감싸야함*/}
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}> {/* MainLayout을 부모 Route로 설정 */}
            <Route path="/" element={<Home />} />
            <Route path="/routine" element={<Routine />} />
            <Route path="/my" element={<My />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/debug" element={<Debug />} />
            <Route path="/logout" element={<Auth />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}

export default App;
