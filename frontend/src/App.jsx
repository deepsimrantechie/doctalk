import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/LandingPage/Home";
import Collaboration from "./pages/LandingPage/Collaboration";
import Step from "./pages/LandingPage/Step";
import DoctorPage from "./pages/LandingPage/DoctorPage";
import Information from "./pages/LandingPage/Information";
import Footer from "./components/Footer";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

import DoctorsList from "./components/DoctorsList";
import DoctorsPortal from "./pages/DoctorPortal/DoctorsPortal";
import DoctorProfile from "./pages/DoctorPortal/DoctorProfile";
import BlogList from "./components/BlogList";
import DoctorBook from "./components/DoctorBook";
import PateintProfile from "./components/PateintProfile";
import PatientNum from "./pages/DoctorPortal/PatientNum";
import Blog from "./pages/DoctorPortal/Blog";
import Contact from "./components/Contact";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <Collaboration />
              <Step />
              <DoctorPage />
              <Information />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/DoctorsList" element={<DoctorsList />} />
        <Route path="/doctor-portal" element={<DoctorsPortal />} />
        <Route path="/doctor-profile/:id" element={<DoctorProfile />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/appointment/:doctorId" element={<DoctorBook />} />
        <Route path="patient-profile" element={<PateintProfile />} />
        <Route path="/patientCount" element={<PatientNum />} />
        <Route path="/bloog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        {/* 🔹 Fixed dynamic ID route */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
{
  /**  <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <Collaboration />
              <Step />
              <DoctorPage />
              <Information />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/DoctorsList" element={<DoctorsList />} />
        <Route path="/doctor-portal" element={<DoctorsPortal />} />
        <Route path="/doctor-profile/:id" element={<DoctorProfile />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/appointment/:doctorId" element={<DoctorBook />} />
        
        </Routes>
        <Footer />
      </Router>*/
}
