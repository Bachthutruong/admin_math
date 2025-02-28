/*!

=========================================================
* Toán Thầy Tài Chakra - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-chakra
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-chakra/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import RTLLayout from "layouts/RTL.js";

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path={`/auth`} component={AuthLayout} />
      <Route path={`/admin`} component={AdminLayout} />
      <Route path={`/rtl`} component={RTLLayout} />
      <Navigate from={`/`} to='/admin/dashboard' />
    </Routes>
  </HashRouter>,
  document.getElementById("root")
);
