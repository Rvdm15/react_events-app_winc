import {
  Heading,
  Box,
  Image,
  Skeleton,
  Button,
  Dialog,
  Field,
  Input,
  Checkbox,
  CheckboxGroup,
  Fieldset,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { EventsContext } from "../context/EventsContext";
import { toaster } from "../components/ui/toaster";

export const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const { categories, setEvents } = useContext(EventsContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editCategories, setEditCategories] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Event could not be loaded.");
        setIsLoading(false);
      });
  }, [eventId]);

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmed) {
      return;
    }
    fetch(`http://localhost:3000/events/$(eventId}`, {
      method: "DELETE",
    })
      .then(() => {
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

  const handleEditSubmit = () => {
    if (editCategories.length === 0) {
      alert("Selecteer minimaal één categorie.");
      return;
    }
    const updatedEvent = {
      title: editTitle,
      description: editDescription,
      image: editImage,
      location: editLocation,
      startTime: editStartTime,
      endTime: editEndTime,
      categoryIds: editCategories.map(Number),
    };

    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    })
      .then((response) => response.json())

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
      })

      .catch(() => {
        toaster.create({
          title: "Event could not be updated.",
          type: "error",
        });
      });
  };

  if (isLoading) {
    return (
      <Box px={{ base: "1rem", md: "2rem", lg: "4rem" }}>
        <Heading size="md" mb="1rem">
          Loading event...
        </Heading>

        <Skeleton height="300px" width="400px" />
      </Box>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Box px={{ base: "1rem", md: "2rem", lg: "4rem" }} maxW="1024px" mx="auto">
      <Heading mt="1rem" mb="1rem">
        Event page
      </Heading>
      <Flex gap="1rem">
        <Button
          mb="1rem"
          onClick={() => {
            setEditTitle(event.title);
            setEditDescription(event.description);
            setEditImage(event.image);
            setEditLocation(event.location);
            setEditStartTime(event.startTime);
            setEditEndTime(event.endTime);
            setEditCategories(event.categoryIds.map(String));
            setIsEditModalOpen(true);
          }}
        >
          Edit Event
        </Button>
        <Button onClick={handleDelete}>Delete Event</Button>
      </Flex>

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        gap="2rem"
        maxW="1000px"
        alignItems="Start"
      >
        <Image
          src={event?.image}
          alt={event?.title}
          width="100%"
          maxW="600px"
          height={{ base: "250px", md: "350px" }}
          objectFit="cover"
        />
        <Box>
          <Heading size="md" mb="0.5rem">
            {event?.title}
          </Heading>
          <p style={{ fontSize: "14px" }}>{event?.description}</p>
          <p style={{ fontSize: "14px" }}>
            Categories:{" "}
            {event?.categoryIds
              .map(
                (categoryId) =>
                  categories.find((category) => category.id === categoryId)
                    ?.name,
              )
              .join(", ")}
          </p>
          <p style={{ fontSize: "14px" }}>Location: {event?.location}</p>
          <p style={{ fontSize: "14px" }}>
            Start:{""}
            {event?.startTime &&
              new Date(event.startTime).toLocaleString("nl-NL", {
                dateStyle: "short",
                timeStyle: "short",
              })}
          </p>

          <p style={{ fontSize: "14px" }}>
            End:{""}
            {event?.endTime &&
              new Date(event.endTime).toLocaleString("nl-NL", {
                dateStyle: "short",
                timeStyle: "short",
              })}
          </p>
        </Box>
      </SimpleGrid>

      {/*  
      <Heading size="md">{event?.title}</Heading>

      <p style={{ fontSize: "14px" }}>{event?.description}</p>
      <p style={{ fontSize: "14px" }}>
        Categories:{" "}
        {event?.categoryIds
          .map(
            (categoryId) =>
              categories.find((category) => category.id === categoryId)?.name,
          )
          .join(", ")}
      </p>
      <p style={{ fontSize: "14px" }}>Location: {event?.location}</p>
      <p style={{ fontSize: "14px" }}>
        Start:{""}
        {event?.startTime &&
          new Date(event.startTime).toLocaleString("nl-NL", {
            dateStyle: "short",
            timeStyle: "short",
          })}
      </p>

      <p style={{ fontSize: "14px" }}>
        End:{""}
        {event?.endTime &&
          new Date(event.endTime).toLocaleString("nl-NL", {
            dateStyle: "short",
            timeStyle: "short",
          })}
      </p>
      <Image
        src={event?.image}
        alt={event?.title}
        width="100%"
        maxW="600px"
        height={{ base: "250px", md: "350px" }}
        objectFit="cover"
        mt="1rem"
        mb="2rem"
      />
*/}

      {isEditModalOpen && (
        <Dialog.Root open={isEditModalOpen}>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Edit Event</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Field.Root>
                  <Field.Label>Title</Field.Label>
                  <Input
                    required
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Description</Field.Label>
                  <Input
                    required
                    value={editDescription}
                    onChange={(event) => setEditDescription(event.target.value)}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Image</Field.Label>
                  <Input
                    required
                    value={editImage}
                    onChange={(event) => setEditImage(event.target.value)}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Start Time</Field.Label>
                  <Input
                    required
                    type="datetime-local"
                    value={editStartTime}
                    onChange={(event) => setEditStartTime(event.target.value)}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>End Time</Field.Label>
                  <Input
                    required
                    type="datetime-local"
                    value={editEndTime}
                    onChange={(event) => setEditEndTime(event.target.value)}
                  />
                </Field.Root>

                <Fieldset.Root>
                  <Fieldset.Legend>Categories</Fieldset.Legend>

                  <CheckboxGroup
                    value={editCategories}
                    onValueChange={(value) => setEditCategories(value)}
                  >
                    {categories.map((category) => (
                      <Checkbox.Root
                        key={category.id}
                        value={String(category.id)}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>{category.name}</Checkbox.Label>
                      </Checkbox.Root>
                    ))}
                  </CheckboxGroup>
                </Fieldset.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Button onClick={() => setIsEditModalOpen(false)}>Close</Button>
                <Button onClick={handleEditSubmit}>Save Changes</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      )}
    </Box>
  );
};
