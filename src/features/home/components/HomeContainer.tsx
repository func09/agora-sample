import { useEffect, useState } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../../configs/firebase";
import { Heading, Button, VStack, HStack, Stack, Text } from "@chakra-ui/react";
import { auth } from "../../../configs/firebase";
import { useAgora } from "../hooks/useAgora";

const options = {
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID as string,
  channel: "Test",
};

type GenerateTokenRequest = {
  channel: string;
  uid: string;
};

type GenerateTokenResponse = {
  token: string;
};

const generateToken = httpsCallable<
  GenerateTokenRequest,
  GenerateTokenResponse
>(functions, "generateToken");

const HomeContainer = () => {
  const { client } = useAgora();
  const currentUser = auth.currentUser;
  const [isConnected, setIsConnected] = useState(false);

  const getChannelToken = async (channel: string, uid: string) => {
    const response = await generateToken({ channel: options.channel, uid: uid });
    const data = response.data;
    return data.token;
  };

  const onClickJoin = async () => {
    const token = await getChannelToken(options.channel, currentUser!.uid);
    await client.join(options.appId, options.channel, token, currentUser?.uid);
    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await client.publish([localAudioTrack]);
    console.log("publish success!");
    setIsConnected(true);
  };

  const onClickLeave = async () => {
    client.localTracks.forEach((v) => v.close());
    await client.leave();
    setIsConnected(false);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <VStack>
        <Heading>Voice Chat</Heading>
        <Stack>
          <Text>User: {currentUser.uid}</Text>
        </Stack>
        <HStack>
          {isConnected ? (
            <Button onClick={onClickLeave}>LEAVE</Button>
          ) : (
            <Button onClick={onClickJoin}>JOIN</Button>
          )}
        </HStack>
      </VStack>
    </>
  );
};

export default HomeContainer;
