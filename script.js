(function () {
  "use strict";

  var form = document.getElementById("trip-form");
  var destInput = document.getElementById("destination");
  var departInput = document.getElementById("depart");
  var returnInput = document.getElementById("return");
  var errorBox = document.getElementById("form-error");
  var button = form.querySelector(".save-btn");
  var confirmation = document.getElementById("confirmation");
  var confirmationText = document.getElementById("confirmation-text");

  // Don't let her pick a date in the past.
  var today = new Date().toISOString().split("T")[0];
  departInput.min = today;
  returnInput.min = today;

  // Live-mirror the destination into both tickets.
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
        confirmationText.textContent =
          "Mark will get your tickets to " + destInput.value.trim() + " any moment now. 💜";
        form.hidden = true;
        confirmation.hidden = false;
        confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err) {
      showError("Something went wrong sending the tickets. Please try again. (" + err.message + ")");
      button.disabled = false;
      button.classList.remove("is-sending");
    }
  });

  mirrorDestination();
})();
