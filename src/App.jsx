import { useState, lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

// import the dashlayout
import DashboardLayout from "./layouts/DashboardLayout";
import Loader from "./components/Loader";

// lazy Loaded components to make the app run faster
const EditEmployeeForm = lazy(()=> import('./pages/dashboard/EditEmployeeForm'));
const EmployeeForm = lazy(()=>import('./pages/dashboard/EmployeeForm'));
const EmployeeList = lazy(()=>import('./pages/dashboard/EmployeeList'));


function App() {


  return (
    <>
      {/* Toaster Configuration */}
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "#4caf50",
              color: "#fff",
              fontWeight: "bold",
              padding: "12px 20px",
              borderRadius: "8px",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#4caf50",
            },
          },
          error: {
            style: {
              background: "#f44336",
              color: "#fff",
              fontWeight: "bold",
              padding: "12px 20px",
              borderRadius: "8px",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#f44336",
            },
          },
        }}
        position="top-right"
        reverseOrder={false}
      />

      {/* Routing with Lazy Loading */}
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
      {/* Dashboard Routes */}
            <Route path="/" element={<DashboardLayout/>}>
              <Route index element={<EmployeeList/>}/>
              <Route path="form" element={<EmployeeForm/>}/>
              <Route path="edit/:id" element={<EditEmployeeForm/>}/>
            </Route>

          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App
