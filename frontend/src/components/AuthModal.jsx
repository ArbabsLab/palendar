import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast,
  useColorModeValue,
  Link,
  Avatar,
  Text,
  Textarea,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { BiUserPlus } from "react-icons/bi";
import { BASE_URL } from "../App";

const AuthModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    name: "",
    role: "",
    description: "",
    gender: "",
    img_url: "",
  });

  const bgColor = useColorModeValue("#ffffff", "#2d3748");
  const borderColor = useColorModeValue("#e2e8f0", "#4a5568");
  const textColor = useColorModeValue("#2c5282", "#edf2f7");
  const subTextColor = useColorModeValue("#718096", "#a0aec0");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? `${BASE_URL}/login` : `${BASE_URL}/signup`;

    try {
      setLoading(true);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        toast({
          title: `${isLogin ? "Login" : "Signup"} successful`,
          status: "success",
          duration: 3000,
          position: "top",
        });
        onClose();
        setInputs({
          username: "",
          password: "",
          name: "",
          role: "",
          description: "",
          gender: "",
          img_url: "",
        });

        
      }
      window.location.reload();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 3000,
        position: "top",
      });
    } finally {
      setLoading(false);
    }

    
  };

  return (
    <>
      <Button leftIcon={<BiUserPlus />} colorScheme="teal" onClick={onOpen}>
        {isLogin ? "Log In" : "Sign Up"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent bg={bgColor} border="1px solid" borderColor={borderColor}>
            <ModalHeader>
              <Flex align="center" gap={3}>
                <Avatar bg="teal.500" />
                <Text fontSize="lg" color={textColor}>
                  {isLogin ? "Welcome Back" : "Create Account"}
                </Text>
              </Flex>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color={textColor}>Username</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FaUserAlt color={subTextColor} />
                    </InputLeftElement>
                    <Input
                      placeholder="Username"
                      value={inputs.username}
                      onChange={(e) =>
                        setInputs((prev) => ({ ...prev, username: e.target.value }))
                      }
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FaLock color={subTextColor} />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={inputs.password}
                      onChange={(e) =>
                        setInputs((prev) => ({ ...prev, password: e.target.value }))
                      }
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShowPassword((s) => !s)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                {!isLogin && (
                  <>
                    <FormControl isRequired>
                      <FormLabel color={textColor}>Name</FormLabel>
                      <Input
                        placeholder="Full Name"
                        value={inputs.name}
                        onChange={(e) =>
                          setInputs((prev) => ({ ...prev, name: e.target.value }))
                        }
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color={textColor}>Role</FormLabel>
                      <Input
                        placeholder="Role"
                        value={inputs.role}
                        onChange={(e) =>
                          setInputs((prev) => ({ ...prev, role: e.target.value }))
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color={textColor}>Description</FormLabel>
                      <Textarea
                        placeholder="Describe yourself"
                        value={inputs.description}
                        onChange={(e) =>
                          setInputs((prev) => ({ ...prev, description: e.target.value }))
                        }
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color={textColor}>Gender</FormLabel>
                      <Select
                        placeholder="Select gender"
                        value={inputs.gender}
                        onChange={(e) =>
                          setInputs((prev) => ({ ...prev, gender: e.target.value }))
                        }
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel color={textColor}>Image URL</FormLabel>
                      <Input
                        placeholder="Profile Image URL (optional)"
                        value={inputs.img_url}
                        onChange={(e) =>
                          setInputs((prev) => ({ ...prev, img_url: e.target.value }))
                        }
                      />
                    </FormControl>
                  </>
                )}
              </Stack>
            </ModalBody>

            <ModalFooter justifyContent="space-between">
              <Text fontSize="sm" color={subTextColor}>
                {isLogin ? "New to us?" : "Already have an account?"}{" "}
                <Link
                  color={textColor}
                  fontWeight="medium"
                  onClick={() => setIsLogin(!isLogin)}
                  cursor="pointer"
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </Link>
              </Text>
              <Button
                colorScheme="teal"
                type="submit"
                isLoading={loading}
                loadingText={isLogin ? "Logging in" : "Signing up"}
              >
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default AuthModal;
