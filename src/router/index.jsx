import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "../pages/Auth/Welcome";
import RootLayout from "../layouts/RootLayout";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import Home from "../pages/Home";
import Content from "../pages/Content/Content";
import GuideBookCreateFinallyStep from "../pages/Guide/GuideBookCreateFinallyStep";
import BookMark from "../pages/BookMark/BookMark";
import BookMarkSelect from "../pages/BookMark/BookMarkSelect";
import MyGuideBooks from "../pages/Guide/MyGuideBooks";
import MyGuideBookDetail from "../pages/Guide/MyGuideBookDetail";
import GuideBookCreate from "../pages/Guide/GuideBookCreate";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="welcome" element={<Welcome />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="contents">
            <Route path=":id" element={<Content />} />
          </Route>
          <Route path="guidebook">
            <Route path="create/first-step" element={<GuideBookCreate />} />
            <Route path="create/first-step" element={<GuideBookCreate />} />
            <Route path="create/finally-step" element={<GuideBookCreateFinallyStep />} />
            <Route path="select" element={<BookMarkSelect />} />
          </Route>
          <Route path="myGuideBooks">
            <Route index element={<MyGuideBooks />} />
            <Route path=":id" element={<MyGuideBookDetail />} />
          </Route>
          <Route path="bookmark">
            <Route index element={<BookMark />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
