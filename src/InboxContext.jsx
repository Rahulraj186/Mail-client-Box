// src/InboxContext.js

import React, { createContext, useReducer, useContext, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

const InboxContext = createContext();

const inboxReducer = (state, action) => {
  switch (action.type) {
    case "SET_MAILS":
      return {
        ...state,
        mails: action.payload,
      };
    case "MARK_AS_READ":
      return {
        ...state,
        mails: state.mails.map((mail) =>
          mail.id === action.payload.id ? { ...mail, read: true } : mail
        ),
      };
    default:
      return state;
  }
};

const initialState = {
  mails: [],
};

export const InboxProvider = ({ children }) => {
  const [state, dispatch] = useReducer(inboxReducer, initialState);

  useEffect(() => {
    const fetchMails = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "users", user.uid, "inbox"));
      const querySnapshot = await getDocs(q);
      const mailsData = [];
      querySnapshot.forEach((doc) => {
        mailsData.push({ id: doc.id, ...doc.data() });
      });
      dispatch({ type: "SET_MAILS", payload: mailsData });
    };

    fetchMails();
  }, []);

  const markAsRead = async (mailId) => {
    const user = auth.currentUser;
    if (!user) return;

    const mailDoc = doc(db, "users", user.uid, "inbox", mailId);
    await updateDoc(mailDoc, { read: true });

    dispatch({ type: "MARK_AS_READ", payload: { id: mailId } });
  };

  return (
    <InboxContext.Provider value={{ state, dispatch, markAsRead }}>
      {children}
    </InboxContext.Provider>
  );
};

export const useInbox = () => useContext(InboxContext);
