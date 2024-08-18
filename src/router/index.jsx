import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "../pages/Welcome";
import RootLayout from "../layouts/RootLayout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path="welcome" element={<Welcome />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
