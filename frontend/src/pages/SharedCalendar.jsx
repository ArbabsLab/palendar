import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { BASE_URL } from "../App";
import { useDisclosure, useToast } from "@chakra-ui/react";
import CreateEventModal from "../components/CreateEventModal";

const SharedCalendar = () => {
  const [events, setEvents] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${BASE_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEvents(
        data.map(e => ({
          id: e.id,
          title: e.title,
          start: e.date,
          backgroundColor: e.type === "created" ? "#3182ce" : "#38a169"
        }))
      );
    } catch (err) {
      toast({
        status: "error",
        title: "Error loading events",
        description: err.message
      });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable
        editable={false}
        events={events}
        dateClick={(info) => {
          onOpen();
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        height="90vh"
      />
      <CreateEventModal isOpen={isOpen} onClose={onClose} refreshEvents={fetchEvents} />
    </>
  );
};

export default SharedCalendar;
