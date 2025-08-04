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
	Radio,
	RadioGroup,
	Textarea,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { BASE_URL } from "../App";

const CreateUserModal = ({ setUsers }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isLoading, setIsLoading] = useState(false);
	const [inputs, setInputs] = useState({
		name: "",
		role: "",
		description: "",
		gender: "",
	});
	const toast = useToast();

	const handleCreateUser = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		const token = localStorage.getItem("access_token"); // ✅ Retrieve token

		try {
			const res = await fetch(`${BASE_URL}/friends`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // ✅ Send token
				},
				body: JSON.stringify(inputs),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");

			toast({
				status: "success",
				title: "Contact Added",
				description: "Contact created successfully.",
				duration: 2000,
				position: "top",
			});

			onClose();
			setUsers((prev) => [...prev, data]);

			setInputs({
				name: "",
				role: "",
				description: "",
				gender: "",
			});
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
				<BiAddToQueue size={20} />
			</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<form onSubmit={handleCreateUser}>
					<ModalContent>
						<ModalHeader>Contact Info</ModalHeader>
						<ModalCloseButton />

						<ModalBody pb={6}>
							<Flex alignItems={"center"} gap={4}>
								<FormControl>
									<FormLabel>Full Name</FormLabel>
									<Input
										placeholder='Lionel Messi'
										value={inputs.name}
										onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
									/>
								</FormControl>

								<FormControl>
									<FormLabel>Role</FormLabel>
									<Input
										placeholder='Soccer Player'
										value={inputs.role}
										onChange={(e) => setInputs({ ...inputs, role: e.target.value })}
									/>
								</FormControl>
							</Flex>

							<FormControl mt={4}>
								<FormLabel>Description</FormLabel>
								<Textarea
									resize='none'
									placeholder="He's a soccer player who loves to score goals."
									value={inputs.description}
									onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
								/>
							</FormControl>

							<FormControl mt={4}>
								<FormLabel>Gender</FormLabel>
								<RadioGroup
									value={inputs.gender}
									onChange={(val) => setInputs({ ...inputs, gender: val })}
								>
									<Flex gap={5}>
										<Radio value='male'>Male</Radio>
										<Radio value='female'>Female</Radio>
									</Flex>
								</RadioGroup>
							</FormControl>
						</ModalBody>

						<ModalFooter>
							<Button colorScheme='blue' mr={3} type='submit' isLoading={isLoading}>
								Add
							</Button>
							<Button onClick={onClose}>Cancel</Button>
						</ModalFooter>
					</ModalContent>
				</form>
			</Modal>
		</>
	);
};

export default CreateUserModal;
