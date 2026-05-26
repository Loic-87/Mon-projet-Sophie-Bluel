// Récupération des travaux depuis l'API
export async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des travaux");
    const works = await response.json();
    return works;
  } catch (error) {
    console.error("getWorks :", error);
    return [];
  }
}

// Récupération des catégories depuis l'API
export async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des catégories");
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("getCategories :", error);
    return [];
  }
}
