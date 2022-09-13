import { auth, db } from "../../../configs/firebase";
import { getDoc, query, doc, DocumentData, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from "react";

export const useRoom = (channelName: string, uid: string) => {
  const [room, setRoom] = useState<DocumentData>();
  const [isMentee, setIsMentee] = useState(false);
  const [isMentor, setIsMentor] = useState(false);

  useEffect(() => {
    const getRoom = async () => {
      const docRef = doc(db, "rooms", channelName);
      const docSnap = await getDoc(docRef);
      setRoom(docSnap.data());
    }
    getRoom();
  }, [channelName]);

  useEffect(() => {
    room && room.mentee_id === uid ? setIsMentee(true) : setIsMentee(false);
    room && room.mentor_id === uid ? setIsMentor(true) : setIsMentor(false);
  }, [room, uid])

  const isAuthenticated = () => {
    return isMentee || isMentor;
  }

  return {
    room,
    isMentee,
    isMentor,
    isAuthenticated,
  }
  
}
