import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiX, FiArrowLeft } from "react-icons/fi";
import { MdPostAdd } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { fetchEntries, updateEntry } from "../../api/entries"; // <-- NEW

export default function EditEmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);


  const [form, setForm] = useState({
    employeeName: "",
    date: "",
    taskDescription: "",
    status: "Completed",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  
  useEffect(() => {
    fetchEntries()
      .then((all) => {
        const entry = all.find((e) => String(e.id) === id);
        if (!entry) throw new Error("Task not found");
        setForm(entry);
      })
      .catch((e) => {
        toast.error(e.message);
        navigate("/"); // fallback
      })
      .finally(() => setInitializing(false));
  }, [id, navigate]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateEntry(id, form);
      toast.success("Task updated");
      navigate("/");
    } catch {
      toast.error("Could not update");
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9F7F7]">
        <p className="text-blue-900 font-semibold">Loading task...</p>
      </div>
    );
  }

  
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", stiffness: 100, damping: 25 }}
      className="p-5 md:p-10 bg-[#F9F7F7] min-h-screen font-[play]"
    >
      <Link to="/">
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="flex w-full justify-end mb-5"
        >
          <button className="text-blue-800 hover:text-blue-700 flex items-center gap-2">
            <FiArrowLeft size={24} />
            <span className="hidden md:inline">Back</span>
          </button>
        </motion.div>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <MdPostAdd size={30} className="text-blue-500" />
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
          Update Record
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 space-y-6"
      >
        <div>
          <label className="block text-[#777186] font-semibold mb-1">
            Full Name
          </label>
          <input
            name="employeeName"
            value={form.employeeName}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full border rounded-lg px-4 py-2 placeholder-[#777186] focus:outline-none focus:ring-1 ring-gray-300"
          />
        </div>

        <div>
          <label className="block text-[#777186] font-semibold mb-1">
            Date of Entry
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 ring-gray-300"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[#777186] font-semibold mb-1">
            Task Description
          </label>
          <textarea
            name="taskDescription"
            value={form.taskDescription}
            onChange={handleChange}
            placeholder="Describe the task in detail"
            className="w-full border rounded-lg px-4 py-2 h-28 resize-none placeholder-[#777186] focus:outline-none focus:ring-1 ring-gray-300"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-[#777186] font-semibold mb-1">
            Performance Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 text-[#777186] focus:outline-none focus:ring-1 ring-gray-300"
          >
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Needs Review">Needs Review</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse md:flex-row justify-end gap-4 mt-6">
          <Link to="/">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              className="flex items-center gap-2 bg-red-300 text-[#9d0505] py-2 px-20 md:px-7 md:py-2 rounded-lg font-semibold"
            >
              <FiX size={18} />
              Cancel
            </motion.button>
          </Link>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-7 py-2 rounded-lg font-semibold ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <AiOutlinePlus size={18} />
                Update Record
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
