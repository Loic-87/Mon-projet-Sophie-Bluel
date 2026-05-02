// Récupération des travaux depuis l'API
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  return works;
}

// Récupération des catégories depuis l'API
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  return categories;
}

// Affichage des travaux dans la galerie
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// Affichage des filtres par catégorie
function displayFilters(categories, works) {
  const filters = document.getElementById("filters");
  filters.innerHTML = "";

  // Bouton "Tous"
  const allBtn = document.createElement("li");
  allBtn.textContent = "Tous";
  allBtn.classList.add("active-filter");
  allBtn.addEventListener("click", () => {
    displayWorks(works);
    document
      .querySelectorAll("#filters li")
      .forEach((li) => li.classList.remove("active-filter"));
    allBtn.classList.add("active-filter");
  });
  filters.appendChild(allBtn);

  // Boutons par catégorie
  categories.forEach((category) => {
    const li = document.createElement("li");
    li.textContent = category.name;
    li.addEventListener("click", () => {
      const filteredWorks = works.filter((w) => w.categoryId === category.id);
      displayWorks(filteredWorks);
      document
        .querySelectorAll("#filters li")
        .forEach((el) => el.classList.remove("active-filter"));
      li.classList.add("active-filter");
    });
    filters.appendChild(li);
  });
}

// Vérification du mode administrateur
function checkAdmin() {
  const token = localStorage.getItem("token");
  const editBar = document.getElementById("edit-bar");
  const editBtn = document.getElementById("edit-btn");
  const loginBtn = document.getElementById("login-nav");

  if (token) {
    editBar.style.display = "block";
    editBtn.style.display = "block";
    if (loginBtn) loginBtn.textContent = "logout";
    loginBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
  }
}

// Initialisation
async function init() {
  const works = await getWorks();
  const categories = await getCategories();
  displayWorks(works);
  displayFilters(categories, works);
  checkAdmin();
  setupModal(works);
  fillCategories();
  setupAddWorkForm(works);
}

init();

// Affichage des travaux dans la modal
function displayModalGallery(works) {
  const modalGallery = document.getElementById("modal-gallery");
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
      await deleteWork(work.id);
    });

    figure.appendChild(img);
    figure.appendChild(deleteBtn);
    modalGallery.appendChild(figure);
  });
}

// Suppression d'un travail
async function deleteWork(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const works = await getWorks();
    displayWorks(works);
    displayModalGallery(works);
  } else {
    alert("Erreur lors de la suppression");
  }
}

// Ouverture et fermeture de la modal
function setupModal(works) {
  const editBtn = document.getElementById("edit-btn");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("close-modal");
  const addWorkBtn = document.getElementById("add-work-btn");
  const backBtn = document.getElementById("back-btn");
  const viewGallery = document.getElementById("modal-view-gallery");
  const viewForm = document.getElementById("modal-view-form");

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

// Remplissage du select des catégories
async function fillCategories() {
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
function setupAddWorkForm(works) {
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
        uploadLabel.style.display = "none";
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
