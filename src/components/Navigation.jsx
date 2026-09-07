import {
  Dialog,
  Field,
  Flex,
  Link,
  Input,
  Checkbox,
  CheckboxGroup,
  Fieldset,
  Button,
  Box,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { toaster } from "./ui/toaster";
import { EventsContext } from "../context/EventsContext";

export const Navigation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { categories, setEvents } = useContext(EventsContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedCategories.length === 0) {
      alert("Selecteer minimaal één categorie.");
      return;
    }
    const newEvent = {
      createdBy: 1,
      title: title,
      description: description,
      image: image,
      location: location,
      startTime: startTime,
      endTime: endTime,
      categoryIds: selectedCategories.map(Number),
    };

    fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setEvents((currentEvents) => [...currentEvents, data]);
        toaster.create({
          title: "Event successfully added.",
          type: "success",
        });
        setTitle("");
        setDescription("");
        setImage("");
        setLocation("");
        setStartTime("");
        setEndTime("");
        setSelectedCategories([]);
        setIsModalOpen(false);
      })
      .catch(() => {
        toaster.create({
          title: "Event could not be added.",
          type: "error",
        });
      });
  };
  return (
    <Box as="nav" bg="gray.100">
      <Flex
        gap="1rem"
        px={{ base: "1rem", md: "2rem", lg: "4rem" }}
        py="1rem"
        maxW="1024px"
        mx="auto"
        wrap="wrap"
        css={{
          "& a": { fontWeight: "semibold" },
          "& a:hover": {
            textDecoration: "underline",
          },
        }}
      >
        <Link href="/">Events</Link>
        <Link onClick={() => setIsModalOpen(true)}>Add Event</Link>
        <Link href="/contact">Contact</Link>
      </Flex>
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
              <Dialog.Body>
                <form onSubmit={handleSubmit}>
                  <Field.Root>
                    <Field.Label>Title</Field.Label>
                    <Input
                      type="text"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      required
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Description</Field.Label>
                    <Input
                      type="text"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      required
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Image</Field.Label>
                    <Input
                      type="text"
                      value={image}
                      onChange={(event) => setImage(event.target.value)}
                      required
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label> Location</Field.Label>
                    <Input
                      type="text"
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      required
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Start Time</Field.Label>
                    <Input
                      type="datetime-local"
                      value={startTime}
                      onChange={(event) => setStartTime(event.target.value)}
                      color="gray.500"
                      required
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>End Time</Field.Label>

                    <Input
                      type="datetime-local"
                      value={endTime}
                      onChange={(event) => setEndTime(event.target.value)}
                      color="gray.500"
                      required
                    />
                  </Field.Root>

                  <Fieldset.Root>
                    <CheckboxGroup
                      value={selectedCategories}
                      onValueChange={(value) => setSelectedCategories(value)}
                    >
                      <Fieldset.Legend>Categories</Fieldset.Legend>
                      {categories.map((category) => (
                        <Checkbox.Root
                          key={category.id}
                          value={String(category.id)}
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <Checkbox.Label>{category.name}</Checkbox.Label>
                        </Checkbox.Root>
                      ))}
                    </CheckboxGroup>
                  </Fieldset.Root>
                  <Button type="submit">Add Event</Button>
                </form>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      )}
    </Box>
  );
};
