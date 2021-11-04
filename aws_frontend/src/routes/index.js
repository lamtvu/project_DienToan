import DashBoard from "../components/Dashboard";
import Login from "../components/Login";
import SignUp from "../components/Signup";
import Home from "../pages/HomePage/Home";

export const routeHome = [
  { exact: true, path: ["/", "/home"], component: Home },
  { exact: false, path: "/login", component: Login },
  { exact: false, path: "/signup", component: SignUp },
  { exact: false, path: "/dashboard", component: DashBoard },
];
