import { Dialog, Flex, Box } from "@chakra-ui/react";
import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toaster } from "./ui/toaster";
import { EventsContext } from "../context/EventsContext";
import { EventForm } from "./EventForm";
import { API_URL } from "../config";

export const Navigation = () => {
  // =================== STATE & CONTEXT ========================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setEvents } = useContext(EventsContext);
  const navigate = useNavigate();

  // Elke keer als je naar een andere pagina gaat, kijkt het menu opnieuw
  useLocation();
  // Heb je een sleutelkaart (token) in je zak? Dan ben je ingelogd
  const isLoggedIn = localStorage.getItem("token") !== null;

  // =============== NIEUW EVENT TOEVOEGEN ===========================================
  const handleSubmit = (formData) => {
    // formData = de gevens uit Eventform, aangevuld met createdBy
    const newEvent = {
      createdBy: "1",
      ...formData,
      // Datums omzetten naar de volledige notatie die Prisma wil
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      // Categorie-id's omzetten naar tekst
      categoryIds: formData.categoryIds.map(String),
    };

    setIsSubmitting(true);
    fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
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

  // =============== UITLOGGEN ========================================
  const handleLogout = () => {
    // Sleutelkaart (token) weggooien
    localStorage.removeItem("token");
    toaster.create({
      title: "Successfully logged out.",
      type: "success",
    });
    navigate("/");
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
        {isLoggedIn && (
          <Link onClick={() => setIsModalOpen(true)}>Add Event</Link>
        )}
        <Link to="/contact">Contact</Link>
        {isLoggedIn ? (
          <Link onClick={handleLogout}>Logout</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
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
