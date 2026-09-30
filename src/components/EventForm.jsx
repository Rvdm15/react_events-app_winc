import {
  Field,
  Input,
  Checkbox,
  CheckboxGroup,
  Fieldset,
  Button,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { EventsContext } from "../context/EventsContext";

// Gedeeld formulier voor Add Event en Edit Event
export const EventForm = ({
  initialEvent,
  onSubmit,
  isSubmitting,
  submitText,
}) => {
  // ============== CONTEXT =======================================
  const { categories } = useContext(EventsContext);

  // ============== STATE =========================================
  // Bij Edit: startwaarden uit het bestaande event. Bij Add:: leeg
  const [title, setTitle] = useState(initialEvent?.title || "");
  const [description, setDescription] = useState(
    initialEvent?.description || "",
  );
  const [image, setImage] = useState(initialEvent?.image || "");
  const [location, setLocation] = useState(initialEvent?.location || "");
  const [startTime, setStartTime] = useState(initialEvent?.startTime || "");
  const [endTime, setEndTime] = useState(initialEvent?.endTime || "");
  const [selectedCategories, setSelectedCategories] = useState(
    initialEvent?.categoryIds?.map(String) || [],
  );

  // ============== FORMULIER VERSTUREN =======================================

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedCategories.length === 0) {
      alert("Selecteer minimaal één categorie.");
      return;
    }
    // De ingevulde gegevens doorgeven aan Navigation of EventPage
    onSubmit({
      title: title,
      description: description,
      image: image,
      location: location,
      startTime: startTime,
      endTime: endTime,
      categoryIds: selectedCategories.map(Number),
    });
  };
  return (
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

      {/* =============== CATEGORIEËN ================================================= */}
      <Fieldset.Root className="category-fieldset">
        <CheckboxGroup
          value={selectedCategories}
          onValueChange={(value) => setSelectedCategories(value)}
        >
          <Fieldset.Legend>Categories</Fieldset.Legend>
          {categories.map((category) => (
            <Checkbox.Root key={category.id} value={String(category.id)}>
              <Checkbox.HiddenInput />
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Label>{category.name}</Checkbox.Label>
            </Checkbox.Root>
          ))}
        </CheckboxGroup>
      </Fieldset.Root>

      {/* ============= FORMULIER KNOP ============================== */}
      <Button
        type="submit"
        className="add-event-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : submitText}
      </Button>
    </form>
  );
};
