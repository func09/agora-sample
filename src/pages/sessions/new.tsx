import type { NextPage } from "next";
import Head from "next/head";
import { Heading, Button, VStack } from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { NewSessionContainer } from '../../features/sessions/components/NewSessionContainer'

const SessionNew: NextPage = () => {
  const router = useRouter();
  const { isLogin } = useAuth();

  useEffect(() => {
    if (isLogin) {
      router.replace("/");
    }
  }, [isLogin, router]);

  return (
    <>
      <Head>
        <title>New Session</title>
      </Head>
      <NewSessionContainer />
    </>
  );
};

export default SessionNew;
