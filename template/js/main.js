const app = Vue.createApp({
    data() {
      return {
        isDarkModeOn: false
      }
    },
    methods: {
      toggleDarkMode() {
        this.isDarkModeOn = !this.isDarkModeOn;
        document.body.classList.toggle('dark-mode');
      }
    },
    computed: {
      themeClasses() {
        return {
          'bg-light': !this.isDarkModeOn,
          'bg-dark': this.isDarkModeOn,
          'text-dark': !this.isDarkModeOn,
          'text-light': this.isDarkModeOn
        }
      }
    },
  
  });
  
app.mount('#app');
  
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  darkModeToggle.addEventListener('click', () => {
    console.log(this.isDarkModeOn);
    vm.toggleDarkMode();
    document.body.classList.toggle('dark-mode');
  });
