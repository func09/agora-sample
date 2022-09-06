import { useEffect, useState } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../../configs/firebase";

const options = {
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID as string,
  channel: "Test",
};

type GenerateTokenRequest = {
  channel: string;
}

type GenerateTokenResponse = {
  token: string;
}

const generateToken = httpsCallable<GenerateTokenRequest,GenerateTokenResponse>(functions, "generateToken");


const HomeContainer = () => {
  let client: IAgoraRTCClient;
  let localAudioTrack: IMicrophoneAudioTrack;

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
    setupAgora();
  }, []);

  const getChannelToken = async () => {
    const response = await generateToken({channel: options.channel});
    const data = response.data;
    return data.token;
  }

  const onClickJoin = async () => {
    const token = await getChannelToken();
    await client.join(options.appId, options.channel, token);
    localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await client.publish([localAudioTrack]);
    console.log("publish success!");
  };

  const onClickLeave = async () => {
    localAudioTrack.close();
    await client.leave();
  };

  return (
    <>
      <div>
        <h1>Home</h1>
        <button onClick={onClickJoin}>JOIN</button>
        <button onClick={onClickLeave}>LEAVE</button>
      </div>
    </>
  );
};

export default HomeContainer;
