let currentWorks = [];

// --- Galerie ---

function displayWorks(works) {
  try {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    works.forEach((work) => {
      const figure = document.createElement("figure");
      const img = Object.assign(document.createElement("img"), {
        src: work.imageUrl,
        alt: work.title,
      });
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
    filters.innerHTML = "";

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

    const img = Object.assign(document.createElement("img"), {
      src: work.imageUrl,
      alt: work.title,
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => handleDelete(work.id));

    figure.append(img, deleteBtn);
    modalGallery.appendChild(figure);
  });
}

function setupModal(works, getWorksFn, deleteWorkFn, postWorkFn) {
  currentWorks = works;

  const modal = document.querySelector(".modal");
  const viewGallery = document.querySelector(".modal-view-gallery");
  const viewForm = document.querySelector(".modal-view-form");

  // Fermeture de la modal
  function closeModal() {
    modal.style.display = "none";
    viewGallery.style.display = "block";
    viewForm.style.display = "none";
  }

  // Suppression d'un travail
  async function handleDelete(workId) {
    try {
      await deleteWorkFn(workId);
      currentWorks = await getWorksFn();
      displayWorks(currentWorks);
      displayModalGallery(currentWorks, handleDelete);
    } catch (error) {
      console.error("deleteWork :", error);
      alert("Erreur lors de la suppression");
    }
  }

  document.querySelector(".edit-btn").addEventListener("click", () => {
    modal.style.display = "flex";
    displayModalGallery(currentWorks, handleDelete);
  });

  document.querySelector(".close-modal").addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.querySelector(".add-work-btn").addEventListener("click", () => {
    viewGallery.style.display = "none";
    viewForm.style.display = "block";
  });

  document.querySelector(".back-btn").addEventListener("click", () => {
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
      const option = Object.assign(document.createElement("option"), {
        value: category.id,
        textContent: category.name,
      });
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
  const uploadZone = document.querySelector(".upload-zone");
  const submitBtn = document.querySelector(
    ".add-work-form input[type='submit']",
  );

  // Vérifie si les conditions sont remplies pour activer le bouton
  function checkFormValid() {
    const titleValue = document.querySelector("#work-title").value.trim();
    submitBtn.style.backgroundColor =
      titleValue && imageInput.files[0] ? "#1d6154" : "#888";
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
        previewImage.style.display = "block";
        uploadZone.style.display = "none";
      };
      reader.readAsDataURL(selectedFile);
    }
    checkFormValid();
  });

  // Vérification du titre en temps réel
  document
    .querySelector("#work-title")
    .addEventListener("input", checkFormValid);

  // Soumission du formulaire
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", imageInput.files[0]);
      formData.append("title", document.querySelector("#work-title").value);
      formData.append(
        "category",
        document.querySelector("#work-category").value,
      );

      const newWork = await postWorkFn(formData);
      currentWorks.push(newWork);
      displayWorks(currentWorks);
      displayModalGallery(currentWorks, handleDelete);

      document.querySelector(".modal-view-form").style.display = "none";
      document.querySelector(".modal-view-gallery").style.display = "block";
      form.reset();
      previewImage.style.display = "none";
      uploadLabel.style.display = "inline-block";
      uploadZone.style.display = "block";
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
