import { createContext, useEffect, useState } from "react";
import { API_URL } from "../config";

// ============= CONTEXT AANMAKEN ========================================
export const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  // ============== STATE ==================================================
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============ EVENTS & CATEGORIEËN OPHALEN ============================
  useEffect(() => {
    fetch(`${API_URL}/events`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load events.");
        }
        return response.json();
      })

      .then((data) => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Events could not be loaded.");
        setIsLoading(false);
      });

    fetch(`${API_URL}/categories`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load categories.");
        }
        return response.json();
      })

      .then((data) => setCategories(data))
      .catch(() => {
        setError("Categories could not be loaded.");
      });
  }, []);

  // ============ CONTEXT BESCHIKBAAR MAKEN =======================================
  return (
    <EventsContext.Provider
      value={{ events, setEvents, categories, setCategories, isLoading, error }}
    >
      {children}
    </EventsContext.Provider>
  );
};
