import {
  Heading,
  Box,
  Image,
  Skeleton,
  SkeletonText,
  Button,
  Dialog,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { EventsContext } from "../context/EventsContext";
import { toaster } from "../components/ui/toaster";
import { EventForm } from "../components/EventForm";

export const EventPage = () => {
  // ============= ROUTING, CONTEXT & STATE =============================
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const { categories, setEvents } = useContext(EventsContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==================== EVENT OPHALEN ========================================
  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load event.");
        }
        return response.json();
      })

      .then((data) => {
        setEvent(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Event could not be loaded.");
        setIsLoading(false);
      });
  }, [eventId]);

  // ===================== EVENT VERWIJDEREN ====================================
  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmed) {
      return;
    }
    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete event.");
        }
        setEvents((currentEvents) =>
          currentEvents.filter((currentEvent) => currentEvent.id !== event.id),
        );

        toaster.create({
          title: "Event successfully deleted.",
          type: "success",
        });

        navigate("/");
      })

      .catch(() => {
        toaster.create({
          title: "Events could not be deleted.",
          type: "error",
        });
      });
  };
  // ================== EVENT BEWERKEN EN OPSLAAN ==================================
  const handleEditSubmit = (formData) => {
    setIsSubmitting(true);

    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update event.");
        }
        return response.json();
      })

      .then((data) => {
        setEvent(data);

        setEvents((currentEvents) =>
          currentEvents.map((currentEvent) =>
            currentEvent.id === data.id ? data : currentEvent,
          ),
        );

        toaster.create({
          title: "Event successfully updated.",
          type: "success",
        });

        setIsEditModalOpen(false);
        setIsSubmitting(false);
      })

      .catch(() => {
        setIsSubmitting(false);
        toaster.create({
          title: "Event could not be updated.",
          type: "error",
        });
      });
  };

  // =================== LOADING STATE ========================================
  if (isLoading) {
    return (
      <Box className="page-container" mt="1rem">
        <Heading size="md" mb="1rem">
          Loading event...
        </Heading>

        <SimpleGrid className="event-detail-grid">
          {/* Grijs blok op de plek van de afbeelding */}
          <Skeleton height="300px" />
          {/* Grijs balkjes op de plek van de tekst */}
          <Box className="content-panel">
            <SkeletonText noOfLines={6} gap="2" />
          </Box>
        </SimpleGrid>
      </Box>
    );
  }
  // ======================= ERROR STATE =========================================
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Box className="page-container">
      <Heading mt="2rem" mb="1rem">
        Event page
      </Heading>

      {/* ================= EVENT DETAILS ============================================== */}
      <SimpleGrid className="event-detail-grid">
        <Image
          className="event-detail-image"
          src={event?.image}
          alt={event?.title}
        />
        <Box className="content-panel">
          <Heading size="md" mb="0.5rem">
            {event?.title}
          </Heading>
          <p style={{ fontSize: "14px" }}>{event?.description}</p>
          <p style={{ fontSize: "14px" }}>
            <strong>Categories:</strong>{" "}
            {event?.categoryIds
              .map(
                (categoryId) =>
                  categories.find((category) => category.id === categoryId)
                    ?.name,
              )
              .join(", ")}
          </p>
          <p style={{ fontSize: "14px" }}>
            <strong>Location: </strong> {event?.location}
          </p>
          <p style={{ fontSize: "14px" }}>
            <strong>Start:</strong>{" "}
            {event?.startTime &&
              new Date(event.startTime).toLocaleString("nl-NL", {
                dateStyle: "short",
                timeStyle: "short",
              })}
          </p>

          <p style={{ fontSize: "14px" }}>
            <strong>End:</strong>{" "}
            {event?.endTime &&
              new Date(event.endTime).toLocaleString("nl-NL", {
                dateStyle: "short",
                timeStyle: "short",
              })}
          </p>
        </Box>
      </SimpleGrid>

      {/* ============ EDIT & DELETE KNOPPEN ====================================== */}
      <Flex gap="1rem" mt="2rem">
        <Button onClick={() => navigate("/")} mt="0rem">
          Back to events
        </Button>
        <Button onClick={() => setIsEditModalOpen(true)}>Edit Event</Button>
        <Button onClick={handleDelete}>Delete Event</Button>
      </Flex>

      {/* ================ EDIT EVENT FORMULIER (MODAL) ==================================== */}
      {isEditModalOpen && (
        <Dialog.Root open={isEditModalOpen}>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Edit Event</Dialog.Title>
              </Dialog.Header>
              <Dialog.CloseTrigger onClick={() => setIsEditModalOpen(false)}>
                Close
              </Dialog.CloseTrigger>
              <Dialog.Body>
                <EventForm
                  initialEvent={event}
                  onSubmit={handleEditSubmit}
                  isSubmitting={isSubmitting}
                  submitText="Save Changes"
                />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      )}
    </Box>
  );
};
