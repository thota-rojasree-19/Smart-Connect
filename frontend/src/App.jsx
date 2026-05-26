// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import Home from "./pages/Home";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import ProfileSettings from "./pages/ProfileSettings";
// import ChatMessaging from "./pages/ChatMessaging";
// import GroupChats from "./pages/GroupChats";
// import GroupChat from "./pages/GroupChat";
// function App() {
//   const location = useLocation();

//   // Paths where Navbar and Footer should NOT appear
//   const hideLayoutPaths = ["/dashboard", "/login", "/signup", "/profile-settings", "/chat"];

//   const hideLayout = hideLayoutPaths.includes(location.pathname);

//   return (
//     <>
//       {!hideLayout && <Navbar />}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/profile-settings" element={<ProfileSettings />} />
//         <Route path="/chat" element={<ChatMessaging />} />
//         <Route path="/groups" element={<GroupChats />} />
//         <Route path="/group/:id" element={<GroupChat />} />
//       </Routes>
//       {!hideLayout && <Footer />}
//     </>
//   );
// }

// // Wrap App in Router here
// export default function AppWrapper() {
//   return (
//     <Router>
//       <App />
//     </Router>
//   );
// }



import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProfileSettings from "./pages/ProfileSettings";
import ChatMessaging from "./pages/ChatMessaging";
import GroupChats from "./pages/GroupChats";
import GroupChat from "./pages/GroupChat";
<<<<<<< HEAD
import SmartReplies from "./pages/SmartReplies";
=======
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203

function App() {
  const location = useLocation();

  // Paths where Navbar and Footer should NOT appear
  const hideLayoutPaths = [
    "/dashboard",
    "/login",
    "/signup",
    "/profile-settings",
    "/chat",
    "/groups",          // ✅ hide for group list
<<<<<<< HEAD
    "/smart-replies",
=======
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
  ];

  // Check for dynamic group chat route (e.g., /group/123)
  const hideLayout =
    hideLayoutPaths.includes(location.pathname) ||
    location.pathname.startsWith("/group/"); // ✅ hide for individual group chats

  return (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/chat" element={<ChatMessaging />} />
<<<<<<< HEAD
        <Route path="/smart-replies" element={<SmartReplies />} />
=======
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
        <Route path="/groups" element={<GroupChats />} />
        <Route path="/group/:id" element={<GroupChat />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

// Wrap App in Router here
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
