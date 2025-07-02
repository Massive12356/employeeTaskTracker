import axiosClient from "./axiosClient";

const ENDPOINT = "/entries";

/*  gets data from db.json*/
export async function fetchEntries() {
  const { data } = await axiosClient.get(ENDPOINT);
  return data; // array
}

/*  POST  to the db.json*/
export async function createEntry(payload) {
  const { data } = await axiosClient.post(ENDPOINT, payload);
  return data; // new object with id
}

/* UPDATE to the db.json */
export async function updateEntry(id, payload) {
  const { data } = await axiosClient.put(`${ENDPOINT}/${id}`, payload);
  return data; // updated object
}

/* DELETE from the db.json */
export async function deleteEntry(id) {
  await axiosClient.delete(`${ENDPOINT}/${id}`);
  return id; // return the deleted id so UI can update
}
