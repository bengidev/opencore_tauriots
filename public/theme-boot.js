(function () {
  var mode = "light";
  try {
    var raw = localStorage.getItem("opencore-tauriots-preferences");
    if (raw) {
      var prefs = JSON.parse(raw);
      if (prefs.theme_mode === "dark" || prefs.theme_mode === "light") {
        mode = prefs.theme_mode;
      }
    }
  } catch (_error) {
    // Ignore invalid persisted preferences; fall back to default theme.
  }
  document.documentElement.dataset.theme = mode;
  document.documentElement.classList.toggle("dark", mode === "dark");
  document.documentElement.style.colorScheme = mode;
})();
