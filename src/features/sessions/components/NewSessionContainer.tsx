import { auth } from "../../../configs/firebase"
import { signInAnonymously } from "firebase/auth";
import { Heading, Button, VStack } from "@chakra-ui/react";

export const NewSessionContainer = () => {
  const signIn = async () => {
    signInAnonymously(auth)
      .then(() => {
        console.log("signInAnonymously");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
      <VStack spacing="10">
        <Heading as="h1">New Session</Heading>
        <Button onClick={signIn}>LOGIN</Button>
      </VStack>
    </>
  );
};
