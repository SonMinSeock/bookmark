import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "../pages/Welcome";
import RootLayout from "../layouts/RootLayout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import Guide from "../pages/Guide";
import GuideCreate from "../pages/GuideCreate";
import GuideTitle from "../pages/GuideTitle";
import GuideFinally from "../pages/GuideFinally";
import BookMark from "../pages/BookMark";
import BookMarkSelect from "../pages/BookMarkSelect";
import MyGuideBooks from "../pages/MyGuideBooks";
import MyGuideBookDetail from "../pages/MyGuideBookDetail";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="welcome" element={<Welcome />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="guide">
            <Route path=":id" element={<Guide />} />
            <Route path="create" element={<GuideCreate />} />
            <Route path="title" element={<GuideTitle />} />
            <Route path="finally" element={<GuideFinally />} />
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
