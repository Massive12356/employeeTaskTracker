import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Spinner from "../../components/Spinner";
import { fetchEntries, deleteEntry } from "../../api/entries";
import { useSearch } from "../../context/SearchContext";

export default function EmployeeList() {
  /* base state */
  const [entries, setEntries] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ui state */
  const [filterField, setFilterField] = useState("All"); // All | Name | Status
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const { query,setQuery } = useSearch(); // text typed in NavBar

  /* fetch on mount */
  useEffect(() => {
    fetchEntries()
      .then(setEntries)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  /* delete handlers */
  const handleDelete = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedEntry) return;
    try {
      await deleteEntry(selectedEntry.id);
      setEntries((prev) => prev.filter((e) => e.id !== selectedEntry.id));
      toast.success("Task deleted");
    } catch {
      toast.error("Could not delete");
    } finally {
      setShowModal(false);
      setSelectedEntry(null);
    }
  };

  /* combined filter logic */
  const search = query.trim().toLowerCase();
  const filteredEntries = entries.filter((e) => {
    if (!search) return true; // nothing typed

    if (filterField === "Name")
      return e.employeeName.toLowerCase().includes(search);

    if (filterField === "Status")
      return e.status.toLowerCase().includes(search);

    /* "All": match either */
    return (
      e.employeeName.toLowerCase().includes(search) ||
      e.status.toLowerCase().includes(search)
    );
  });

  /* reload on empty state */
  const reloadData = () => {
    setFilterField("All");
    setLoading(true);
    setQuery('');
    setError(null);
    fetchEntries()
      .then(setEntries)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="px-4 py-6 bg-[#F9F7F7]">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4 font-[play]">
        Employee Task Records
      </h1>
      <p className="text-[12px] md:text-[17px] text-gray-700 mb-4 font-[play]">
        You can EDIT and DELETE Task here
      </p>

      {/* header */}
      <div className="sticky top-0 z-10 bg-white p-4 shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
        {/* dropdown */}
        <select
          onChange={(e) => setFilterField(e.target.value)}
          className="border w-40 text-[12px] md:text-[16px] md:w-60 border-blue-900 text-blue-900 rounded-lg p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-[play] cursor-pointer"
        >
          <option value="All">Status or Name</option>
          <option value="Name">Name</option>
          <option value="Status">Status</option>
        </select>

        {/* count */}
        <div
          className="hidden md:flex items-center justify-center md:w-10 w-7 h-7 md:h-10 rounded-full border-2 border-blue-900 text-blue-900"
          title="Total tasks"
        >
          <p className="font-bold">{entries.length}</p>
        </div>

        {/* add button */}
        <Link to="/form">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-blue-800 hover:bg-blue-700 text-sm text-white md:text-[16px] px-4 py-2 rounded-lg font-[play] flex gap-2 cursor-pointer"
          >
            <AiOutlinePlus size={18} />
            Add Task
          </motion.button>
        </Link>
      </div>

      {/* table */}
      <motion.div className="mt-6 font-[play] min-h-[200px] relative">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Spinner message="Loading tasks..." />
          </div>
        ) : error ? (
          <p className="text-red-600 p-6">{error}</p>
        ) : filteredEntries.length === 0 ? (
          <div className="w-full flex justify-center items-center min-h-[300px] text-center text-blue-900">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
              <h2 className="text-2xl md:text-4xl font-semibold text-blue-900 mb-2">
                No results found
              </h2>
              <p className="text-md text-gray-700 mb-6">
                Sorry, we couldn’t find any tasks matching your filter.
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={reloadData}
                className="py-2 px-6 text-white bg-blue-900 rounded-lg shadow-md hover:bg-blue-800 transition-all"
              >
                Try Again
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto lg:overflow-x-visible">
            <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-2xl">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="p-4 text-left">Employee Name</th>
                  <th className="p-4 text-left">Date Of Entry</th>
                  <th className="p-4 text-left">Task Description</th>
                  <th className="p-4 text-left">Performance Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b hover:bg-blue-50 transition-all"
                  >
                    <td className="p-4 font-semibold">{task.employeeName}</td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(task.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {task.taskDescription}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          {
                            Completed: "bg-blue-100 text-blue-700",
                            "In Progress": "bg-blue-200 text-blue-800",
                            Blocked: "bg-blue-300 text-blue-900",
                            "Needs Review": "bg-blue-100 text-blue-600",
                          }[task.status]
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-3 items-center justify-center">
                      <Link to={`/edit/${task.id}`}>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="text-blue-500 hover:text-blue-800 cursor-pointer"
                        >
                          <FiEdit size={20} />
                        </motion.button>
                      </Link>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(task)}
                        className="text-red-500 hover:text-blue-800 cursor-pointer"
                      >
                        <FiTrash2 size={20} />
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* delete modal */}
      {showModal && selectedEntry && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50 p-5">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg p-6 max-w-sm w-full"
          >
            <h3 className="text-lg font-bold text-blue-900 mb-4">
              Delete Task?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-bold text-black">{selectedEntry.employeeName}</span>’s
              task?
            </p>
            <div className="flex justify-end gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-gray-300 text-blue-900 px-4 py-2 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={confirmDelete}
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
