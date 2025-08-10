import {
	Button,
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	useToast,
	Text,
	Box,
	Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { BASE_URL } from "../App";

const FriendRequestModal = ({ setUsers }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(false);
	const toast = useToast();

	const fetchRequests = async () => {
		const token = localStorage.getItem("access_token");
		if (!token) return;

		try {
			setLoading(true);
			const res = await fetch(`${BASE_URL}/friend-requests/pending`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to load requests");
			setRequests(data);
		} catch (err) {
			toast({
				status: "error",
				title: "Error fetching requests",
				description: err.message,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleRespond = async (id, action) => {
		const token = localStorage.getItem("access_token");
		if (!token) return;

		try {
			const res = await fetch(
				`${BASE_URL}/friend-request/${id}${action === "accept" ? "/accept" : ""}`,
				{
					method: action === "accept" ? "PUT" : "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to respond");

			toast({
				status: "success",
				title: `Request ${action === "accept" ? "accepted" : "rejected"}`,
				description: data.message,
			});

			setRequests((prev) => prev.filter((r) => r.requestId !== id));
			if (action === "accept") {
				setUsers((prev) => [...prev]); 
				window.location.reload();
			}
		} catch (err) {
			toast({
				status: "error",
				title: "Error",
				description: err.message,
			});
		}
	};

	useEffect(() => {
		if (isOpen) fetchRequests();
	}, [isOpen]);

	return (
		<>
			<Button onClick={onOpen}>
				<FaUserFriends />
			</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Pending Friend Requests</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{loading ? (
							<Spinner />
						) : requests.length === 0 ? (
							<Text>No pending requests.</Text>
						) : (
							requests.map((req) => (
								<Box
									key={req.requestId}
									borderWidth="1px"
									borderRadius="md"
									p="4"
									mb="3"
								>
									<Text mb="2">
										<b>{req.from.name}</b> ({req.from.username})
									</Text>
									<Flex gap="3">
										<Button
											colorScheme="green"
											onClick={() => handleRespond(req.requestId, "accept")}
										>
											Accept
										</Button>
										<Button
											colorScheme="red"
											onClick={() => handleRespond(req.requestId, "reject")}
										>
											Reject
										</Button>
									</Flex>
								</Box>
							))
						)}
					</ModalBody>
					<ModalFooter>
						<Button onClick={onClose}>Close</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default FriendRequestModal;
