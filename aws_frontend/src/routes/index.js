import DashBoard from "../components/Dashboard";
import Document from "../components/Document";
import Item from "../components/Item";
import Login from "../components/Login";
import SignUp from "../components/Signup";
import Tables from "../components/Tables";
import Home from "../pages/HomePage/Home";

export const routeHome = [
  { exact: true, path: ["/", "/home"], component: Home },
  { exact: false, path: "/login", component: Login },
  { exact: false, path: "/signup", component: SignUp },
];
export const routeDashboard = [
  { exact: false, path: "/dashboard", component: DashBoard },
  { exact: false, path: "/tables", component: Tables },
  { exact: false, path: "/item", component: Item },
  { exact: false, path: "/document", component: Document },
];
