import React, { useEffect, useState } from "react";
import { useInput } from "./hooks/useInput";
import { Api } from "./api";
import "./styles/CommentFeed.scss";
function CommentFeed(props) {
  const WEBSOCKET_URL = "ws://localhost:3001";
  const SERVER_URL = "http://localhost:3001";
  const socket = new WebSocket(WEBSOCKET_URL);

  //#region State
  const [commentList, setCommentList] = useState([]);
  const {
    value: name,
    setValue: setName,
    bind: bindName,
    errorStatus: NameErrorStatus,
    setErrorStatus: setNameErrorStatus,
  } = useInput("");

  const {
    value: comment,
    setValue: setComment,
    bind: bindComment,
    errorStatus: CommentErrorStatus,
    setErrorStatus: setCommentErrorStatus,
  } = useInput("");

  //#endregion State

  //#region functions

  useEffect(() => {
    socket?.addEventListener("connection", (event) => {
      console.log("Connected to Server");
    });
    socket.addEventListener("server", (event) => {
      console?.log("Message from Server: ", event.data);
    });
  });

  const handleSubmitComment = (e) => {
    //TODO:
  };

  //#endregion functions

  //#region components

  const CommentItem = ({ name, message, id, createdTime }) => {
    <div className="CommentItem">
      <p>{name}</p>
      <p>{message}</p>
      <p className="text-small">{createdTime}</p>
    </div>;
  };

  //#endregion components
  return (
    <div className="CommentFeed">
      <section>
        <h1 style={{ padding: ".5em 0" }}>Comments Feed</h1>
        <form
          id="SubmitComment"
          onSubmit={handleSubmitComment}
          className="comment"
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: ".5rem",
            padding: "6% 3%",
            backgroundColor: "var(--secondary-clr)",
            borderRadius: ".5rem",
          }}
        >
          <label htmlFor="name">
            <input
              className="comment-name"
              id="name"
              {...bindName}
              placeholder="What's your name?"
            ></input>
          </label>
          <label htmlFor="comment">
            <textarea
              type="text"
              className="comment-textfield"
              id="comment"
              {...bindComment}
              style={{ resize: "none", minHeight: "12rem" }}
              placeholder="What's on your mind?"
            />
          </label>

          <button
            style={{
              borderRadius: ".25rem",
              width: "100%",
              padding: ".75em 0",
              backgroundColor: "var(--tertiary-clr)",
              color: "var(--neutral-clr-02)",
            }}
            disabled={!name && !comment}
          >
            Post Comment
          </button>
        </form>

        <div
          className="comment-list"
          style={{
            width: "100%",
            minHeight: "var(--comment-section-height)",
            borderRadius: ".5rem",
            backgroundColor: "var(--secondary-clr)",
            color: "var(--neutral-clr-01)",
            margin: "4em 0 0 0",
          }}
        >
          {!commentList.length ? (
            <p
              style={{
                textAlign: "center",
                display: "flex",
                minHeight: "var(--comment-section-height)",
                color: "var(--neutral-clr-03)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              New comments will appear here...{" "}
            </p>
          ) : (
            <div></div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CommentFeed;
