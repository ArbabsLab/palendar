import { Center, Grid, Spinner, Text, Fade } from "@chakra-ui/react";
import UserCard from "./UserCard";
import { useEffect, useState } from "react";
import { BASE_URL } from "../App";

const UserGrid = ({ users, setUsers }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [expandedUserId, setExpandedUserId] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(BASE_URL + "/friends", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch contacts");
        setUsers(data);
      } catch (error) {
        console.error(error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    getUsers();
  }, [setUsers]);

  const toggleExpand = (id) => {
    setExpandedUserId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {isLoading ? (
        <Center minH="200px">
          <Spinner size="xl" />
        </Center>
      ) : users.length === 0 ? (
        <Center minH="200px">
          <Text fontSize="xl" color="gray.600">
            <Text as="span" fontSize="2xl" fontWeight="bold" mr={2}>
              Empty
            </Text>
            No contacts found.
          </Text>
        </Center>
      ) : (
        <Fade in={!isLoading}>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                setUsers={setUsers}
                isExpanded={expandedUserId === user.id}
                onToggle={() => toggleExpand(user.id)}
              />
            ))}
          </Grid>
        </Fade>
      )}
    </>
  );
};

export default UserGrid;
