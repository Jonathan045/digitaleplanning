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
// Multiselect helpers
  function getSelectedJobTypes() {
    return Array.from(
      document.querySelectorAll(
        '#jobtype-options input[type="checkbox"]:checked',
      ),
    ).map((cb) => cb.value);
  }
  function getSelectedEmployees() {
    return Array.from(
      document.querySelectorAll(
        '#employee-options input[type="checkbox"]:checked',
      ),
    ).map((cb) => cb.value);
  }
  // Reset multiselects
  function resetMultiselects() {
    document
      .querySelectorAll('#jobtype-options input[type="checkbox"]')
      .forEach((cb) => (cb.checked = false));
    document
      .querySelectorAll('#employee-options input[type="checkbox"]')
      .forEach((cb) => (cb.checked = false));
    document.getElementById("jobtype-selected-text").textContent =
      "Selecteer type werk";
    document.getElementById("employee-selected-text").textContent =
      "Selecteer werknemer";
  }
  // Zet multiselects bij edit
  function setMultiselectValues(jobTypes, employees) {
    document
      .querySelectorAll('#jobtype-options input[type="checkbox"]')
      .forEach((cb) => {
        cb.checked = jobTypes.includes(cb.value);
      });
    document
      .querySelectorAll('#employee-options input[type="checkbox"]')
      .forEach((cb) => {
        cb.checked = employees.includes(cb.value);
      });
    document.getElementById("jobtype-selected-text").textContent =
      jobTypes.length ? jobTypes.join(", ") : "Selecteer type werk";
    document.getElementById("employee-selected-text").textContent =
      employees.length ? employees.join(", ") : "Selecteer werknemer";
  }

  // Multiselect dropdowns: update geselecteerde tekst
  document
    .querySelectorAll('#jobtype-options input[type="checkbox"]')
    .forEach((cb) => {
      cb.addEventListener("change", function () {
        const selected = getSelectedJobTypes();
        document.getElementById("jobtype-selected-text").textContent =
          selected.length ? selected.join(", ") : "Selecteer type werk";
      });
    });
  document
    .querySelectorAll('#employee-options input[type="checkbox"]')
    .forEach((cb) => {
      cb.addEventListener("change", function () {
        const selected = getSelectedEmployees();
        document.getElementById("employee-selected-text").textContent =
          selected.length ? selected.join(", ") : "Selecteer werknemer";
      });
    });