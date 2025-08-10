import { Container, Stack, Text, Box, useColorModeValue } from "@chakra-ui/react";
import UserGrid from "../components/UserGrid";
import { useState } from "react";

const Home = () => {
    const [users, setUsers] = useState([]);
    const bgColor = useColorModeValue("#f0f4f8", "#1a202c");
    const textColor = useColorModeValue("#1a365d", "#e3f2fd");
    const subTextColor = useColorModeValue("#4a5568", "#cbd5e0");

  return (
    <>
        <Box textAlign="center" mb={10}>
        <Text
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="bold"
            letterSpacing="wide"
            textTransform="uppercase"
            color={textColor}
        >
            Contacts
        </Text>
        <Text fontSize="md" color={subTextColor} mt={2}>
            View, manage, and connect with your contacts
        </Text>
        </Box>
        <UserGrid users={users} setUsers={setUsers} />
    </>
          
  )
}

export default Home