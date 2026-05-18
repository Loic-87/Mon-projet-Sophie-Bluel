export function checkAdmin() {
  const token = localStorage.getItem("token");
  const editBar = document.querySelector(".edit-bar");
  const editBtn = document.querySelector(".edit-btn");
  const loginBtn = document.querySelector(".login-nav");
  const filters = document.querySelector(".filters");

  if (token) {
    editBar.style.display = "block";
    editBtn.style.display = "block";
    filters.style.display = "none";
    if (loginBtn) {
      loginBtn.textContent = "logout";
      loginBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
      });
    }
  }
}
