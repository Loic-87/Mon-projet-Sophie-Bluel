import { initIndex } from "./index.js";
import { initLogin } from "./login.js";

// --- Appels API ---

async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des travaux");
    return await response.json();
  } catch (error) {
    console.error("getWorks :", error);
    return [];
  }
}

async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des catégories");
    return await response.json();
  } catch (error) {
    console.error("getCategories :", error);
    return [];
  }
}

async function deleteWork(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Erreur lors de la suppression du travail");
}

async function postWork(formData) {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw new Error("Erreur lors de l'ajout du travail");
  return await response.json();
}

async function loginUser(email, password) {
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Email ou mot de passe incorrect");
  return await response.json();
}

// --- Routage ---

async function init() {
  if (window.location.pathname.endsWith("login.html")) {
    initLogin(loginUser);
  } else {
    try {
      const [works, categories] = await Promise.all([
        getWorks(),
        getCategories(),
      ]);
      initIndex(works, categories, getWorks, deleteWork, postWork);
    } catch (error) {
      console.error("init :", error);
    }
  }
}

init();
