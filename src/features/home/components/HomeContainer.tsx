import { useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Heading, Button, VStack, HStack, Stack, Text } from "@chakra-ui/react";
import { auth, db } from "../../../configs/firebase";
import { useAgora } from "../hooks/useAgora";
import { useRoom } from "../hooks/useRoom";
import { doc, updateDoc } from "firebase/firestore";
import { getChannelToken } from "../usecases/getChannelToken";

const options = {
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID as string,
  channel: "Test",
};

const HomeContainer = () => {
  const { client } = useAgora();
  const currentUser = auth.currentUser;
  const { room, isMentee, isMentor, isAuthenticated } = useRoom(
    options.channel,
    currentUser?.uid as string
  );
  const [isConnected, setIsConnected] = useState(false);

  const onClickJoin = async () => {
    if (!isAuthenticated()) {
      alert("入室する権限がありません");
      return;
    }

    const token = await getChannelToken(options.channel, currentUser!.uid);
    await client.join(options.appId, options.channel, token, currentUser?.uid);
    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await client.publish([localAudioTrack]);
    console.log("publish success!");
    setIsConnected(true);

    // チャンネルにジョインしたことを記録する
    const docRef = doc(db, "rooms", options.channel);
    if (isMentee) {
      await updateDoc(docRef, {
        mentee_joined_at: new Date(),
      });
    } else if (isMentor) {
      await updateDoc(docRef, {
        mentor_joined_at: new Date(),
      });
    }
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
          <Text>Channel: {options.channel}</Text>
          <Text>User: {currentUser.uid}</Text>
          {isMentee && <Text>Role: Mentee</Text>}
          {isMentor && <Text>Role: Mentor</Text>}
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
