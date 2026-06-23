// --- Appels API ---

export async function getWorks() {
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

export async function getCategories() {
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

export async function deleteWork(id) {
  const token = localStorage.getItem("token");

  // Vérifie si le token est présent
  if (!token) {
    throw new Error("Vous devez être connecté pour effectuer cette action");
  }

  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Gère le token expiré ou invalide
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "login.html";
    throw new Error("Session expirée, veuillez vous reconnecter");
  }

  if (!response.ok) throw new Error("Erreur lors de la suppression du travail");
}

export async function postWork(formData) {
  const token = localStorage.getItem("token");

  // Vérifie si le token est présent
  if (!token) {
    throw new Error("Vous devez être connecté pour effectuer cette action");
  }

  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  // Gère le token expiré ou invalide
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "login.html";
    throw new Error("Session expirée, veuillez vous reconnecter");
  }

  if (!response.ok) throw new Error("Erreur lors de l'ajout du travail");
  return await response.json();
}

export async function loginUser(email, password) {
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Email ou mot de passe incorrect");
  return await response.json();
}
