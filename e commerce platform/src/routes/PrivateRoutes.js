import React, { Component } from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import BaseLayout from "../layouts/BaseLayout";

import CartContainer from "../views/Cart/CartContainer";

var PrivateRoutes = [
  {
    path: "/fashion-cube/cart",
    layout: BaseLayout,
    component: CartContainer,
  },
];

export default PrivateRoutes;
