import { createContext, useEffect, useState } from "react";
export const EventsContext = createContext();
export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState([true]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((response) => response.json())
      .then((data) => {
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

  return (
    <EventsContext.Provider
      value={{ events, setEvents, categories, setCategories, isLoading, error }}
    >
      {children}
    </EventsContext.Provider>
  );
};
