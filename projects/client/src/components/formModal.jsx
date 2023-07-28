import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, Input, FormControl, FormLabel, useToast, } from '@chakra-ui/react';
import Axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRef, useState } from 'react'
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";


export default function InitialFocus() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = useRef(null);
    const finalRef = useRef(null);
    const [file, setFile] = useState(null);
    const toast = useToast();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const Formschema = Yup.object().shape(({
        username: Yup.string()
            .required("Write your name"),
        email: Yup.string()
            .email("Invalid email addres format")
            .required("Write your Email"),
        password: Yup.string()
            .required("Password is required")
            .min(6, "Paasowrd min 6 ")
            .matches(/^(?=.*[A-Z])/, "Password Must Contain 1 Capital")
            .matches(/^(?=.*(\W|_))/, "Password Must Contain 1 Symbol")
            .matches(/.*[0-9].*/, "Password Must Contain 1 number"),
        file: Yup.string()
            .required("Add image"),
    }));
    const handleCreate = async (value) => {
        try {
            const data = new FormData();
            const { username, email, password } = value;
            data.append("data", JSON.stringify({ username, email, password, file }));
            data.append("file", file);
            const response = await Axios.post("http://localhost:8000/api/users/register", data, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                "content-Type": "Multiple/form-data"
            });
            toast({
                title: "New Cashier!",
                description: "Your Cashier Data uploaded!",
                status: 'success',
                duration: 1500,
                isClosable: true,
                position: "top"
            });
            navigate("/cashierlist");
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            <Button bg={"#FFC900"} w={"200px"} onClick={onOpen}>Add Cashier</Button>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose} >
                <ModalOverlay />
                <ModalContent borderRadius={"10px"}>
                    <ModalHeader borderTopRadius={"10px"} bg={"#FFC900"}>Create your account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input ref={initialRef} placeholder='Username' />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Email</FormLabel>
                            <Input placeholder='Email' />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Password</FormLabel>
                            <Input placeholder='Password' />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}