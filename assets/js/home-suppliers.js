(function () {
  var trigger = document.getElementById("openSuppliersModal");
  var modal = document.getElementById("suppliersModal");
  var backdrop = document.getElementById("suppliersBackdrop");
  var closeBtn = document.getElementById("closeSuppliersModal");

  if (!trigger || !modal || !backdrop || !closeBtn) return;

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    trigger.focus();
  }

  trigger.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
})();
