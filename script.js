/* =========================================================
   MEATOPIA ONLINE TICKETS
   Main JavaScript
   ========================================================= */

/*
  Generates a unique ticket ID.

  Example:
  MTP-7K4X9P2Q
*/
function generateTicketId() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 8; i++) {
    code += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return "MTP-" + code;
}


/*
  Creates the data for a new ticket.
*/
function createTicketData(name, ticketType) {
  const ticketId = generateTicketId();

  return {
    id: ticketId,
    name: name,
    type: ticketType,
    status: "VALID",
    createdAt: new Date().toISOString()
  };
}


/*
  Save a ticket in the browser.

  This is useful while we are building/testing
  the website on GitHub Pages.
*/
function saveTicket(ticket) {
  const tickets = getTickets();

  tickets.push(ticket);

  localStorage.setItem(
    "meatopiaTickets",
    JSON.stringify(tickets)
  );
}


/*
  Get all tickets stored on this device.
*/
function getTickets() {
  const saved = localStorage.getItem("meatopiaTickets");

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Could not read tickets:", error);
    return [];
  }
}


/*
  Find a ticket using its unique ID.
*/
function findTicket(ticketId) {
  const tickets = getTickets();

  return tickets.find(
    ticket =>
      ticket.id.toUpperCase() === ticketId.toUpperCase()
  );
}


/*
  Verify a ticket.
*/
function verifyTicket(ticketId) {
  const ticket = findTicket(ticketId);

  if (!ticket) {
    return {
      valid: false,
      message: "Ticket not found."
    };
  }

  if (ticket.status !== "VALID") {
    return {
      valid: false,
      message: "This ticket is not valid."
    };
  }

  return {
    valid: true,
    ticket: ticket,
    message: "Ticket is valid."
  };
}


/*
  Display ticket information on a page.
*/
function displayTicket(ticket) {
  const idElement = document.getElementById("ticketId");
  const nameElement = document.getElementById("ticketName");
  const typeElement = document.getElementById("ticketType");
  const statusElement = document.getElementById("ticketStatus");

  if (idElement) {
    idElement.textContent = ticket.id;
  }

  if (nameElement) {
    nameElement.textContent = ticket.name;
  }

  if (typeElement) {
    typeElement.textContent = ticket.type;
  }

  if (statusElement) {
    statusElement.textContent = ticket.status;
  }

  generateQRCode(ticket.id);
}


/*
  Generate a QR code for the ticket ID.

  The QR library will be connected to the page
  when we build index.html.
*/
function generateQRCode(ticketId) {
  const qrContainer = document.getElementById("qrcode");

  if (!qrContainer) {
    return;
  }

  qrContainer.innerHTML = "";

  if (typeof QRCode === "undefined") {
    console.error(
      "QR Code library has not been loaded."
    );

    qrContainer.textContent =
      "QR code library not loaded.";

    return;
  }

  new QRCode(qrContainer, {
    text: ticketId,
    width: 180,
    height: 180,
    correctLevel: QRCode.CorrectLevel.H
  });
}


/*
  Create a ticket from the admin form.
*/
function setupTicketCreation() {
  const form = document.getElementById("ticketForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput =
      document.getElementById("customerName");

    const typeInput =
      document.getElementById("ticketTypeInput");

    if (!nameInput || !typeInput) {
      return;
    }

    const name = nameInput.value.trim();
    const type = typeInput.value.trim();

    if (!name || !type) {
      alert("Please enter all ticket information.");
      return;
    }

    const ticket = createTicketData(
      name,
      type
    );

    saveTicket(ticket);

    /*
      Show the newly created ticket.
    */
    displayTicket(ticket);

    /*
      Put the ticket ID somewhere on the page
      if an element exists.
    */
    const result = document.getElementById(
      "ticketResult"
    );

    if (result) {
      result.classList.remove("hidden");
    }

    /*
      Clear the form.
    */
    form.reset();
  });
}


/*
  Ticket verification form.
*/
function setupVerification() {
  const form =
    document.getElementById("verifyForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const input =
      document.getElementById("verifyTicketId");

    const result =
      document.getElementById("verificationResult");

    if (!input || !result) {
      return;
    }

    const ticketId =
      input.value.trim();

    if (!ticketId) {
      result.className =
        "status status-warning";

      result.textContent =
        "Please enter a ticket ID.";

      return;
    }

    const verification =
      verifyTicket(ticketId);

    if (!verification.valid) {
      result.className =
        "status status-error";

      result.textContent =
        verification.message;

      return;
    }

    result.className =
      "status status-success";

    result.innerHTML =
      "✓ VALID TICKET<br>" +
      "Ticket ID: " +
      verification.ticket.id +
      "<br>" +
      "Name: " +
      verification.ticket.name;
  });
}


/*
  Display all tickets in the admin table.
*/
function displayTicketsTable() {
  const tableBody =
    document.getElementById("ticketsTableBody");

  if (!tableBody) {
    return;
  }

  const tickets = getTickets();

  tableBody.innerHTML = "";

  if (tickets.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4">
          No tickets created yet.
        </td>
      </tr>
    `;

    return;
  }

  tickets.forEach(function (ticket) {
    const row =
      document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHTML(ticket.id)}</td>
      <td>${escapeHTML(ticket.name)}</td>
      <td>${escapeHTML(ticket.type)}</td>
      <td>${escapeHTML(ticket.status)}</td>
    `;

    tableBody.appendChild(row);
  });
}


/*
  Basic protection against inserting HTML
  from ticket/customer names.
*/
function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/*
  Run the correct functions when the page loads.
*/
document.addEventListener(
  "DOMContentLoaded",
  function () {

    setupTicketCreation();

    setupVerification();

    displayTicketsTable();

  }
);
