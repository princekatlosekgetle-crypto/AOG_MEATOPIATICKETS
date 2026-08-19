/* =========================================================
   MEATOPIA ONLINE TICKET SYSTEM
   COMPLETE SCRIPT.JS
   ========================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "meatopia_tickets_v1";

  /* -------------------------------------------------------
     UNIQUE TICKET ID
     Example: MTP-8K4P-X7Q2
  ------------------------------------------------------- */

  function generateTicketId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    function part(length) {
      let result = "";

      for (let i = 0; i < length; i++) {
        result += chars.charAt(
          Math.floor(Math.random() * chars.length)
        );
      }

      return result;
    }

    return "MTP-" + part(4) + "-" + part(4);
  }


  /* -------------------------------------------------------
     LOAD TICKETS
  ------------------------------------------------------- */

  function getTickets() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return [];
      }

      const tickets = JSON.parse(saved);

      return Array.isArray(tickets) ? tickets : [];

    } catch (error) {
      console.error("Unable to load tickets:", error);
      return [];
    }
  }


  /* -------------------------------------------------------
     SAVE TICKETS
  ------------------------------------------------------- */

  function saveTickets(tickets) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tickets)
    );
  }


  /* -------------------------------------------------------
     CREATE TICKET
  ------------------------------------------------------- */

  function createTicket(name, type) {

    name = String(name || "").trim();
    type = String(type || "").trim();

    if (!name) {
      throw new Error("Ticket holder name is required.");
    }

    if (!type) {
      throw new Error("Ticket type is required.");
    }

    const tickets = getTickets();

    let ticketId;

    do {
      ticketId = generateTicketId();
    } while (
      tickets.some(ticket => ticket.id === ticketId)
    );

    const ticket = {
      id: ticketId,
      name: name,
      type: type,
      status: "VALID",
      createdAt: new Date().toISOString()
    };

    tickets.push(ticket);

    saveTickets(tickets);

    return ticket;
  }


  /* -------------------------------------------------------
     FIND TICKET
  ------------------------------------------------------- */

  function findTicket(ticketId) {

    if (!ticketId) {
      return null;
    }

    const searchId =
      String(ticketId)
        .trim()
        .toUpperCase();

    const tickets = getTickets();

    return tickets.find(
      ticket =>
        String(ticket.id).toUpperCase() === searchId
    ) || null;
  }


  /* -------------------------------------------------------
     VERIFY TICKET
  ------------------------------------------------------- */

  function verifyTicket(ticketId) {

    const ticket = findTicket(ticketId);

    if (!ticket) {
      return {
        valid: false,
        message: "TICKET NOT FOUND"
      };
    }

    if (ticket.status !== "VALID") {
      return {
        valid: false,
        message: "TICKET IS NOT VALID"
      };
    }

    return {
      valid: true,
      message: "VALID TICKET",
      ticket: ticket
    };
  }


  /* -------------------------------------------------------
     QR CODE
  ------------------------------------------------------- */

  function createQRCode(ticketId) {

    const container =
      document.getElementById("qrcode");

    if (!container) {
      return;
    }

    container.innerHTML = "";

    if (typeof QRCode === "undefined") {

      container.innerHTML =
        "<p>QR CODE LIBRARY NOT LOADED</p>";

      console.error(
        "QRCode library was not found."
      );

      return;
    }

    new QRCode
