import React, { useState } from "react";
import AdminCreateEvent from "./AdminCreateEvent";
import AdminEventPage from "./AdminEventShow";

export default function AdminEvent() {
  const [selected, setSelected] = useState("show");

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        <div className="flex justify-center mb-6">
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="px-4 py-2 rounded border border-purple-300 focus:ring-2 focus:ring-purple-400"
          >
            <option value="create">Create Event</option>
            <option value="show">Show Events</option>
          </select>
        </div>
        {selected === "create" ? <AdminCreateEvent /> : <AdminEventPage />}
      </div>
    </div>
  );
}