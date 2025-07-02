import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  fetchEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} from "../api/entries";

export default function useEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* -------- initial load -------- */
  useEffect(() => {
    fetchEntries()
      .then(setEntries)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  /* -------- CRUD actions -------- */
  const addEntry = useCallback(async (data) => {
    try {
      const created = await createEntry(data);
      setEntries((prev) => [...prev, created]);
      toast.success("Entry added");
    } catch (e) {
      toast.error("Could not add entry");
      throw e;
    }
  }, []);

  const editEntry = useCallback(async (data) => {
    try {
      const updated = await updateEntry(data.id, data);
      setEntries((prev) =>
        prev.map((e) => (e.id === updated.id ? updated : e))
      );
      toast.success("Entry updated");
    } catch (e) {
      toast.error("Could not update entry");
      throw e;
    }
  }, []);

  const removeEntry = useCallback(async (id) => {
    try {
      await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Entry deleted");
    } catch (e) {
      toast.error("Could not delete entry");
      throw e;
    }
  }, []);

  return { entries, loading, error, addEntry, editEntry, removeEntry };
}
