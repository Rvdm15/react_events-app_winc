import { Heading, Box, Text, Input, Textarea, Button } from "@chakra-ui/react";

export const ContactPage = () => {
  return (
    <Box className="page-container contact-grid">
      <Box className="content-panel">
        <Heading mt="0rem" mb="1rem">
          Contact Us{" "}
        </Heading>
        <Box className="contact-form">
          <Input placeholder="Name" />
          <Input type="email" placeholder="Email" />
          <Textarea placeholder="Message" />
          <Button> Send message</Button>
        </Box>
      </Box>

      <Box className="content-panel">
        <Heading size="md" mb="1rem">
          Contact details
        </Heading>

        <Text>Email: info@eventapp.com</Text>
        <Text>Phone: +31 6 12345678</Text>
        <Text>Location: Amsterdam, The Netherlands</Text>
      </Box>
    </Box>
  );
};
