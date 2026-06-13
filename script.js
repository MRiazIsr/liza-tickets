(function () {
  "use strict";

  var STORAGE_KEY = "liza-trip-v1";

  var form = document.getElementById("trip-form");
  var destInput = document.getElementById("destination");
  var departInput = document.getElementById("depart");
  var returnInput = document.getElementById("return");
  var errorBox = document.getElementById("form-error");
  var button = form.querySelector(".save-btn");
  var lockNote = document.getElementById("lock-note");
  var lockSummary = document.getElementById("lock-summary");
  var editBtn = document.getElementById("edit-btn");
  var inputs = [destInput, departInput, returnInput];

  // Don't let her pick a date in the past.
  var today = new Date().toISOString().split("T")[0];
  departInput.min = today;
  returnInput.min = today;

  // ---- persistence ----
  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          destination: destInput.value.trim(),
          depart: departInput.value,
          return: returnInput.value,
          locked: true,
        })
      );
    } catch (e) {
      /* storage unavailable (private mode) — locking just won't persist */
    }
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function clearLock() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
  }

  // ---- live destination mirroring ----
  function mirrorDestination() {
    var value = destInput.value.trim();
    var city = value || "Anywhere";
    var code = value ? value.slice(0, 3).toUpperCase() : "•••";
    document.querySelectorAll("[data-dest-city]").forEach(function (el) {
      el.textContent = city;
    });
    document.querySelectorAll("[data-dest-code]").forEach(function (el) {
      el.textContent = code;
    });
  }
  destInput.addEventListener("input", mirrorDestination);

  // Keep the return date at or after departure.
  departInput.addEventListener("change", function () {
    returnInput.min = departInput.value || today;
    if (returnInput.value && returnInput.value < departInput.value) {
      returnInput.value = departInput.value;
    }
  });

  // ---- lock / unlock UI ----
  function prettyDate(iso) {
    if (!iso) return "";
    var parts = iso.split("-"); // YYYY-MM-DD
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return parseInt(parts[2], 10) + " " + months[parseInt(parts[1], 10) - 1] + " " + parts[0];
  }

  function applyLock() {
    form.classList.add("is-locked");
    inputs.forEach(function (el) {
      el.disabled = true;
    });
    button.hidden = true;
    errorBox.textContent = "";
    lockSummary.textContent =
      "Tel Aviv → " + (destInput.value.trim() || "—") +
      " · " + prettyDate(departInput.value) + " – " + prettyDate(returnInput.value);
    lockNote.hidden = false;
  }

  function unlock() {
    form.classList.remove("is-locked");
    inputs.forEach(function (el) {
      el.disabled = false;
    });
    button.hidden = false;
    lockNote.hidden = true;
    destInput.focus();
  }

  editBtn.addEventListener("click", function () {
    clearLock();
    unlock();
  });

  // ---- validation + submit ----
  function showError(message) {
    errorBox.textContent = message;
  }

  function validate() {
    if (!destInput.value.trim()) return "Please tell me where we're going. ✈️";
    if (!departInput.value) return "Pick a departure date.";
    if (!returnInput.value) return "Pick a return date.";
    if (returnInput.value < departInput.value) return "Return can't be before departure.";
    return null;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    showError("");

    var problem = validate();
    if (problem) {
      showError(problem);
      return;
    }

    button.disabled = true;
    button.classList.add("is-sending");

    var data = Object.fromEntries(new FormData(form).entries());

    try {
      var response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      var result = await response.json();

      if (result.success) {
        saveState();
        applyLock();
        lockNote.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err) {
      showError("Something went wrong sending the tickets. Please try again. (" + err.message + ")");
    } finally {
      button.disabled = false;
      button.classList.remove("is-sending");
    }
  });

  // ---- init: restore a previously saved + locked trip ----
  var saved = loadState();
  if (saved && saved.locked) {
    destInput.value = saved.destination || "";
    departInput.value = saved.depart || "";
    returnInput.value = saved.return || "";
    applyLock();
  }

  mirrorDestination();
})();
