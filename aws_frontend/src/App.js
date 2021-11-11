import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { routeDashboard, routeHome } from "./routes";
import Error from "./pages/Error";
import Home from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
const showLayoutHome = (routes) => {
  if (routes && routes.length > 0) {
    return routes.map((item, index) => {
      return (
        <Home
          key={index}
          exact={item.exact}
          path={item.path}
          component={item.component}
        />
      );
    });
  }
};
const showLayoutDashboard = (routes) => {
  if (routes && routes.length > 0) {
    return routes.map((item, index) => {
      return (
        <DashboardPage
          key={index}
          exact={item.exact}
          path={item.path}
          component={item.component}
        />
      );
    });
  }
};
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          {showLayoutHome(routeHome)}

          {showLayoutDashboard(routeDashboard)}
          {/* Không tìm ra trang nào */}
          <Route path="" component={Error} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
