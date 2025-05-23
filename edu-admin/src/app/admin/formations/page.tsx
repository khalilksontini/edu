"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/Sidebar";
import axios from "axios";

export default function FormationPage() {
  const [formations, setFormations] = useState([]);
  const [newFormation, setNewFormation] = useState({
    nom: "",
    description: "",
    departement: "",
  });
  const [editFormationId, setEditFormationId] = useState<number | null>(null);

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = () => {
    axios
      .get("http://localhost:8000/formations")
      .then((res) => setFormations(res.data.formations))
      .catch((err) => console.error("Erreur requête:", err));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewFormation({ ...newFormation, [e.target.name]: e.target.value });
  };

  const handleAddFormation = () => {
    axios
      .post("http://localhost:8000/formations", newFormation)
      .then(() => {
        setNewFormation({ nom: "", description: "", departement: "" });
        fetchFormations();
      })
      .catch((err) => console.error("Erreur ajout:", err));
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`http://localhost:8000/formations/${id}`)
      .then(fetchFormations)
      .catch((err) => console.error("Erreur suppression:", err));
  };

  const handleUpdate = (id: number) => {
    axios
      .put(`http://localhost:8000/formations/${id}`, newFormation)
      .then(() => {
        setNewFormation({ nom: "", description: "", departement: "" });
        setEditFormationId(null);
        fetchFormations();
      })
      .catch((err) => console.error("Erreur modification:", err));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Liste des Formations</h1>

        {/* Formulaire d'ajout ou modification */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {editFormationId ? "Modifier Formation" : "Ajouter une Formation"}
          </h2>
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={newFormation.nom}
            onChange={handleChange}
            className="border px-3 py-1 w-full mb-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newFormation.description}
            onChange={handleChange}
            className="border px-3 py-1 w-full mb-2 rounded"
          />
          <input
            type="text"
            name="departement"
            placeholder="Département"
            value={newFormation.departement}
            onChange={handleChange}
            className="border px-3 py-1 w-full mb-2 rounded"
          />
          <button
            onClick={() => {
              editFormationId
                ? handleUpdate(editFormationId)
                : handleAddFormation();
            }}
            className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
          >
            {editFormationId ? "Modifier" : "Ajouter"}
          </button>
          {editFormationId && (
            <button
              onClick={() => {
                setEditFormationId(null);
                setNewFormation({ nom: "", description: "", departement: "" });
              }}
              className="bg-gray-500 text-white px-4 py-1 rounded"
            >
              Annuler
            </button>
          )}
        </div>

        {/* Liste des formations */}
        <ul className="space-y-4">
          {formations.map((f: any) => (
            <li key={f.id} className="bg-white shadow p-4 rounded">
              <h2 className="text-lg font-semibold">{f.nom}</h2>
              <p className="text-gray-700 mb-1">
                <strong>Description:</strong> {f.description}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Département:</strong> {f.departement}
              </p>
              <button
                onClick={() => {
                  setEditFormationId(f.id);
                  setNewFormation({
                    nom: f.nom,
                    description: f.description,
                    departement: f.departement,
                  });
                }}
                className="bg-yellow-400 text-white px-3 py-1 rounded mr-2"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(f.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
