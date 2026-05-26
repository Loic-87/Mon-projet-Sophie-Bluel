import { getCategories } from "./api.js";
import { displayWorks } from "./gallery.js";
import { displayModalGallery, getCurrentWorks } from "./modal.js";

// Remplissage du select des catégories
export async function fillCategories() {
  try {
    const categories = await getCategories();
    const select = document.querySelector("#work-category");
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("fillCategories :", error);
  }
}

// Envoi du formulaire d'ajout de photo
export function setupAddWorkForm(works) {
  const form = document.querySelector(".add-work-form");
  const imageInput = document.querySelector("#work-image");
  const previewImage = document.querySelector(".preview-image");
  const uploadLabel = document.querySelector(".upload-zone label");

  // Prévisualisation de l'image
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérification de la taille (4mo max)
      if (file.size > 4 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 4mo");
        imageInput.value = "";
        return;
      }
      // Bouton valider en vert
      document.querySelector(
        ".add-work-form input[type='submit']",
      ).style.backgroundColor = "#1d6154";

      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        document.querySelector(".upload-zone").style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });

  // Soumission du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const title = document.querySelector("#work-title").value;
      const category = document.querySelector("#work-category").value;
      const image = imageInput.files[0];

      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", title);
      formData.append("category", category);

      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newWork = await response.json();
        const updatedWorks = getCurrentWorks();
        updatedWorks.push(newWork);
        displayWorks(updatedWorks);
        displayModalGallery(updatedWorks);
        // Retour à la galerie
        document.querySelector(".modal-view-form").style.display = "none";
        document.querySelector(".modal-view-gallery").style.display = "block";
        // Reset du formulaire
        form.reset();
        previewImage.style.display = "none";
        uploadLabel.style.display = "inline-block";
        document.querySelector(".upload-zone").style.display = "block"; // reaffiche la zone upload
        document.querySelector(
          ".add-work-form input[type='submit']",
        ).style.backgroundColor = "#888"; // remet en gris
      } else {
        alert("Erreur lors de l'ajout");
      }
    } catch (error) {
      console.error("setupAddWorkForm :", error);
      alert("Une erreur est survenue lors de l'ajout de la photo");
    }
  });
}
