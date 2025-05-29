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
    const today = new Date();
  const startDate = new Date(today);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(2040, 11, 31);

  let savedCustomers = JSON.parse(localStorage.getItem("savedCustomers")) || {};
  let checkedCustomers =
    JSON.parse(localStorage.getItem("checkedCustomers")) || {};
  let selectedRow = null;
  let selectedDateStr = null;

  // --- Toegevoegd: Toon notificatie na reload als die in localStorage staat ---
  const notificationAfterReload = localStorage.getItem(
    "notificationAfterReload",
  );
  if (notificationAfterReload) {
    const { message, type } = JSON.parse(notificationAfterReload);
    showNotification(message, type);
    localStorage.removeItem("notificationAfterReload");
  }

  // Maand structuur
  let allMonthBoxes = [];
  let monthMap = {};

  // Helper voor weeknummer
  function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  }

  // Helper om klantinfo als string te tonen (nu met datum)
  function klantInfoString(klant, datum) {
    return `Datum: ${datum}<br>Naam: ${klant.name}, Omschrijving: ${klant.id}, Type werk: ${(klant.jobTypes || [klant.jobType]).join(", ")}, Werknemer: ${(klant.employees || [klant.employee]).join(", ")}, PDF: ${klant.pdfName || "Geen PDF"}, Hoge prioriteit: ${klant.isHighPriority ? "Ja" : "Nee"}`;
  }

  // Formulier resetten
  function resetCustomerForm() {
    document.getElementById("customer-name").value = "";
    document.getElementById("customer-id").value = "";
    document.getElementById("customer-enddate").value = "";
    document.getElementById("customer-pdf").value = "";
    // Prioriteit resetten naar "nee"
    document.getElementById("priority-no-radio").checked = true;
    document.getElementById("priority-yes-radio").checked = false;
    resetMultiselects();
  }

  // --- DAG SELECTIE EN FILTERING ---
  // Maak een lijst van alle datums van vandaag t/m einddatum
  let dateList = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = new Date(
      currentDate.getTime() - currentDate.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .split("T")[0];
    dateList.push(dateStr);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Vandaag als string
  const todayStr = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .split("T")[0];

  // Bepaal of een dag relevant is (moet getoond worden)
  function isDayRelevant(dateStr) {
    if (dateStr === todayStr) return true;
    if (dateStr > todayStr) return true;
    // Check of er nog niet-afgevinkte klanten zijn op deze dag
    const klanten = savedCustomers[dateStr] || [];
    const checked = checkedCustomers[dateStr] || [];
    // Toon als er minimaal 1 klant is die NIET is afgevinkt
    return klanten.some(
      (k) =>
        !checked.some(
          (c) =>
            c.name === k.name &&
            c.id === k.id &&
            (c.jobTypes
              ? JSON.stringify(c.jobTypes) === JSON.stringify(k.jobTypes)
              : c.jobType === k.jobType) &&
            (c.employees
              ? JSON.stringify(c.employees) === JSON.stringify(k.employees)
              : c.employee === k.employee),
        ),
    );
  }
}

// Kalender genereren (alleen relevante dagen)
  let allDateBoxes = [];
  dateList.forEach((dateStr) => {
    if (!isDayRelevant(dateStr)) return;

    const dateObj = new Date(dateStr + "T00:00:00");
    const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
    if (!monthMap[monthKey]) {
      const monthBox = document.createElement("div");
      monthBox.classList.add("month-box");
      monthBox.textContent = `${dateObj.toLocaleString("nl-NL", { month: "long", year: "numeric" })}`;
      monthBox.onclick = function () {
        document
          .querySelectorAll(`[data-month="${monthKey}"]`)
          .forEach((day) => {
            day.style.display = day.style.display === "none" ? "" : "none";
            const detailId = "details-" + day.getAttribute("data-date");
            document.getElementById(detailId)?.classList.remove("show");
            day.querySelector(".arrow").style.transform = "rotate(0deg)";
          });
      };
      dateContainer.appendChild(monthBox);
      allMonthBoxes.push(monthBox);
      monthMap[monthKey] = true;
    }

    const dateBox = document.createElement("div");
    dateBox.classList.add("date-box");

    const arrow = document.createElement("span");
    arrow.classList.add("arrow");

    const dateText = document.createElement("span");
    dateText.textContent = dateObj.toLocaleDateString("nl-NL");
    dateBox.setAttribute("data-date", dateStr);
    dateBox.setAttribute("data-month", monthKey);

    dateBox.appendChild(arrow);
    dateBox.appendChild(dateText);

    // Weeknummer toevoegen
    const weekNr = getWeekNumber(dateObj);
    const weekNrSpan = document.createElement("span");
    weekNrSpan.classList.add("weeknr");
    weekNrSpan.textContent = `Week ${weekNr}`;
    dateBox.appendChild(weekNrSpan);

    const detailId = "details-" + dateStr;

    dateBox.onclick = function () {
      toggleDetails(detailId, dateBox, arrow);
      dateContainer.scrollTop = dateBox.offsetTop - dateContainer.offsetTop;
    };

    arrow.onclick = function (event) {
      event.stopPropagation();
      toggleDetails(detailId, dateBox, arrow);
      dateContainer.scrollTop = dateBox.offsetTop - dateContainer.offsetTop;
    };

    const customerDetails = document.createElement("div");
    customerDetails.classList.add("customer-details");
    customerDetails.id = detailId;

    const table = document.createElement("table");
    table.classList.add("customer-table");

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = [
      "",
      "Naam Klant",
      "Omschrijving",
      "Type Werk",
      "Werknemer",
      "Pakbon",
      "Acties",
    ];

    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    tbody.id = `table-body-${dateStr}`;
    table.appendChild(tbody);

    customerDetails.appendChild(table);

    allDateBoxes.push({ dateBox, customerDetails, dateStr });
    dateContainer.appendChild(dateBox);
    dateContainer.appendChild(customerDetails);
  });
