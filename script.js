
const take = (selector) => document.querySelector(selector);

const input = take("input");
const valdata = take("input#value");
const check = take(".lol");
const output = take(".ol");
const button = take(".btn");
const result = take(".result");

const users = {
  121: "Your_Brain;",
  122: "Mohan",
  133: "Md",
  144: "Sk",
};

document.addEventListener("DOMContentLoaded", function () {
  let otpVerified = false;
  let verifiedUser = null;
  let totalValda = parseFloat(localStorage.getItem("totalValda")) || 0;

  input.addEventListener("focus", handleFocus);

  function handleFocus() {
    if (!otpVerified) {
      let otp = prompt("Enter the OTP (3 digits):");

      if (otp && users.hasOwnProperty(otp)) {
        alert("OTP verified!");
        otpVerified = true;
        verifiedUser = users[otp];
        input.disabled = false;
        input.focus();
      } else {
        alert("Invalid OTP. Please try again.");
        input.blur();
      }
    }
  }

  loadItems();

  function loadItems() {
    let items = JSON.parse(localStorage.getItem("listItems")) || [];
    output.innerHTML = "";
    totalValda = 0;

    items.reverse().forEach((item) => {
      let li = createListItem(item);
      output.appendChild(li);

      if (!item.includes("removed")) {
        let valdaValue = extractValdaValue(item);
        totalValda += valdaValue;
      }
    });

    // Save the updated totalValda to local storage
    localStorage.setItem("totalValda", totalValda);

    // Log initial totalValda
    console.log("Initial Total Valda:", totalValda);
  }

  check.addEventListener("click", handleClick);

  function handleClick() {
    let data = input.value.trim();
    let valdaValue = parseFloat(valdata.value.trim());

    if (data !== "" && !isNaN(valdaValue)) {
      if (otpVerified) {
        let currentDateTime = new Date().toLocaleString();
        let cross = `<i id="cross" class="fa-solid fa-xmark" onclick="removeItem(this)"></i>`;
        let listItemContent = `Things: ${data}  Rs: ${valdaValue} (${currentDateTime} - ${verifiedUser}) - ${cross}`;

        let li = createListItem(listItemContent);
        output.insertBefore(li, output.firstChild);

        totalValda += valdaValue;

        input.value = "";
        valdata.value = "";

        saveItems();
        updateTotalValda(); // Update totalValda after adding item
      } else {
        alert("Please verify OTP first.");
      }
    } else {
      alert("Input fields are empty or invalid.");
    }
  }

  button.addEventListener("click", handleClear);

  function handleClear() {
    output.innerHTML = "";
    localStorage.removeItem("listItems");
    totalValda = 0;
    updateTotalValda(); // Update totalValda after clearing items
    saveItems();
  }

  function createListItem(content) {
    let li = document.createElement("li");
    li.innerHTML = `${content}`;
    return li;
  }

  function saveItems() {
    let items = Array.from(output.children).map((item) => item.innerHTML);
    localStorage.setItem("listItems", JSON.stringify(items.reverse()));
  }

  window.removeItem = function (element) {
    if (!otpVerified) {
      alert("Please verify OTP first.");
      return;
    }

    let removedItemContent = element.parentNode.textContent.trim();
    let removeValda = extractValdaValue(removedItemContent);

    let currentDateTime = new Date().toLocaleString();
    let removedLog = `${verifiedUser} removed: ${removedItemContent}`;

    let li = createListItem(removedLog);
    output.insertBefore(li, output.firstChild);

    totalValda -= removeValda;
    console.log(`Updated Total Valda: ${totalValda}`);

    element.parentNode.remove();

    saveItems();
    updateTotalValda(); // Update totalValda after removing item
  };

  function extractValdaValue(itemContent) {
    let match = itemContent.match(/Rs: (\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }

  function updateTotalValda() {
    // Save the updated totalValda to local storage
    localStorage.setItem("totalValda", totalValda);
    console.log("Updated Total Valda:", totalValda);
    }

  result.addEventListener("click", function () {
      result.classList.toggle("large");
      if (result.classList.contains("large")) {
          result.innerText = totalValda; // Fix typo: innerText instead of innertext

      } else {
          result.innerText = "";
      }
  });



});
