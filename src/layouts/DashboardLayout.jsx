import React from 'react'
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar'

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      <NavBar />

      <main className="p-4 overflow-y-auto">
        <Outlet /> {/* This renders the current nested route component */}
      </main>
    </div>
  );
}

export default DashboardLayout