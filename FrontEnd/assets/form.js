import { getCategories } from "./api.js";
import { displayWorks } from "./gallery.js";
import { displayModalGallery } from "./modal.js";

// Remplissage du select des catégories
export async function fillCategories() {
  const categories = await getCategories();
  const select = document.getElementById("work-category");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

// Envoi du formulaire d'ajout de photo
export function setupAddWorkForm(works) {
  const form = document.getElementById("add-work-form");
  const imageInput = document.getElementById("work-image");
  const previewImage = document.getElementById("preview-image");
  const uploadLabel = document.querySelector("#upload-zone label");

  // Prévisualisation de l'image
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        document.getElementById("upload-zone").style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });

  // Soumission du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const title = document.getElementById("work-title").value;
    const category = document.getElementById("work-category").value;
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
      works.push(newWork);
      displayWorks(works);
      displayModalGallery(works);
      // Retour à la galerie
      document.getElementById("modal-view-form").style.display = "none";
      document.getElementById("modal-view-gallery").style.display = "block";
      // Reset du formulaire
      form.reset();
      previewImage.style.display = "none";
      uploadLabel.style.display = "inline-block";
    } else {
      alert("Erreur lors de l'ajout");
    }
  });
}
