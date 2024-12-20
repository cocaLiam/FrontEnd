// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/templates/MainLayout";

// // 각 페이지 컴포넌트들
import Home from "./pages/Home";
import Routine from "./pages/Routine";
import My from "./pages/My";
import AddDevice from "./pages/AddDevice";
import Settings from "./pages/Settings";
import Debug from "./pages/Debug";
import Auth from "./pages/Auth";

import { LoadingProvider } from "./context/LoadingContext";

// App.jsx
function App() {
  return (
    <LoadingProvider>  {/*Context API(전역 상태 관리) 를 써서 앱 전체에서 로딩 상태를 공유하기 위해 최상위 컴포넌트인 App을 Provider로 감싸야함*/}
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}> {/* MainLayout을 부모 Route로 설정 */}
            {/* Bottom GNB 영역 */}
            <Route path="/" element={<Home />} />
            <Route path="/Routine" element={<Routine />} />
            <Route path="/My" element={<My />} />

            {/* Side Bar 영역 */}
            <Route path="/AddDevice" element={<AddDevice />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Login" element={<Auth />} />
            <Route path="/Debug" element={<Debug />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}

export default App;
