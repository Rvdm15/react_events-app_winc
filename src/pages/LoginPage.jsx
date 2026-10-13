import { Box, Heading, Input, Button, Stack, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toaster } from "../components/ui/toaster";
import { API_URL } from "../config";

export const LoginPage = () => {
  // ============= STATE =============================================
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // ============= INLOGGEN ==========================================
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed.");
        }
        return response.json();
      })
      .then((data) => {
        // Sleutelkaart (token) bewaren in de browser
        localStorage.setItem("token", data.token);
        toaster.create({
          title: "Successfully logged in.",
          type: "success",
        });
        navigate("/");
      })
      .catch(() => {
        setIsSubmitting(false);
        toaster.create({
          title: "Wrong username or password.",
          type: "error",
        });
      });
  };

  // ============= LOGIN FORMULIER ===================================
  return (
    <Box className="page-container" mt="2rem" maxW="400px">
      <Heading mb="1rem">Login</Heading>
      <form onSubmit={handleSubmit}>
        <Stack gap="1rem">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Flex gap="0.5rem">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </Flex>

          <Button type="submit" loading={isSubmitting}>
            Login
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
