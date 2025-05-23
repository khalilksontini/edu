// app/admin/students/page.tsx
"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/app/Sidebar";
import { api } from "@/app/api";

export default function StudentPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api
      .get("http://127.0.0.1:8000/users")
      .then((res) => setStudents(res.data.users));
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Liste des Étudiants</h1>
        <h1 className="text-2xl font-bold mb-4">
          Liste des Étudiants{" "}
          <span className="text-blue-600">({students.length})</span>
        </h1>

        <ul className="space-y-2">
          {students.map((s: any) => (
            <li key={s.id} className="bg-white shadow p-4 rounded">
              {s.name} ({s.email})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
