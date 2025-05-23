import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-blue-800 text-white fixed">
      <h2 className="text-2xl font-bold p-4">Admin Panel</h2>
      <ul className="space-y-4 p-4">
        <li>
          <Link href="/admin/students">Étudiants</Link>
        </li>
        <li>
          <Link href="/admin/formations">Formations</Link>
        </li>
        <li>
          <Link href="/admin/stats">Statistiques</Link>
        </li>
      </ul>
    </div>
  );
}
