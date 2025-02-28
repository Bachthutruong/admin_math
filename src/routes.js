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

// import
import Dashboard from "views/Dashboard/Dashboard.js";
import Tables from "views/Dashboard/Tables.js";
import Courses from "views/Dashboard/Courses.js";
import DetailCourse from "views/Dashboard/DetailCourse.js"
import RTLPage from "views/RTL/RTLPage.js";
import Profile from "views/Dashboard/Profile.js";
import SignIn from "views/Pages/SignIn.js";
import SignUp from "views/Pages/SignUp.js";

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  SupportIcon,
} from "components/Icons/Icons";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Trang chủ",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Tài liệu",
    rtlName: "لوحة القيادة",
    icon: <StatsIcon color='inherit' />,
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/course",
    name: "Video",
    rtlName: "لوحة القيادة",
    icon: <CreditIcon color='inherit' />,
    component: Courses,
    layout: "/admin",
  },
  {
    path: "/course/:id", // Route chi tiết khóa học
    name: "Chi tiết khóa học",
    rtlName: "لوحة القيادة",
    component: DetailCourse, // Component hiển thị chi tiết khóa học
    layout: "/user",
    hidden: true,
  },
  {
    name: "",
    category: "account",
    rtlName: "صفحات",
    state: "pageCollapse",
    views: [
      // {
      //   path: "/profile",
      //   name: "Profile",
      //   rtlName: "لوحة القيادة",
      //   icon: <PersonIcon color='inherit' />,
      //   secondaryNavbar: true,
      //   // hidden: true,
      //   component: Profile,
      //   layout: "/admin",
      // },
      // {
      //   path: "/signin",
      //   name: "Sign In",
      //   rtlName: "لوحة القيادة",
      //   icon: <DocumentIcon color='inherit' />,
      //   component: SignIn,
      //   layout: "/auth",
      // },
      // {
      //   path: "/signup",
      //   name: "Sign Up",
      //   rtlName: "لوحة القيادة",
      //   icon: <RocketIcon color='inherit' />,
      //   secondaryNavbar: true,
      //   component: SignUp,
      //   layout: "/auth",
      // },
    ],
  },
];
export default dashRoutes;
