import { Heading, Box, Text, Image } from "@chakra-ui/react";

export const ContactPage = () => {
  return (
    <Box px={{ base: "1rem", md: "2rem", lg: "4rem" }} maxW="1024px" mx="auto">
      <Heading mt="3rem" mb="1rem">
        Contact{" "}
      </Heading>
      <Text>This page is under construction</Text>
      <Image
        src="/img/under-construction.jpg"
        alt="Contact"
        width="100%"
        maxW="450px"
        height="auto"
        mt="3rem"
      />
    </Box>
  );
};
