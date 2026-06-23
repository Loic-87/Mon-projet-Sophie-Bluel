import { loginUser } from "./api.js";

// --- Login ---

function initLogin() {
  const form = document.querySelector(".login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } catch (error) {
      console.error("login :", error);
      const errorMessage = document.querySelector(".error-message");
      errorMessage.textContent = "Email ou mot de passe incorrect";
      errorMessage.classList.add("visible");
    }
  });
}

initLogin();
