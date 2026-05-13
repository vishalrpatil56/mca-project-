import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./theme.css";

// Admin
import Home from "./FRONTEND/ADMIN/Home";
import Loginpage from "./FRONTEND/ADMIN/Loginpage";
import PrivateRoute from "./PrivateRoute";
import CustomerList from "./FRONTEND/ADMIN/CustomerList";
import ComplainList from "./FRONTEND/ADMIN/ComplainList";
import FeedbackList from "./FRONTEND/ADMIN/FeedbackList";
import ServiceProviderList from "./FRONTEND/ADMIN/ServiceproviderList";
import Admindashboard from "./FRONTEND/ADMIN/Admindashboard";
import CategoryList from "./FRONTEND/ADMIN/CategoryList";
import SubcategoryList from "./FRONTEND/ADMIN/SubcategoryList";

// Service Provider
import Layout from "./FRONTEND/SERVICEPROVIDER/Layout";
import Home1 from "./FRONTEND/SERVICEPROVIDER/Home1";
import LoginPage1 from "./FRONTEND/SERVICEPROVIDER/LoginPage1";
import RegistrationPage from "./FRONTEND/SERVICEPROVIDER/RegistrationPage";
import ForgotPassword from "./FRONTEND/SERVICEPROVIDER/ForgotPassword";
import Customer from "./FRONTEND/SERVICEPROVIDER/Customer";
import Catagory from "./FRONTEND/SERVICEPROVIDER/Catagory";
import ProductOrder from "./FRONTEND/SERVICEPROVIDER/ProductOrder";
import ServiceRequest from "./FRONTEND/SERVICEPROVIDER/ServiceRequest";
import Subcatagory from "./FRONTEND/SERVICEPROVIDER/Subcatagory";
import Complain from "./FRONTEND/SERVICEPROVIDER/Complain";
import ProductDetails from "./FRONTEND/SERVICEPROVIDER/Product_details";
import SerComplain from "./FRONTEND/SERVICEPROVIDER/Sercomplain";
import SerFeedback from "./FRONTEND/SERVICEPROVIDER/Serfeedback";

// User
import CusLayout from "./FRONTEND/USER/CusLayout";
import CusHome from "./FRONTEND/USER/CusHome";
import WashingM from "./FRONTEND/USER/WashingM";
import AirCon from "./FRONTEND/USER/AirCon";
import Fridge from "./FRONTEND/USER/Frigde";
import Telivision from "./FRONTEND/USER/Telivision";
import WaterPurifier from "./FRONTEND/USER/WaterPurifier";
import CartPage from "./FRONTEND/USER/CartPage";
import CheckOut from "./FRONTEND/USER/CheckOut";
import CusLogin from "./FRONTEND/USER/CusLogin";
import UserRegistrationPage from "./FRONTEND/USER/Userregestrationpage";
import Orders from "./FRONTEND/USER/OrderPage";
import UserProductDetails from "./FRONTEND/USER/UserProductDetails";
import NotFound from "./FRONTEND/USER/NotFound";
import Cusfeedback from "./FRONTEND/USER/cusfeedback";
import Cuscomplain from "./FRONTEND/USER/cuscomplain";
import CustomerFeedbackList from "./FRONTEND/USER/FeedbackList";
import CustomerComplaintList from "./FRONTEND/USER/CompainList";

function App() {
  return (
    <>
      <Routes>
        {/* Admin routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/Adminpenal" element={<Loginpage />} />
        <Route path="/AdminDashboard" element={<PrivateRoute element={<Admindashboard />} />} />
        <Route path="/customerlist" element={<CustomerList />} />
        <Route path="/serviceproviderlist" element={<ServiceProviderList />} />
        <Route path="/categorylist" element={<CategoryList />} />
        <Route path="/subcategorylist" element={<SubcategoryList />} />
        <Route path="/complainlist" element={<ComplainList />} />
        <Route path="/feedbacklist" element={<FeedbackList />} />

        {/* Service Provider routes */}
        <Route path="/serviceproviderdash" element={<Layout />}>
          <Route index element={<Home1 />} />
          <Route path="productdetails" element={<ProductDetails />} />
          <Route path="customerorders" element={<ProductOrder />} />
          <Route path="serviceprovidercomplain" element={<SerComplain />} />
          <Route path="serviceproviderfeedback" element={<SerFeedback />} />
        </Route>
        <Route path="/loginpage" element={<LoginPage1 />} />
        <Route path="/registrationpage" element={<RegistrationPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/catagory" element={<Catagory />} />
        <Route path="/productorder" element={<ProductOrder />} />
        <Route path="/servicerequest" element={<ServiceRequest />} />
        <Route path="/subcatagory" element={<Subcatagory />} />
        <Route path="/complain" element={<Complain />} />

        {/* User routes */}
        <Route path="/" element={<CusLayout />} />
        <Route path="/product/:id" element={<UserProductDetails />} />
        <Route path="/washing" element={<WashingM />} />
        <Route path="/aircon" element={<AirCon />} />
        <Route path="/fridge" element={<Fridge />} />
        <Route path="/telivision" element={<Telivision />} />
        <Route path="/waterpurifier" element={<WaterPurifier />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/cuslogin" element={<CusLogin />} />
        <Route path="/userregister" element={<UserRegistrationPage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cusfeedback" element={<Cusfeedback />} />
        <Route path="/cuscomplain" element={<Cuscomplain />} />
        <Route path="/customerfeedbacklist" element={<CustomerFeedbackList />} />
        <Route path="/customercompaints" element={<CustomerComplaintList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
        style={{ zIndex: 99999 }}
      />
    </>
  );
}

export default App;
