import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiUserPlus } from "react-icons/bi";
import { BASE_URL } from "../App";

const AddFriendModal = ({ setUsers }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [friendId, setFriendId] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();

	const handleAddFriend = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		const token = localStorage.getItem("access_token");
		if (!token) {
			toast({
				status: "error",
				title: "No token found",
				description: "Please login again.",
			});
			setIsLoading(false);
			return;
		}
		if (!friendId || isNaN(friendId) || parseInt(friendId) <= 0) {
			toast({
				status: "error",
				title: "Invalid Friend ID",
				description: "Please enter a valid user ID.",
			});
			setIsLoading(false);
			return;
		}

		try {
			const res = await fetch(`${BASE_URL}/friend-request/${friendId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");

			toast({
				status: "success",
				title: "Friend Request Sent",
				description: data.message || "Friend added successfully.",
				duration: 2000,
				position: "top",
			});

			setFriendId("");
			onClose();
			

			
			setUsers((prev) => [...prev]); 

		} catch (error) {
			toast({
				status: "error",
				title: "Error",
				description: error.message,
				duration: 4000,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Button onClick={onOpen}>
				<BiUserPlus></BiUserPlus>
			</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<form onSubmit={handleAddFriend}>
					<ModalContent>
						<ModalHeader>Send Friend Request</ModalHeader>
						<ModalCloseButton />

						<ModalBody pb={6}>
							<FormControl>
								<FormLabel>Friend ID</FormLabel>
								<Input
									placeholder="Enter Friend's User ID"
									type="number"
									value={friendId}
									onChange={(e) => setFriendId(e.target.value)}
									required
								/>
							</FormControl>
						</ModalBody>

						<ModalFooter>
							<Button colorScheme="blue" mr={3} type="submit" isLoading={isLoading}>
								Send
							</Button>
							<Button onClick={onClose}>Cancel</Button>
						</ModalFooter>
					</ModalContent>
				</form>
			</Modal>
		</>
	);
};

export default AddFriendModal;
