// Get works from API
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  return works;
}

// Get categories from API
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  return categories;
}

// Display works in gallery
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

// Display filters
function displayFilters(categories, works) {
  const filters = document.getElementById("filters");
  filters.innerHTML = "";

  // "All" button
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

  // Category buttons
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

// Init
async function init() {
  const works = await getWorks();
  const categories = await getCategories();
  displayWorks(works);
  displayFilters(categories, works);
}

init();
