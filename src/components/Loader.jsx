// src/components/Loader.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/* Variants for parent container */
const overlay = {
  initial: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};

/* Variants for the inner brand block */
const brand = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 90, damping: 12 },
  },
};

export default function Loader({ show = true }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          variants={overlay}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div
            variants={brand}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center gap-4"
          >
            {/* Spinning ring */}
            <motion.div
              className="h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 1.1,
              }}
            />

            {/* Branded text */}
            <h2 className="text-2xl font-extrabold tracking-wide">
              task<span className="text-blue-600">Tracker</span>
            </h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
