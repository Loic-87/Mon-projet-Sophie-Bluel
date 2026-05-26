import { getWorks, getCategories } from "./api.js";
import { displayWorks, displayFilters } from "./gallery.js";
import { checkAdmin } from "./admin.js";
import { setupModal } from "./modal.js";
import { fillCategories, setupAddWorkForm } from "./form.js";

async function init() {
  try {
    const works = await getWorks();
    const categories = await getCategories();
    displayWorks(works);
    displayFilters(categories, works);
    checkAdmin();
    setupModal(works);
    fillCategories();
    setupAddWorkForm(works);
  } catch (error) {
    console.error("init :", error);
  }
}

init();
