export function initLogin(loginUserFn) {
  const form = document.querySelector(".login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;
      const data = await loginUserFn(email, password);
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } catch (error) {
      console.error("login :", error);
      alert("Email ou mot de passe incorrect");
    }
  });
}
