import { Dialog, Flex, Box } from "@chakra-ui/react";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toaster } from "./ui/toaster";
import { EventsContext } from "../context/EventsContext";
import { EventForm } from "./EventForm";

export const Navigation = () => {
  // =================== STATE & CONTEXT ========================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setEvents } = useContext(EventsContext);
  const navigate = useNavigate();

  // =============== NIEUW EVENT TOEVOEGEN ===========================================
  const handleSubmit = (formData) => {
    // formData = de gevens uit Eventform, aangevuld met createdBy
    const newEvent = {
      createdBy: 1,
      ...formData,
    };

    setIsSubmitting(true);
    fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add event.");
        }
        return response.json();
      })
      .then((data) => {
        setEvents((currentEvents) => [...currentEvents, data]);
        toaster.create({
          title: "Event successfully added.",
          type: "success",
        });
        setIsModalOpen(false);
        navigate(`/event/${data.id}`);
        setIsSubmitting(false);
      })
      .catch(() => {
        setIsSubmitting(false);
        toaster.create({
          title: "Event could not be added.",
          type: "error",
        });
      });
  };

  return (
    <Box as="nav" bg="gray.100">
      <Flex
        className="page-container"
        gap="1rem"
        py="1rem"
        wrap="wrap"
        css={{
          "& a": { fontWeight: "semibold" },
          "& a:hover": {
            textDecoration: "underline",
          },
        }}
      >
        {/* =========== NAVIGATION ========================================= */}
        <Link to="/">Events</Link>
        <Link onClick={() => setIsModalOpen(true)}>Add Event</Link>
        <Link to="/contact">Contact</Link>
      </Flex>

      {/* ============ ADD EVENT FORMULIER ==================================== */}
      {isModalOpen && (
        <Dialog.Root open={isModalOpen}>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Add Event.</Dialog.Title>
              </Dialog.Header>
              <Dialog.CloseTrigger onClick={() => setIsModalOpen(false)}>
                Close
              </Dialog.CloseTrigger>

              {/* ============== FORMULIER BODY ====================================== */}
              <Dialog.Body>
                <EventForm
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  submitText="Add Event"
                />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      )}
    </Box>
  );
};
