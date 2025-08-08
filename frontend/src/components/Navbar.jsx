import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useToast,
  Link,
} from "@chakra-ui/react";
import { IoMoon } from "react-icons/io5";
import { LuSun, LuCalendar } from "react-icons/lu";
import { useState, useEffect } from "react";
import CreateUserModal from "./CreateUserModal";
import { BASE_URL } from "../App";  // <-- here
import AuthModal from "./AuthModal";

const Navbar = ({ setUsers }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("#ffffff", "#2d3748");
  const borderColor = useColorModeValue("#e2e8f0", "#4a5568");
  const textColor = useColorModeValue("#2c5282", "#edf2f7");
  const subTextColor = useColorModeValue("#718096", "#a0aec0");

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
	console.log(isLoggedIn)
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsers([]);
    toast({
      title: "Logged out",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box bg={bgColor} borderBottom={`1px solid ${borderColor}`} shadow="sm">
      <Container maxW="6xl">
        <Flex align="center" justify="space-between" py={4} px={{ base: 2, md: 4 }}>
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

          <Flex align="center" gap={3}>
            <Button
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle color mode"
              size="sm"
            >
              {colorMode === "light" ? <IoMoon size={18} /> : <LuSun size={18} />}
            </Button>
            

            {!isLoggedIn ? (
              
                <AuthModal />
                
              
            ) : (
              <>
              <Button size="sm" onClick={handleLogout} colorScheme="red">
                Logout
              </Button>
              <CreateUserModal setUsers={setUsers} />
              </>
            )}
          </Flex>
        </Flex>
      </Container>

      
    </Box>
  );
};

export default Navbar;
