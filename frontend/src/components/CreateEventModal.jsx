import React, { useEffect, useState } from "react";
import {
  Button, FormControl, FormLabel, Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
  ModalOverlay, Textarea, useToast
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { BASE_URL } from "../App";

const CreateEventModal = ({ isOpen, onClose, refreshEvents }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(new Date());
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const toast = useToast();

  const fetchFriends = async () => {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${BASE_URL}/friends`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setFriends(data.map(f => ({ value: f.id, label: f.username })));
  };

  const handleCreateEvent = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${BASE_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title,
          description: desc,
          date: date.toISOString().slice(0, 16).replace("T", " ")
        })
      });
      const eventData = await res.json();

      if (!res.ok) throw new Error(eventData.error || "Failed to create event");

      if (selectedFriends.length > 0) {
        await fetch(`${BASE_URL}/events/${eventData.event_id}/invite`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            invitees: selectedFriends.map(f => f.value)
          })
        });
      }

      toast({ status: "success", title: "Event created!" });
      refreshEvents();
      onClose();
    } catch (err) {
      toast({ status: "error", title: "Error", description: err.message });
    }
  };

  useEffect(() => {
    if (isOpen) fetchFriends();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Description</FormLabel>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Date & Time</FormLabel>
            <DatePicker
              selected={date}
              onChange={setDate}
              showTimeSelect
              dateFormat="Pp"
              className="chakra-input"
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Invite Friends</FormLabel>
            <Select
              isMulti
              options={friends}
              value={selectedFriends}
              onChange={setSelectedFriends}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleCreateEvent}>
            Create
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateEventModal;
