import { Container, Stack, Text, Box, useColorModeValue } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import UserGrid from "./components/UserGrid";
import { useState } from "react";
import SharedCalendar from "./pages/SharedCalendar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

export const BASE_URL =
	import.meta.env.MODE === "development"
		? "http://127.0.0.1:5000/api/v1"
		: "/api/v1";

function App() {
  const [users, setUsers] = useState([]);

  const bgColor = useColorModeValue("#f0f4f8", "#1a202c");
  const textColor = useColorModeValue("#1a365d", "#e3f2fd");
  const subTextColor = useColorModeValue("#4a5568", "#cbd5e0");

  return (
    <Stack minH="100vh" spacing={0} bg={bgColor}>
      <Navbar setUsers={setUsers} />

      <Container maxW="6xl" py={10}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<SharedCalendar />} />
          
        </Routes>
      </Container>
    </Stack>
  );
}


export default App;
