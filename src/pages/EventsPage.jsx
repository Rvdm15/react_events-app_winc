import {
  Heading,
  Image,
  Box,
  Input,
  Skeleton,
  Checkbox,
  CheckboxGroup,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { EventsContext } from "../context/EventsContext";

export const EventsPage = () => {
  // ========== CONTEXT & STATE ============================================
  const { events, categories, isLoading, error } = useContext(EventsContext);
  const [searchField, setSearchField] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  // =========== EVENTS FILTERS ==============================================
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchField.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((selectedCategory) =>
        event.categoryIds.includes(Number(selectedCategory)),
      );
    return matchesSearch && matchesCategory;
  });
  // ========== LOADING STATE ====================================================
  if (isLoading) {
    return (
      <Box className="page-container" mt="1rem">
        <Heading size="md" mb="1rem">
          Loading events...
        </Heading>

        <Skeleton height="300px" width="300px" />
      </Box>
    );
  }
  // ============ ERROR STATE =======================================================
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <Box className="page-container">
      <Heading mt="1rem" mb="1rem" textAlign="center">
        List of events
      </Heading>

      {/* =============== ZOEKEN EN FILTERS ================================================ */}
      <Box className="search-filter">
        {" "}
        {/* Begin zoek- en filter box */}
        <Input
          placeholder="Search events ... "
          value={searchField}
          onChange={(event) => setSearchField(event.target.value)}
        />
        <CheckboxGroup
          value={selectedCategories}
          onValueChange={(value) => setSelectedCategories(value)}
        >
          <Flex gap="1rem" wrap="wrap" justify="center" mb="1rem">
            {categories.map((category) => (
              <Checkbox.Root key={category.id} value={String(category.id)}>
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>{category.name}</Checkbox.Label>
              </Checkbox.Root>
            ))}
          </Flex>
        </CheckboxGroup>
      </Box>
      {/* ================== EVENTS OVERZICHT ============================================= */}
      <SimpleGrid className="events-grid">
        {filteredEvents.map((event) => (
          <Box key={event.id} className="event-card">
            <Link to={`/event/${event.id}`}>
              <Image src={event.image} alt={event.title} />

              {/* ===================== EVENT INFORMATIE ============================================== */}
              <Box className="content-panel">
                <Heading size="md" mb="0.5rem">
                  {event.title}
                </Heading>
                <p style={{ fontSize: "14px" }}>{event.description}</p>
                <p style={{ fontSize: "14px" }}>
                  <strong>Categories:</strong>{" "}
                  {event.categoryIds
                    .map(
                      (categoryId) =>
                        categories.find(
                          (category) => category.id === categoryId,
                        )?.name,
                    )
                    .join(", ")}
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
            </Link>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};
