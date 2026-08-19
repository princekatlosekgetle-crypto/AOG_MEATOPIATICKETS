(function () {
  "use strict";

  const TICKETS_KEY = "meatopia_tickets";

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


  function getTickets() {

    const data =
      localStorage.getItem(TICKETS_KEY);

    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }


  function saveTickets(tickets) {

    localStorage.setItem(
      TICKETS_KEY,
      JSON.stringify(tickets)
    );

  }


  function createTicketId() {

    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let id = "MTP-";

    for (let i = 0; i < 8; i++) {

      id += characters[
        Math.floor(
          Math.random() *
          characters.length
        )
      ];

    }

    return id;

  }


  function createTicket(name, type) {

    const tickets =
      getTickets();

    if (!TICKET_TYPES[type]) {

      alert("Please select a valid ticket type.");

      return null;

    }


    const sold =
      tickets.filter(
        ticket =>
          ticket.type === type
      ).length;


    if (
      sold >=
      TICKET_TYPES[type].limit
    ) {

      alert(
        type +
        " tickets are sold out."
      );

      return null;

    }


    let id;

    do {

      id =
        createTicketId();

    } while (
      tickets.some(
        ticket =>
          ticket.id === id
      )
    );


    const ticket = {

      id: id,

      name: name,

      type: type,

      price:
        TICKET_TYPES[type].price,

      status: "VALID",

      date:
        "30 September 2026",

      venue:
        "Moshupa AOG",

      created:
        new Date().toISOString()

    };


    tickets.push(ticket);

    saveTickets(tickets);

    return ticket;

  }


  function showTicket(ticket) {

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


    if (!result) {

      alert(
        "Ticket display area was not found."
      );

      return;

    }


    name.textContent =
      ticket.name;


    type.textContent =
      ticket.type +
      " — P" +
      ticket.price;


    id.textContent =
      ticket.id;


    status.textContent =
      "VALID";


    qr.innerHTML = "";


    if (
      typeof QRCode !==
      "undefined"
    ) {

      new QRCode(
        qr,
        {
          text: ticket.id,
          width: 180,
          height: 180
        }
      );

    } else {

      qr.innerHTML =
        "<p>QR code could not load.</p>";

    }


    result.classList.remove(
      "hidden"
    );


    result.scrollIntoView({
      behavior: "smooth"
    });

  }


  function start() {

    const form =
      document.getElementById(
        "ticketForm"
      );


    if (!form) {

      alert(
        "Ticket form was not found."
      );

      return;

    }


    form.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        const name =
          document.getElementById(
            "customerName"
          ).value.trim();


        const type =
          document.getElementById(
            "ticketTypeInput"
          ).value;


        if (!name) {

          alert(
            "Please enter the ticket holder's name."
          );

          return;

        }


        if (!type) {

          alert(
            "Please select a ticket type."
          );

          return;

        }


        const ticket =
          createTicket(
            name,
            type
          );


        if (ticket) {

          showTicket(
            ticket
          );

        }

      }
    );

  }


  document.addEventListener(
    "DOMContentLoaded",
    start
  );

})();
