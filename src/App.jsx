import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Navbar } from "./components/Navbar";
import { Service } from "./pages/Service";
import { Error } from "./pages/Error";
import { Logout } from "./pages/Logout";
import Posts from "./pages/posts";
import PostDetail from "./components/PostDetail";
import PostForm from "./components/PostForm";
import EditPost from "./components/EditPost";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/service" element={<Service />} />
          <Route path="/posts" Component={Posts} exact />
          <Route path="/posts/:id" Component={PostDetail} exact />
          <Route path="*" element={<Error />} />
          <Route path="/create-post" element={<PostForm />} />
          <Route path="/posts/:id/edit" element={<EditPost />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
