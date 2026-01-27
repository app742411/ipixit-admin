import { BrowserRouter as Router, Routes, Route, Navigate, } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgetPassword from "./pages/AuthPages/ForgetPassword";
import OtpVerificationPage from "./pages/AuthPages/OtpVerification";
import ChangePasswordPage from "./pages/AuthPages/ChangePassword";
import CategoryManage from "./pages/Category/CategoryManage";
import ItemManagement from "./pages/Items/ItemManagement";

import UserListManage from "./pages/Users/UserListManage";
import UserDetails from "./pages/Users/UserDetails-edit";
import SellerItemDetails from "./pages/Items/UserItemDetails";
import ItemDetails from "./pages/Items/ItemDetails";
import ChangePassword from "./components/auth/LoginChangePassword";
import CommissionManage from "./pages/Commission/CommissionManage";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />

        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              {/* Others Page */}
              <Route path="/password-change" element={<ChangePassword />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />

              {/* User Management */}
              <Route path="/users" element={<UserListManage />} />
              <Route path="/users/:id" element={<UserDetails />} />
              <Route path="/seller-items/:id" element={<SellerItemDetails />} />

              {/*  Category Management */}
              <Route
                path="/category-management"
                element={<CategoryManage />}
              />

              {/* Item Management */}
              <Route path="/items-management" element={<ItemManagement />} />
              <Route path="/items-management/:id" element={<ItemDetails />} />

              {/* Commission Management */}
              <Route path="/commission-management" element={<CommissionManage />} />


              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* UI Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          </Route>


          <Route
            path="/signin"
            element={
              (localStorage.getItem("token") ||
                sessionStorage.getItem("token")) ? (
                <Navigate to="/" replace />
              ) : (
                <SignIn />
              )
            }
          />

          <Route path="/reset-password" element={<ForgetPassword />} />
          <Route path="/otp-verification" element={<OtpVerificationPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />



          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

    </>
  );
}
