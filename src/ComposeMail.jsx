// src/ComposeMail.js

import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth } from "./firebase";

const ComposeMail = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const db = getFirestore();
  const quillRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!to || !subject || !body) {
      setError("All fields are required.");
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        setError("You need to be logged in to send emails.");
        return;
      }

      const emailData = {
        to,
        subject,
        body,
        from: user.email,
        timestamp: new Date().toISOString(),
      };

      // Add to sender's sent emails
      await addDoc(collection(db, "users", user.uid, "sent"), emailData);

      // Add to receiver's inbox
      const q = query(collection(db, "users"), where("email", "==", to));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const receiverDoc = querySnapshot.docs[0];
        await addDoc(
          collection(db, "users", receiverDoc.id, "inbox"),
          emailData
        );
      }

      setSuccess("Email sent successfully!");
      setTo("");
      setSubject("");
      setBody("");
      if (quillRef.current) {
        quillRef.current.getEditor().setText("");
      }
    } catch (error) {
      setError("Failed to send email: " + error.message);
    }
  };

  return (
    <div>
      <h2>Compose Mail</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>To:</label>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Body:</label>
          <ReactQuill
            ref={quillRef}
            value={body}
            onChange={setBody}
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ size: [] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [
                  { list: "ordered" },
                  { list: "bullet" },
                  { indent: "-1" },
                  { indent: "+1" },
                ],
                ["link", "image", "video"],
                ["clean"],
              ],
            }}
            formats={[
              "header",
              "font",
              "size",
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              "list",
              "bullet",
              "indent",
              "link",
              "image",
              "video",
            ]}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ComposeMail;
