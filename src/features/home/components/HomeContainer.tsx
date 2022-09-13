import { useEffect, useState } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../../configs/firebase";
import { Heading, Button, VStack, HStack, Stack, Text } from "@chakra-ui/react";
import { auth } from "../../../configs/firebase";

const options = {
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID as string,
  channel: "Test",
};

type GenerateTokenRequest = {
  channel: string;
};

type GenerateTokenResponse = {
  token: string;
};

const generateToken = httpsCallable<
  GenerateTokenRequest,
  GenerateTokenResponse
>(functions, "generateToken");

let client: IAgoraRTCClient;

const HomeContainer = () => {
  const currentUser = auth.currentUser;
  const [isConnected, setIsConnected] = useState(false);

  const setupAgora = async () => {
    client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      console.log("subscribe success", user, mediaType);

      if (mediaType === "audio") {
        // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
        const remoteAudioTrack = user.audioTrack;
        if (remoteAudioTrack) {
          remoteAudioTrack.play();
        }
      }
      client.on("user-unpublished", async (user) => {
        // Unsubscribe from the tracks of the remote user.
        await client.unsubscribe(user);
      });
      client.on("user-joined", async (user) => {
        alert(`User joined: ${user.uid}`);
        console.log("user-joined", user);
      });
      client.on("user-left", async (user) => {
        alert(`User left: ${user.uid}`);
        console.log("user-left", user);
      });
    });
  };

  useEffect(() => {
    console.log("SETUP AGORA");
    setupAgora();
  }, []);

  const getChannelToken = async () => {
    const response = await generateToken({ channel: options.channel });
    const data = response.data;
    return data.token;
  };

  const onClickJoin = async () => {
    const token = await getChannelToken();
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
