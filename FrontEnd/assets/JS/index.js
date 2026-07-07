import { getWorks, getCategories, deleteWork, postWork } from "./api.js";

// --- Galerie ---

function displayWorks(works) {
  try {
    const gallery = document.querySelector(".gallery");
    gallery.replaceChildren();
    works.forEach((work) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = work.title;
      figure.append(img, figcaption);
      gallery.appendChild(figure);
    });
  } catch (error) {
    console.error("displayWorks :", error);
  }
}

function displayFilters(categories, works) {
  try {
    const filters = document.querySelector(".filters");
    filters.replaceChildren();

    // Bouton "Tous"
    const allBtn = document.createElement("li");
    allBtn.textContent = "Tous";
    allBtn.classList.add("active-filter");
    allBtn.addEventListener("click", () => {
      displayWorks(works);
      filters
        .querySelectorAll("li")
        .forEach((filterItem) => filterItem.classList.remove("active-filter"));
      allBtn.classList.add("active-filter");
    });
    filters.appendChild(allBtn);

    // Boutons par catégorie
    categories.forEach((category) => {
      const categoryBtn = document.createElement("li");
      categoryBtn.textContent = category.name;
      categoryBtn.addEventListener("click", () => {
        displayWorks(works.filter((work) => work.categoryId === category.id));
        filters
          .querySelectorAll("li")
          .forEach((filterItem) =>
            filterItem.classList.remove("active-filter"),
          );
        categoryBtn.classList.add("active-filter");
      });
      filters.appendChild(categoryBtn);
    });
  } catch (error) {
    console.error("displayFilters :", error);
  }
}

// --- Admin ---

function checkAdmin() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const editBar = document.querySelector(".edit-bar");
    const editBtn = document.querySelector(".edit-btn");
    const loginBtn = document.querySelector(".login-nav");
    const filters = document.querySelector(".filters");
    const header = document.querySelector("header");

    editBar.classList.add("visible");
    editBtn.classList.add("visible");
    filters.classList.add("hidden");
    header.classList.add("admin");

    if (loginBtn) {
      loginBtn.textContent = "logout";
      loginBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
      });
    }
  } catch (error) {
    console.error("checkAdmin :", error);
  }
}

// --- Modal ---

// Crée une carte projet dans la galerie de la modal
function createWorkCard(work, handleDelete) {
  const figure = document.createElement("figure");

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-trash-can");
  deleteBtn.appendChild(icon);
  deleteBtn.addEventListener("click", () => handleDelete(work.id));

  figure.append(img, deleteBtn);
  return figure;
}

function displayModalGallery(works, handleDelete) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.replaceChildren();
  works.forEach((work) => {
    modalGallery.appendChild(createWorkCard(work, handleDelete));
  });
}

function setupModal(works, deleteWorkFn, postWorkFn) {
  const modal = document.querySelector(".modal");
  const viewGallery = document.querySelector(".modal-view-gallery");
  const viewForm = document.querySelector(".modal-view-form");
  const editBtn = document.querySelector(".edit-btn");
  const closeModalBtn = document.querySelector(".close-modal");
  const addWorkBtn = document.querySelector(".add-work-btn");
  const backBtn = document.querySelector(".back-btn");

  // Fermeture de la modal
  function closeModal() {
    modal.classList.remove("open");
    viewGallery.classList.remove("hidden");
    viewForm.classList.remove("open");
  }

  // Suppression d'un travail
  async function handleDelete(workId) {
    try {
      await deleteWorkFn(workId);
      const index = works.findIndex((work) => work.id === workId);
      if (index !== -1) works.splice(index, 1);
      displayWorks(works);
      displayModalGallery(works, handleDelete);
    } catch (error) {
      console.error("deleteWork :", error);
      alert("Erreur lors de la suppression");
    }
  }

  editBtn.addEventListener("click", () => {
    modal.classList.add("open");
    displayModalGallery(works, handleDelete);
  });

  closeModalBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  addWorkBtn.addEventListener("click", () => {
    viewGallery.classList.add("hidden");
    viewForm.classList.add("open");
  });

  backBtn.addEventListener("click", () => {
    viewForm.classList.remove("open");
    viewGallery.classList.remove("hidden");
  });

  setupAddWorkForm(works, postWorkFn, handleDelete);
}

// --- Formulaire ajout ---

function fillCategories(categories) {
  try {
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

// Réinitialise le formulaire après un ajout réussi
function resetForm(form, previewImage, uploadZone, submitBtn) {
  const modalViewForm = document.querySelector(".modal-view-form");
  const modalViewGallery = document.querySelector(".modal-view-gallery");

  form.reset();
  previewImage.classList.remove("visible");
  uploadZone.classList.remove("hidden");
  submitBtn.classList.remove("active");
  modalViewForm.classList.remove("open");
  modalViewGallery.classList.remove("hidden");
}

function setupAddWorkForm(works, postWorkFn, handleDelete) {
  const form = document.querySelector(".add-work-form");
  const imageInput = document.querySelector("#work-image");
  const previewImage = document.querySelector(".preview-image");
  const uploadZone = document.querySelector(".upload-zone");
  const submitBtn = document.querySelector(
    ".add-work-form input[type='submit']",
  );
  const titleInput = document.querySelector("#work-title");
  const categoryInput = document.querySelector("#work-category");

  // Vérifie si les conditions sont remplies pour activer le bouton
  function checkFormValid() {
    if (titleInput.value.trim() && imageInput.files[0]) {
      submitBtn.classList.add("active");
    } else {
      submitBtn.classList.remove("active");
    }
  }

  // Prévisualisation de l'image
  imageInput.addEventListener("change", (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 4mo");
        imageInput.value = "";
        checkFormValid();
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        previewImage.src = event.target.result;
        previewImage.classList.add("visible");
        uploadZone.classList.add("hidden");
      };
      reader.readAsDataURL(selectedFile);
    }
    checkFormValid();
  });

  // Vérification du titre en temps réel
  titleInput.addEventListener("input", checkFormValid);

  // Soumission du formulaire
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", imageInput.files[0]);
      formData.append("title", titleInput.value);
      formData.append("category", categoryInput.value);

      const newWork = await postWorkFn(formData);
      works.push(newWork);
      displayWorks(works);
      displayModalGallery(works, handleDelete);
      resetForm(form, previewImage, uploadZone, submitBtn);
    } catch (error) {
      console.error("setupAddWorkForm :", error);
      alert("Une erreur est survenue lors de l'ajout de la photo");
    }
  });
}

// --- Init ---

async function initIndex() {
  try {
    const [works, categories] = await Promise.all([
      getWorks(),
      getCategories(),
    ]);
    displayWorks(works);
    displayFilters(categories, works);
    checkAdmin();
    fillCategories(categories);
    setupModal(works, deleteWork, postWork);
  } catch (error) {
    console.error("initIndex :", error);
  }
}

initIndex();
