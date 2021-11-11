import React from "react";
import { Route } from "react-router";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const LayoutHome = (props) => {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  );
};
const HomePage = (props) => {
  return (
    <LayoutHome>
      <Route
        exact={props.exact}
        path={props.path}
        component={props.component}
      />
    </LayoutHome>
  );
};

export default HomePage;
