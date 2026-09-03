import { Heading, Box, Image, Skeleton } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

    fetch("http://localhost:3000/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, [eventId]);

  if (isLoading) {
    return (
      <Box ml="15rem" mt="1rem">
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
    <Box ml="15rem">
      <Heading mt="1rem" mb="2rem">
        Event page
      </Heading>
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
        width="400px"
        mt="1rem"
        mb="2rem"
      />
    </Box>
  );
};
