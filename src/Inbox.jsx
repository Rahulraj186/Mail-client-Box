// src/Inbox.js

import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";

const Inbox = () => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMails = async () => {
      setLoading(true);
      setError("");

      try {
        const user = auth.currentUser;

        if (!user) {
          setError("You need to be logged in to view your inbox.");
          setLoading(false);
          return;
        }

        const q = query(collection(db, "users", user.uid, "inbox"));
        const querySnapshot = await getDocs(q);

        const mailsData = [];
        querySnapshot.forEach((doc) => {
          mailsData.push({ id: doc.id, ...doc.data() });
        });

        setMails(mailsData);
      } catch (error) {
        setError("Failed to fetch mails: " + error.message);
      }

      setLoading(false);
    };

    fetchMails();
  }, []);

  return (
    <div>
      <h2>Inbox</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && mails.length === 0 && <p>No mails found.</p>}
      {!loading && !error && mails.length > 0 && (
        <ul>
          {mails.map((mail) => (
            <li key={mail.id}>
              <p>
                <strong>From:</strong> {mail.from}
              </p>
              <p>
                <strong>Subject:</strong> {mail.subject}
              </p>
              <p>
                <strong>Body:</strong> {mail.body}
              </p>
              <p>
                <strong>Received:</strong> {mail.timestamp}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inbox;
