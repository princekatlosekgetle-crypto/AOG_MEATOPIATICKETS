(function () {
  "use strict";

  const STORAGE_KEY = "meatopia_tickets";

  const TICKET_TYPES = {
    "Early Bird": {
      price: 80,
      limit: 50
    },

    "Standard": {
      price: 100,
      limit: 150
    },

    "Children": {
      price: 50,
      limit: 50
    },

    "Group": {
      price: 500,
      limit: 20
    }
  };


  // Get saved tickets
  function getTickets() {

    try {

      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return [];
      }

      return JSON.parse(saved);

    } catch (error) {

      console.error(
        "Could not load tickets:",
        error
      );

      return [];

    }
  }


  // Save tickets
  function saveTickets(tickets) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tickets)
    );

  }


  // Generate unique Ticket ID
  function generateTicketId() {

    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let id = "MTP-";

    for (let i = 0; i < 8; i++) {

      id += characters.charAt(
        Math.floor(
          Math.random() *
          characters.length
        )
      );

    }

    return id;

  }


  // Check how many tickets of a type exist
  function countTickets(type) {

    return getTickets().filter(
      function (ticket) {
        return ticket.type === type;
      }
    ).length;

  }


  // Create ticket
  function createTicket(name, type) {

    if (!TICKET_TYPES[type]) {

      alert(
        "Please select a valid ticket type."
      );

      return null;

    }


    const sold =
      countTickets(type);


    if (
      sold >=
      TICKET_TYPES[type].limit
    ) {

      alert(
        type + " tickets are sold out."
      );

      return null;

    }


    const tickets =
      getTickets();


    let ticketId;

    do {

      ticketId =
        generateTicketId();

    } while (

      tickets.some(
        function (ticket) {
          return ticket.id === ticketId;
        }
      )

    );


    const ticket = {

      id: ticketId,

      name: name,

      type: type,

      price:
        TICKET_TYPES[type].price,

      status: "VALID",

      event: "Meatopia",

      date: "30 September 2026",

      venue: "Moshupa AOG",

      createdAt:
        new Date().toISOString()

    };


    tickets.push(ticket);

    saveTickets(tickets);

    return ticket;

  }


  // Display generated ticket
  function displayTicket(ticket) {

    const result =
      document.getElementById(
        "ticketResult"
      );

    const name =
      document.getElementById(
        "ticketName"
      );

    const type =
      document.getElementById(
        "ticketType"
      );

    const id =
      document.getElementById(
        "ticketId"
      );

    const status =
      document.getElementById(
        "ticketStatus"
      );

    const qr =
      document.getElementById(
        "qrcode"
      );


    if (name) {

      name.textContent =
        ticket.name;

    }


    if (type) {

      type.textContent =
        ticket.type +
        " — P" +
        ticket.price;

 }
