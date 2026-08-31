(function () {
  var stored = localStorage.getItem("opencore-tauriots-theme");
  var mode =
    stored === "light" || stored === "dark" ? stored : "dark";
  document.documentElement.dataset.theme = mode;
  document.documentElement.classList.toggle("dark", mode === "dark");
  document.documentElement.style.colorScheme = mode;
})();
