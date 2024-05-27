import { Route, Routes, BrowserRouter } from "react-router-dom";
import LayoutPage from "./components/layout/Layout";
import "./style/Global.css";
import routes from "./Routes/routes";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUp from "./pages/auth/signup/SignUp";
import { ToastContainer } from "react-toastify";
import AppProvider from "./components/Context/context";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        {/* <LayoutPage /> */}
        <div className="App">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route element={<LayoutPage />}>
              {routes.map(({ path, component: Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
            </Route>
          </Routes>
          <ToastContainer position="top-right"></ToastContainer>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
