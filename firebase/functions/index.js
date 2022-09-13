const functions = require("firebase-functions");
const {RtcTokenBuilder, RtcRole} = require("agora-access-token");

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

exports.getTest2 = functions.https.onCall((data, context) => {
  console.log(data);
  return {
    message: "Hello from Firebase!",
  };
});

exports.generateToken = functions.https.onCall((data, context) => {
  let uid = data.uid;
  if (!uid || uid == "") {
    uid = 0;
  }
  let channelName = data.channel;
  if (!channelName || channelName == "") {
    channelName = "";
  }
  let role = RtcRole.SUBSCRIBER;
  if (data.role == "publisher") {
    role = RtcRole.PUBLISHER;
  }

  let expireTime = data.expireTime;
  if (!expireTime || expireTime == "") {
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime, 10);
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;
  const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      role,
      privilegeExpireTime
  );

  return {
    token: token,
  };
});
