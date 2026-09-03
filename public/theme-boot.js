(function () {
  // Default theme until React loads authoritative preferences from the Rust store.
  var mode = "dark";
  document.documentElement.dataset.theme = mode;
  document.documentElement.classList.toggle("dark", mode === "dark");
  document.documentElement.style.colorScheme = mode;
})();
