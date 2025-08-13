import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { BASE_URL } from "../App";
import { useDisclosure, useToast } from "@chakra-ui/react";
import CreateEventModal from "../components/CreateEventModal";
import EventModal from "../components/EventModal";

const SharedCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
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
          description: e.description,
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
        events={events}
        dateClick={() => onCreateOpen()}
        eventClick={(info) => {
          setSelectedEvent({
            id: info.event.id,
            title: info.event.title,
            description: info.event.extendedProps.description,
            date: info.event.start
          });
          onEditOpen();
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        height="90vh"
      />
      <CreateEventModal isOpen={isCreateOpen} onClose={onCreateClose} refreshEvents={fetchEvents} />
      <EventModal isOpen={isEditOpen} onClose={onEditClose} refreshEvents={fetchEvents} eventData={selectedEvent} />
    </>
  );
};

export default SharedCalendar;
