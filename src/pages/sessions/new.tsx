import type { NextPage } from "next";
import Head from "next/head";
import { Heading, Button, VStack } from "@chakra-ui/react";
import { auth } from "../../configs/firebase";
import { signInAnonymously } from "firebase/auth";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SessionNew: NextPage = () => {
  const router = useRouter();
  const { isLogin } = useAuth();

  useEffect(() => {
    if (isLogin) {
      router.replace("/");
    }
  }, [isLogin, router]);

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
      <Head>
        <title>New Session</title>
      </Head>
      <VStack spacing="10">
        <Heading as="h1">New Session</Heading>
        <Button onClick={signIn}>LOGIN</Button>
      </VStack>
    </>
  );
};

export default SessionNew;
