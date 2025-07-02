import React from 'react'
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar'
import { SearchProvider } from '../context/SearchContext';

const DashboardLayout = () => {
  return (
    <div className="flex-col h-screen">
      <SearchProvider>
        <div className="sticky top-0 z-50 ">
          <NavBar />
        </div>
        <main className="p-4 overflow-y-auto">
          <Outlet /> {/* This renders the current nested route component */}
        </main>
      </SearchProvider>
    </div>
  );
}

export default DashboardLayout