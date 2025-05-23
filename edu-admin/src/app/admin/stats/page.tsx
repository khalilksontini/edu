"use client";

import { api } from "@/app/api";
import Sidebar from "@/app/Sidebar";
import { useEffect, useState } from "react";

type StatsType = {
  total_users: number;
  total_formations: number;
  total_books_recommandes: number;
  users_per_department: { departement: string | null; count: number }[];
  top_formations?: { formation: string; inscriptions: number }[];
};

export default function StatsPage() {
  const [stats, setStats] = useState<StatsType | null>(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Chargement...</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Statistiques</h1>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded">
            Nombre d'étudiants : {stats.total_users}
          </div>
          <div className="bg-blue-100 p-4 rounded">
            Nombre de formations : {stats.total_formations}
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            Nombre de livres recommandés : {stats.total_books_recommandes}
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">
          Utilisateurs par département
        </h2>
        <ul className="mb-6">
          {(stats.users_per_department ?? []).map((dept, index) => (
            <li key={index}>
              {dept.departement && dept.departement.trim() !== ""
                ? dept.departement
                : "(non spécifié)"}{" "}
              : {dept.count}
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-2">
          Formations les plus suivies
        </h2>
        {stats.top_formations && stats.top_formations.length > 0 ? (
          <ul>
            {stats.top_formations.map((f) => (
              <li key={f.formation}>
                {f.formation} ({f.inscriptions} inscriptions)
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune donnée disponible.</p>
        )}
      </div>
    </div>
  );
}
