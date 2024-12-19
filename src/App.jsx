// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/templates/MainLayout'

// // 각 페이지 컴포넌트들
import Home from './components/pages/Home'
import Routine from './components/pages/Routine'
import My from './components/pages/My'
import Settings from './components/pages/Settings'
import Profile from './components/pages/Profile'
import Debug from './components/pages/Debug'

// App.jsx
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}> {/* MainLayout을 부모 Route로 설정 */}
          <Route path="/" element={<Home />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/my" element={<My />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/debug" element={<Debug />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
