export function checkAdmin() {
  const token = localStorage.getItem("token");
  const editBar = document.getElementById("edit-bar");
  const editBtn = document.getElementById("edit-btn");
  const loginBtn = document.getElementById("login-nav");
  const filters = document.getElementById("filters");

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
