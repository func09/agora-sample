import AgoraRTC, {
  IAgoraRTCClient,
} from "agora-rtc-sdk-ng";
import { useEffect, useState} from 'react';

let client: IAgoraRTCClient;
export const useAgora = () => {
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

  return {
    client,
  };
}
