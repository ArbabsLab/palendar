import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Text,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { BiTrash } from "react-icons/bi";
import EditModal from "./EditModal";
import { BASE_URL } from "../App";

const UserCard = ({ user, setUsers }) => {
  const toast = useToast();

  // const bg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.300");

  const bg = useColorModeValue("#ffffff", "#2d3748"); // white / deep blue-gray
	//const textColor = useColorModeValue("#2c5282", "#edf2f7"); // rich blue / soft white

  const handleDeleteUser = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(BASE_URL + "/friends/" + user.id, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
      toast({
        status: "success",
        title: "Contact Deleted",
        description: "Contact deleted successfully.",
        duration: 2000,
        position: "top-center",
      });
    } catch (error) {
      toast({
        title: "An error occurred",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-center",
      });
    }
  };

  return (
	<Box role="group">
    <Card
      bg={bg}
      cursor="pointer"
      transition="all 0.2s ease-in-out"
      _hover={{
		transform: "scale(1.05) translateY(-5px)",
        shadow: "md",
        bg: hoverBg,
      }}
    >
      <CardHeader>
        <Flex gap={4} align="center" justify="space-between">
          <Flex flex="1" gap="4" align="center">
            <Avatar src={user.imgUrl} />
            <Box>
              <Heading size="sm">{user.name}</Heading>
              <Text color="gray.500" fontSize="sm">
                {user.role}
              </Text>
            </Box>
          </Flex>

          <Flex onClick={(e) => e.stopPropagation()} gap={1}>
            <EditModal user={user} setUsers={setUsers} />
            <IconButton
              variant="ghost"
              colorScheme="red"
              size="sm"
              aria-label="Delete contact"
              icon={<BiTrash size={20} />}
              onClick={handleDeleteUser}
            />
          </Flex>
        </Flex>
      </CardHeader>

      <CardBody pt={0}>
        <Text
          fontSize="sm"
          color={textColor}
          transition="opacity 0.2s ease-in-out"
          opacity={0}
          _groupHover={{ opacity: 1 }}
        >
          {user.description}
        </Text>
      </CardBody>
    </Card>
	</Box>
  );
};

export default UserCard;
