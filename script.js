alert("MEATOPIA SCRIPT LOADED");
/*
=====================================================
   MEATOPIA ONLINE TICKET SYSTEM
   Ticket types, prices and quantity limits
   ===================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "meatopia_tickets_v2";

  /* ===============================
     MEATOPIA TICKET TYPES
     =============================== */

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


  /* ===============================
     GENERATE UNIQUE TICKET ID
     =============================== */

  function generateTicketId() {

    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 8; i++) {

      code += characters.charAt(
        Math.floor(
          Math.random() * characters.length
        )
      );

    }

    return "MTP-" + code;
  }


  /* ===============================
     GET SAVED TICKETS
     =============================== */

  function getTickets() {

    try {

      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return [];
      }

      const tickets =
        JSON.parse(saved);

      return Array.isArray(tickets)
        ? tickets
        : [];

    } catch (error) {

      console.error(
        "Unable to load tickets:",
        error
      );

      return [];
    }
  }


  /* ===============================
     SAVE TICKETS
     =============================== */

  function saveTickets(tickets) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tickets)
    );
  }


  /* ===============================
     COUNT TICKETS BY TYPE
     =============================== */

  function countTickets(type) {

    const tickets = getTickets();

    return tickets.filter(
      ticket
