import React, { useEffect, useState } from "react";
import "./styles/CommentFeed.scss";
function CommentFeed(props) {
  const { name } = props;
  const socket = new WebSocket("ws://localhost:3001");
  useEffect(() => {
    socket?.addEventListener("connection", (event) => {
      console.log("Connected to Server");
    });
    socket.addEventListener("server", (event) => {
      console?.log("Message from Server: ", event.data);
    });
  });

  return (
    <div className="CommentFeed">
      <h1>Comments Feed</h1>
    </div>
  );
}

export default CommentFeed;
