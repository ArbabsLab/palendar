import {
	Box,
	Button,
	Container,
	Flex,
	Text,
	useColorMode,
	useColorModeValue,
} from "@chakra-ui/react";
import { IoMoon } from "react-icons/io5";
import { LuSun, LuCalendar } from "react-icons/lu";
import CreateUserModal from "./CreateUserModal";

const Navbar = ({ setUsers }) => {
	const { colorMode, toggleColorMode } = useColorMode();

	
	const bgColor = useColorModeValue("#ffffff", "#2d3748"); // white / deep blue-gray
	const borderColor = useColorModeValue("#e2e8f0", "#4a5568"); // soft border
	const textColor = useColorModeValue("#2c5282", "#edf2f7"); // rich blue / soft white
	const subTextColor = useColorModeValue("#718096", "#a0aec0"); // muted slate gray

	return (
		<Box bg={bgColor} borderBottom={`1px solid ${borderColor}`} shadow="sm">
			<Container maxW="6xl">
				<Flex align="center" justify="space-between" py={4} px={{ base: 2, md: 4 }}>
					{/* Branding */}
					<Flex align="center" gap={3}>
						<LuCalendar size={28} color={textColor} />
						<Flex direction="column" display={{ base: "none", sm: "flex" }}>
							<Text fontSize="lg" fontWeight="bold" color={textColor}>
								Palendar
							</Text>
							<Text fontSize="sm" color={subTextColor}>
								Schedule times with friends
							</Text>
						</Flex>
					</Flex>

					{/* Actions */}
					<Flex align="center" gap={3}>
						<Button
							onClick={toggleColorMode}
							variant="ghost"
							aria-label="Toggle color mode"
							size="sm"
						>
							{colorMode === "light" ? <IoMoon size={18} /> : <LuSun size={18} />}
						</Button>
						<CreateUserModal setUsers={setUsers} />
					</Flex>
				</Flex>
			</Container>
		</Box>
	);
};

export default Navbar;
