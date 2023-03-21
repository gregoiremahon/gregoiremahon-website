const app = Vue.createApp({
    const darkModeToggle: document.getElementById("dark-mode-toggle");
    const body: document.body;

    darkModeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
    });
}).mount("#app");