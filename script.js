document.addEventListener("DOMContentLoaded", function () {

  alert("MEATOPIA JAVASCRIPT IS WORKING");

  const form = document.getElementById("ticketForm");

  if (!form) {
    alert("ERROR: ticketForm was not found");
    return;
  }

  alert("MEATOPIA FORM FOUND");

  form.addEventListener("submit", function (event) {

    event.preventDefault();

    alert("GENERATE BUTTON WORKS");

    const name =
      document.getElementById("customerName").value;

    const type =
      document.getElementById("ticketTypeInput").value;

    if (!name) {
      alert("Please enter a name");
      return;
    }

    if (!type) {
      alert("Please select a ticket type");
      return;
    }

    const ticketId =
      "MTP-" +
      Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

    document.getElementById("ticketName").textContent =
      name;

    document.getElementById("ticketType").textContent =
      type;

    document.getElementById("ticketId").textContent =
      ticketId;

    document.getElementById("ticketStatus").textContent =
      "VALID";

    const result =
      document.getElementById("ticketResult");

    result.classList.remove("hidden");

    result.scrollIntoView({
      behavior: "smooth"
    });

    const qr =
      document.getElementById("qrcode");

    qr.innerHTML = "";

    if (typeof QRCode !== "undefined") {

      new QRCode(qr, {
        text: ticketId,
        width: 180,
        height: 180
      });

    } else {

      qr.innerHTML =
        "<p>QR library not loaded.</p>";

    }

  });

});
