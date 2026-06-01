let currentWorks = [];

// --- Galerie ---

function displayWorks(works) {
  try {
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
  } catch (error) {
    console.error("displayWorks :", error);
  }
}

function displayFilters(categories, works) {
  try {
    const filters = document.querySelector(".filters");
    filters.innerHTML = "";

    const allBtn = document.createElement("li");
    allBtn.textContent = "Tous";
    allBtn.classList.add("active-filter");
    allBtn.addEventListener("click", () => {
      displayWorks(works);
      document
        .querySelectorAll(".filters li")
        .forEach((li) => li.classList.remove("active-filter"));
      allBtn.classList.add("active-filter");
    });
    filters.appendChild(allBtn);

    categories.forEach((category) => {
      const li = document.createElement("li");
      li.textContent = category.name;
      li.addEventListener("click", () => {
        const filteredWorks = works.filter((w) => w.categoryId === category.id);
        displayWorks(filteredWorks);
        document
          .querySelectorAll(".filters li")
          .forEach((el) => el.classList.remove("active-filter"));
        li.classList.add("active-filter");
      });
      filters.appendChild(li);
    });
  } catch (error) {
    console.error("displayFilters :", error);
  }
}

// --- Admin ---

function checkAdmin() {
  try {
    const token = localStorage.getItem("token");
    const editBar = document.querySelector(".edit-bar");
    const editBtn = document.querySelector(".edit-btn");
    const loginBtn = document.querySelector(".login-nav");
    const filters = document.querySelector(".filters");

    if (token) {
      editBar.style.display = "block";
      editBtn.style.display = "block";
      filters.style.display = "none";
      document.querySelector("header").style.paddingTop = "0";
      if (loginBtn) {
        loginBtn.textContent = "logout";
        loginBtn.addEventListener("click", () => {
          localStorage.removeItem("token");
          window.location.href = "index.html";
        });
      }
    }
  } catch (error) {
    console.error("checkAdmin :", error);
  }
}

// --- Modal ---

function displayModalGallery(works, handleDelete) {
  currentWorks = works;
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
    deleteBtn.addEventListener("click", () => handleDelete(work.id));

    figure.appendChild(img);
    figure.appendChild(deleteBtn);
    modalGallery.appendChild(figure);
  });
}

function setupModal(works, getWorksFn, deleteWorkFn, postWorkFn) {
  currentWorks = works;

  const editBtn = document.querySelector(".edit-btn");
  const modal = document.querySelector(".modal");
  const closeModal = document.querySelector(".close-modal");
  const addWorkBtn = document.querySelector(".add-work-btn");
  const backBtn = document.querySelector(".back-btn");
  const viewGallery = document.querySelector(".modal-view-gallery");
  const viewForm = document.querySelector(".modal-view-form");

  async function handleDelete(id) {
    try {
      await deleteWorkFn(id);
      const updatedWorks = await getWorksFn();
      currentWorks = updatedWorks;
      displayWorks(updatedWorks);
      displayModalGallery(updatedWorks, handleDelete);
    } catch (error) {
      console.error("deleteWork :", error);
      alert("Erreur lors de la suppression");
    }
  }

  editBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    displayModalGallery(currentWorks, handleDelete);
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    viewGallery.style.display = "block";
    viewForm.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      viewGallery.style.display = "block";
      viewForm.style.display = "none";
    }
  });

  addWorkBtn.addEventListener("click", () => {
    viewGallery.style.display = "none";
    viewForm.style.display = "block";
  });

  backBtn.addEventListener("click", () => {
    viewForm.style.display = "none";
    viewGallery.style.display = "block";
  });
  setupAddWorkForm(getWorksFn, postWorkFn, handleDelete);
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

function setupAddWorkForm(getWorksFn, postWorkFn, handleDelete) {
  const form = document.querySelector(".add-work-form");
  const imageInput = document.querySelector("#work-image");
  const previewImage = document.querySelector(".preview-image");
  const uploadLabel = document.querySelector(".upload-zone label");
  const submitBtn = document.querySelector(
    ".add-work-form input[type='submit']",
  );

  // Vérifie si les conditions sont remplies pour activer le bouton
  function checkFormValid() {
    const title = document.querySelector("#work-title").value.trim();
    const image = imageInput.files[0];
    submitBtn.style.backgroundColor = title && image ? "#1d6154" : "#888";
  }

  // Prévisualisation de l'image
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 4mo");
        imageInput.value = "";
        checkFormValid();
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        document.querySelector(".upload-zone").style.display = "none";
      };
      reader.readAsDataURL(file);
    }
    checkFormValid();
  });

  // Vérification du titre en temps réel
  document
    .querySelector("#work-title")
    .addEventListener("input", checkFormValid);

  // Soumission du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const title = document.querySelector("#work-title").value;
      const category = document.querySelector("#work-category").value;
      const image = imageInput.files[0];

      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", title);
      formData.append("category", category);

      const newWork = await postWorkFn(formData);
      currentWorks.push(newWork);
      displayWorks(currentWorks);
      displayModalGallery(currentWorks, handleDelete);

      document.querySelector(".modal-view-form").style.display = "none";
      document.querySelector(".modal-view-gallery").style.display = "block";
      form.reset();
      previewImage.style.display = "none";
      uploadLabel.style.display = "inline-block";
      document.querySelector(".upload-zone").style.display = "block";
      checkFormValid();
    } catch (error) {
      console.error("setupAddWorkForm :", error);
      alert("Une erreur est survenue lors de l'ajout de la photo");
    }
  });
}

// --- Init ---

export function initIndex(
  works,
  categories,
  getWorksFn,
  deleteWorkFn,
  postWorkFn,
) {
  currentWorks = works;
  displayWorks(works);
  displayFilters(categories, works);
  checkAdmin();
  fillCategories(categories);
  setupModal(works, getWorksFn, deleteWorkFn, postWorkFn);
}
