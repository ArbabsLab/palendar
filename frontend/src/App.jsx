import { Container, Stack, Text, Box, useColorModeValue } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import UserGrid from "./components/UserGrid";
import { useState } from "react";

export const BASE_URL =
	import.meta.env.MODE === "development"
		? "http://127.0.0.1:5000/api/v1"
		: "/api/v1";

function App() {
	const [users, setUsers] = useState([]);

	
	const bgColor = useColorModeValue("#f0f4f8", "#1a202c"); // light bluish-gray / dark navy
	const textColor = useColorModeValue("#1a365d", "#e3f2fd"); // deep blue / soft blue
	const subTextColor = useColorModeValue("#4a5568", "#cbd5e0"); // slate gray / soft gray-blue

	return (
		<Stack minH="100vh" spacing={0} bg={bgColor}>
			<Navbar setUsers={setUsers} />

			<Container maxW="6xl" py={10}>
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
			</Container>
		</Stack>
	);
}

export default App;
