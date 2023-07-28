import { Box, Button, Flex, Input, VStack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import * as Yup from "yup";
import { Field, ErrorMessage, Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import Axios from "axios";
import { setValue } from "../../redux/userSlice";
import { useNavigate } from "react-router";

export const AdminLogin = () => {
    const toast = useToast();
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [success, setSuccess] = useState();
    const loginSchema = Yup.object().shape({
        username: Yup.string()
            .required("Username is required"),
        password: Yup.string()
            .required("Password is required")
            .min(6, "Paasowrd min 6 ")
            .matches(/^(?=.*[A-Z])/, "Password Must Contain 1 Capital")
            .matches(/^(?=.*(\W|_))/, "Password Must Contain 1 Symbol")
            .matches(/.*[0-9].*/, "Password Must Contain 1 number")
    });
    const handleSubmit = async (data1) => {
        try {
            const response = await Axios.post("http://localhost:8000/api/users/login", data1);
            console.log(response.data);
            dispatch(setValue(response.data));
            localStorage.setItem("token", response.data.token);
            setSuccess(true);
            setTimeout(() => {
                navigate("/cashierlist");
            }, 1000)
            toast({
                title: "Welcome!",
                description: "Login Succses!",
                status: 'success',
                duration: 2500,
                isClosable: true,
                position: "top"
            });
            console.log(data1);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={(value, action) => {
                handleSubmit(value);
                if (success) action.resetForm();
            }}>
            {(props) => {
                return (
                    <Box as={Form}>
                        <Flex justifyContent={"center"}>
                            <VStack>
                                <Field as={Input} name="username" w={{ base: '180px', md: '400px', lg: '400px' }} placeholder="Username" size={"md"} variant={"flushed"} color={"black"} borderBottom={"2px solid"} borderColor={"#D5AD18"} />
                                <ErrorMessage component="box" name="username" style={{ color: "red", marginTop: "-8px" }} />
                            </VStack>
                        </Flex>
                        <Flex ml={{ base: '33px', md: '30px', lg: '30px' }} mt={"10px"} justifyContent={"center"}>
                            <VStack>
                                <Field as={Input} name="password" w={{ base: '180px', md: '400px', lg: '400px' }} placeholder="Password" size={"md"} type={show ? 'text' : 'password'} variant={"flushed"} color={"black"} borderBottom={"2px solid"} borderColor={"#D5AD18"} />
                                <ErrorMessage
                                    component="box"
                                    name="password"
                                    style={{ color: "red", marginBottom: "-18px", marginTop: "-8px" }} />
                            </VStack>
                            <Button right={"30px"} variant={"unstyled"} size='sm' onClick={handleClick}>
                                {show ? <ViewIcon /> : <ViewOffIcon />}
                            </Button>
                        </Flex>
                        <Flex mt={"30px"} justifyContent={"center"}>
                            <Button isDisabled={!props.dirty} type="submit" fontFamily={"Times New Roman"} boxShadow='0px 0px 6px black' color={"black"} bgGradient="linear(#FFEA61, #FFC900)" w={"200px"}>
                                Login
                            </Button>
                        </Flex>
                    </Box>
                );
            }}
        </Formik>
    );
}