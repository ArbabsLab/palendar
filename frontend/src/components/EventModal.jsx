import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../App";

export default function EventModal({ isOpen, onClose, eventData, fetchEvents }) {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const toast = useToast();

  const token = localStorage.getItem("access_token");

  // Update form fields whenever a new event is selected
  useEffect(() => {
    if (eventData) {
      setTitle(eventData.title || "");
      setDescription(eventData.description || "");
      setDate(formatDateForInput(eventData.date));
      setEditMode(false);
    }
  }, [eventData]);

  const formatDateForInput = (dateObj) => {
    if (!dateObj) return "";
    const date = new Date(dateObj);
    return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  };

  const handleSave = async () => {
    try {
      const formattedDate = date ? date.replace("T", " ") : "";

      await axios.put(
        `${BASE_URL}/events/${eventData.id}`,
        { title, description, date: formattedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: "Event updated", status: "success", duration: 2000 });
      fetchEvents();
      setEditMode(false);
    } catch (err) {
      toast({ title: "Error updating event", status: "error", duration: 2000 });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/events/${eventData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: "Event deleted", status: "success", duration: 2000 });
      fetchEvents();
      onClose();
    } catch (err) {
      toast({ title: "Error deleting event", status: "error", duration: 2000 });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{editMode ? "Edit Event" : "Event Details"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Title</FormLabel>
            <Input
              value={title}
              isReadOnly={!editMode}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              isReadOnly={!editMode}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input
              type="datetime-local"
              value={date}
              isReadOnly={!editMode}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          {!editMode ? (
            <>
              <Button colorScheme="blue" mr={3} onClick={() => setEditMode(true)}>
                Edit
              </Button>
              <Button colorScheme="red" onClick={handleDelete}>
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button colorScheme="green" mr={3} onClick={handleSave}>
                Save
              </Button>
              <Button onClick={() => setEditMode(false)}>Cancel</Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
