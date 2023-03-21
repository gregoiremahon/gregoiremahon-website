const app = Vue.createApp({
    const darkModeToggleml: document.getElementById("dark-mode-toggle");
    const body: document.body;

    darkModeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
    });
}).mount("#app");