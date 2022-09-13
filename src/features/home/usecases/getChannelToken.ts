import { httpsCallable } from "firebase/functions";
import { functions } from "../../../configs/firebase";

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

export const getChannelToken = async (channel: string, uid: string) => {
  const response = await generateToken({
    channel: channel,
    uid: uid,
  });
  const data = response.data;
  return data.token;
};
