// src/components/NavBar.jsx
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function NavBar() {
  const [currentTime, setCurrentTime] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const location = useLocation();

  /* ---------- clock updater ---------- */
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatted = now.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(formatted);
    };
    updateClock();
    const id = setInterval(updateClock, 60_000); // update every minute
    return () => clearInterval(id);
  }, []);

  /* ---------- search bar JSX ---------- */
  const SearchBar = (
    <div className="flex items-center bg-[#EAE8E8] px-3 py-1 rounded-md w-full md:w-80">
      <FiSearch className="text-[#283144] text-lg mr-2" />
      <input
        type="text"
        placeholder="Search by Staff Name or Status"
        className="bg-transparent text-[#283144] w-full placeholder-gray-600 focus:outline-none text-sm sm:text-base"
      />
    </div>
  );

  return (
    <nav className="w-full bg-gray-100 text-white shadow-md">
      {/* main row */}
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-2">
        {/* BRAND / CLOCK */}
        <div className="flex items-center gap-3">
          {/* Simple brand derived from route pathname */}
          <h2 className="text-2xl  text-black capitalize font-extrabold tracking-wide">
            task<span className="text-blue-600">Tracker</span>
          </h2>

          {/* Live clock (always visible) */}
          <span className="text-xs text-black md:block hidden sm:text-sm opacity-80">{currentTime}</span>
        </div>

        {/* DESKTOP SEARCH (≥ md) */}
        <div className="hidden md:block">{SearchBar}</div>

        {/* MOBILE SEARCH ICON (≤ md) */}
        <button
          className="md:hidden  text-gray-600 p-2 rounded-full hover:bg-white/20 transition"
          onClick={() => setMobileSearchOpen((prev) => !prev)}
        >
          <FiSearch className="text-xl" />
        </button>
      </div>

      {/* MOBILE SEARCH BAR (animated drop‑down) */}
      <AnimatePresence initial={false}>
        {mobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden px-4 pb-3"
          >
            {SearchBar}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
