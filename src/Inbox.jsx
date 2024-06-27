// src/Inbox.js

import React from "react";
import { useInbox } from "./InboxContext";

const Inbox = () => {
  const { state, markAsRead } = useInbox();

  const handleMailClick = (mail) => {
    if (!mail.read) {
      markAsRead(mail.id);
    }
    alert(`From: ${mail.from}\nSubject: ${mail.subject}\n\n${mail.body}`);
  };

  const unreadCount = state.mails.filter((mail) => !mail.read).length;

  return (
    <div>
      <h2>Inbox</h2>
      <p>Total Unread Messages: {unreadCount}</p>
      {state.mails.length === 0 ? (
        <p>No mails found.</p>
      ) : (
        <ul>
          {state.mails.map((mail) => (
            <li
              key={mail.id}
              onClick={() => handleMailClick(mail)}
              style={{ cursor: "pointer", color: mail.read ? "black" : "blue" }}
            >
              {!mail.read && <span style={{ color: "blue" }}>• </span>}
              <span>{mail.subject}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inbox;
