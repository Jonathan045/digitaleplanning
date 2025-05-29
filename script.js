// Multiselect dropdown openen/sluiten
window.toggleCheckboxList = function (id) {
  // Sluit eerst alle andere open dropdowns
  document.querySelectorAll(".checkbox-list").forEach((list) => {
    if (list.id !== id) list.style.display = "none";
  });
  const el = document.getElementById(id);
  el.style.display = el.style.display === "none" ? "block" : "none";

  // Sluit dropdown als je buiten klikt
  function handler(e) {
    if (!el.contains(e.target) && !e.target.closest(".selectBox")) {
      el.style.display = "none";
      document.removeEventListener("click", handler);
    }
  }
  setTimeout(() => document.addEventListener("click", handler), 0);
};

window.onload = function () {
  const dateContainer = document.getElementById("date-container");
  const addCustomerBtn = document.getElementById("add-customer-btn");
  const customerForm = document.getElementById("customer-form");
  const saveCustomerBtn = document.getElementById("save-customer");
  const closeFormBtn = document.getElementById("close-form");
  const searchButton = document.getElementById("search-button");
  const searchDateInput = document.getElementById("search-date");
  const searchNameInput = document.getElementById("search-name");
  const searchNameButton = document.getElementById("search-name-button");
  const searchWeekInput = document.getElementById("search-week");
  const searchWeekButton = document.getElementById("search-week-button");
  const searchEmployeeInput = document.getElementById("search-employee");
  const searchEmployeeButton = document.getElementById(
    "search-employee-button",
  );

  const actionsModal = document.getElementById("actions-modal");
  const actionEdit = document.getElementById("action-edit");
  const actionDelete = document.getElementById("action-delete");
  const cancelActions = document.getElementById("cancel-actions");

  const deleteModal = document.getElementById("delete-modal");
  const deleteMessage = document.getElementById("delete-message");
  const confirmDeleteBtn = document.getElementById("confirm-delete");
  const cancelDeleteBtn = document.getElementById("cancel-delete");

};
