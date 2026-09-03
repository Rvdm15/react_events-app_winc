import {
  Heading,
  Image,
  Box,
  Input,
  NativeSelect,
  Skeleton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/events") // React haalt events op
      .then((response) => response.json()) // Backend geeft response
      .then((data) => {
        // Data wordt opgehaald en geplaatst.
        setEvents(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Events could not be loaded.");
        setIsLoading(false);
      });

    fetch("http://localhost:3000/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchField.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      event.categoryIds.some((categoryId) =>
        categories.some(
          (category) =>
            category.id === categoryId && category.name === selectedCategory,
        ),
      );
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <Box ml="15rem" mt="1rem">
        <Heading size="md" mb="1rem">
          Loading events...
        </Heading>

        <Skeleton height="300px" width="300px" />
      </Box>
    );
  }
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <Box ml="15rem">
      <Heading mt="1rem" mb="1rem">
        List of events
      </Heading>
      <Input
        placeholder="Search events ... "
        value={searchField}
        onChange={(event) => setSearchField(event.target.value)}
        mb="1rem"
      />
      <NativeSelect.Root mb="1rem">
        <NativeSelect.Field
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </NativeSelect.Field>
      </NativeSelect.Root>

      {filteredEvents.map((event) => (
        <div key={event.id}>
          <Link to={`/event/${event.id}`}>
            <Heading size="md">{event.title}</Heading>

            <p style={{ fontSize: "14px" }}>{event.description}</p>
            <p style={{ fontSize: "14px" }}>
              Categories:{" "}
              {event.categoryIds
                .map(
                  (categoryId) =>
                    categories.find((category) => category.id === categoryId)
                      ?.name,
                )
                .join(", ")}
            </p>
            <p style={{ fontSize: "14px" }}>
              Start:{" "}
              {event?.startTime &&
                new Date(event.startTime).toLocaleString("nl-NL", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
            </p>
            <p style={{ fontSize: "14px" }}>
              End:{" "}
              {event?.endTime &&
                new Date(event.endTime).toLocaleString("nl-NL", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
            </p>
            <Image
              src={event.image}
              alt={event.title}
              width="300px"
              mt="1rem"
              mb="2rem"
            />
          </Link>
        </div>
      ))}
    </Box>
  );
};
