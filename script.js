const take = (selector) => document.querySelector(selector); // * Helper function to select elements

// * Selecting elements
const input = take("input");
const valdata = take("input#value");

const britto = take(".britto");
const output = take(".ol");
const button = take(".btn");
const result = take(".result");

// * User data for OTP verification
const users = {
  121: "Your_Brain;",
  122: "Mohan",
  133: "Md",
  144: "Sk",
  111: "user",
};

// * Event listener for when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  let otpVerified = false; // * OTP verification flag
  let verifiedUser = null; // * Verified user
  let totalValda = parseFloat(localStorage.getItem("totalValda")) || 0; // * Total value from local storage

  input.addEventListener("focus", handleFocus); // * Add focus event listener to input

  function handleFocus() {
    if (!otpVerified) {
      var otp = prompt("Enter the OTP (3 digits):"); // * Prompt for OTP

      if (otp && users.hasOwnProperty(otp)) {
        swal({
          title: "Good job!",
          text: "OTP verified successfully!",
          type: "success",
          timer: 1700,
          confirmButtonText: "Ok",
        }); // * OTP verification success alert
        otpVerified = true; // * Set OTP verified flag
        verifiedUser = users[otp]; // * Set verified user
        input.disabled = false; // * Enable input
        input.focus(); // * Focus on input
      } else {
        swal({
          title: "Oops!",
          text: "OTP is invalid!",
          type: "error",
          timer: 1700,
          confirmButtonText: "Ok",
        }); // * OTP verification failure alert
        input.blur(); // * Remove focus from input
      }
    }
  }

  loadItems(); // * Load items from local storage

  function loadItems() {
    let items = JSON.parse(localStorage.getItem("listItems")) || []; // * Get items from local storage
    output.innerHTML = ""; // * Clear output
    totalValda = 0; // * Reset total value

    items.reverse().forEach((item) => {
      let li = createListItem(item); // * Create list item
      output.appendChild(li); // * Append list item to output

      if (!item.includes("removed")) {
        let valdaValue = extractValdaValue(item); // * Extract value
        totalValda += valdaValue; // * Add value to total
      } else {
        li.classList.add("red-on-hover"); // * Add red hover class
      }
    });

    localStorage.setItem("totalValda", totalValda); // * Save updated total value to local storage
    console.log("Initial Total Valda:", totalValda); // * Log initial total value
  }

  britto.addEventListener("click", handleClick); // * Add click event listener to britto
  input.addEventListener("keypress", function (event) {
    if (event.key === "Tab") {
      valdata.focus(); // * Focus on valdata input when Tab is pressed
    }
  });

  document.addEventListener("keypress", function (event) {
    if (input.value !== "" && valdata.value !== "") {
      if (event.key === "Enter") {
        handleClick(); // * Handle click when Enter is pressed
        input.focus(); // * Focus on input
      }
    }
  });

  function handleClick() {
    let data = input.value.trim(); // * Get and trim input value
    let valdaValue = parseFloat(valdata.value.trim()); // * Get and parse valdata value

    if (data !== "" && !isNaN(valdaValue)) {
      if (otpVerified) {
        let currentDateTime = new Date().toLocaleString(); // * Get current date and time
        let cross = `<i id="cross" class="fa-solid fa-xmark" onclick="removeItem(this)"></i>`; // * Cross icon for removing item
        let listItemContent = `Things: ${data}  Rs: ${valdaValue} (${currentDateTime} - ${verifiedUser}) - ${cross}`; // * List item content

        let li = createListItem(listItemContent); // * Create list item
        li.classList.add("green-on-hover"); // * Add green hover class
        output.insertBefore(li, output.firstChild); // * Add item to the beginning of the list

        totalValda += valdaValue; // * Add value to total

        input.value = ""; // * Clear input
        valdata.value = ""; // * Clear valdata input

        saveItems(); // * Save items to local storage
        updateTotalValda(); // * Update total value
      } else {
        swal({
          title: "Oops!",
          text: "Please verify OTP first.",
          type: "error",
          timer: 1700,
          confirmButtonText: "Ok",
        }); // * OTP not verified alert
      }
    } else {
      swal({
        title: "Oops!",
        text: "Invalid input",
        type: "error",
        timer: 1700,
        confirmButtonText: "Ok",
      }); // * Invalid input alert
    }
  }

  button.addEventListener("click", handleClear); // * Add click event listener to button

  function handleClear() {
    output.innerHTML = ""; // * Clear output
    localStorage.removeItem("listItems"); // * Remove items from local storage

    totalValda = 0; // * Reset total value
    updateTotalValda(); // * Update total value
    saveItems(); // * Save items to local storage
  }

  function createListItem(content) {
    let li = document.createElement("li"); // * Create list item element
    li.classList.add("li"); // * Add class to list item
    li.innerHTML = `${content}`; // * Set list item content
    return li; // * Return list item
  }

  function saveItems() {
    let items = Array.from(output.children).map((item) => item.innerHTML); // * Get list item contents
    localStorage.setItem("listItems", JSON.stringify(items.reverse())); // * Save items to local storage
  }

  window.removeItem = function (element) {
    if (!otpVerified) {
      swal({
        title: "Oops!",
        text: "Please verify OTP first.",
        type: "error",
        timer: 1700,
        confirmButtonText: "Ok",
      }); // * OTP not verified alert
      return otp;
    }

    let removedItemContent = element.parentNode.textContent.trim(); // * Get removed item content
    let removeValda = extractValdaValue(removedItemContent); // * Extract value from removed item

    let currentDateTime = new Date().toLocaleString(); // * Get current date and time
    let removedLog = `${verifiedUser} removed: ${removedItemContent}`; // * Removed item log

    let li = createListItem(removedLog); // * Create list item
    output.insertBefore(li, output.firstChild); // * Add removed item log to the beginning of the list

    totalValda -= removeValda; // * Subtract value from total
    console.log(`Updated Total Valda: ${totalValda}`); // * Log updated total value

    element.parentNode.remove(); // * Remove item from list

    saveItems(); // * Save items to local storage
    updateTotalValda(); // * Update total value
  };

  function extractValdaValue(itemContent) {
    let match = itemContent.match(/Rs: (\d+(\.\d+)?)/); // * Extract value using regex
    return match ? parseFloat(match[1]) : 0; // * Return value or 0
  }

  function updateTotalValda() {
    localStorage.setItem("totalValda", totalValda); // * Save updated total value to local storage
    console.log("Updated Total Valda:", totalValda); // * Log updated total value
  }

  result.addEventListener("click", function () {
    result.innerText = ""; // * Clear result text
    result.classList.toggle("large"); // * Toggle large class
    if (result.classList.contains("large")) {
      button.style.display = "block"; // * Show button
    } else {
      button.style.display = "none"; // * Hide button
    }
    setInterval(() => {
      if (result.classList.contains("large")) {
        result.innerText = totalValda; // * Update result text with total value
      } else {
        result.innerText = ""; // * Clear result text
      }
    }, 1000);
  });
});

document.addEventListener("contextmenu", (event) => event.preventDefault()); // * Prevent default context menu
