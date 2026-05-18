import { getWorks } from "./api.js";
import { displayWorks } from "./gallery.js";

// Affichage des travaux dans la modal
export function displayModalGallery(works) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.style.position = "relative";

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", async () => {
      await deleteWork(work.id, works);
    });

    figure.appendChild(img);
    figure.appendChild(deleteBtn);
    modalGallery.appendChild(figure);
  });
}

// Suppression d'un travail
async function deleteWork(id, works) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const updatedWorks = await getWorks();
    displayWorks(updatedWorks);
    displayModalGallery(updatedWorks);
  } else {
    alert("Erreur lors de la suppression");
  }
}

// Ouverture et fermeture de la modal
export function setupModal(works) {
  const editBtn = document.querySelector(".edit-btn");
  const modal = document.querySelector(".modal");
  const closeModal = document.querySelector(".close-modal");
  const addWorkBtn = document.querySelector(".add-work-btn");
  const backBtn = document.querySelector(".back-btn");
  const viewGallery = document.querySelector(".modal-view-gallery");
  const viewForm = document.querySelector(".modal-view-form");

  // Ouvrir la modal au clic sur "modifier"
  editBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    displayModalGallery(works);
  });

  // Fermer la modal au clic sur la croix
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    viewGallery.style.display = "block";
    viewForm.style.display = "none";
  });

  // Fermer la modal en cliquant en dehors
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      viewGallery.style.display = "block";
      viewForm.style.display = "none";
    }
  });

  // Passer au formulaire d'ajout
  addWorkBtn.addEventListener("click", () => {
    viewGallery.style.display = "none";
    viewForm.style.display = "block";
  });

  // Retour à la galerie
  backBtn.addEventListener("click", () => {
    viewForm.style.display = "none";
    viewGallery.style.display = "block";
  });
}
