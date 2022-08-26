import { format } from "date-fns";
import React, { useEffect, useState, useRef } from "react";
import { Api } from "../api";
import { useInput } from "../hooks/useInput";
import "./../styles/CommentFeed.scss";

function CommentFeed(props) {
  let socketRef = useRef(new WebSocket(Api.COMMENT_SOCKET_URL));
  const clientIdRef = useRef(self.crypto.randomUUID());

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

  const [success, setSuccess] = useState(false);

  const isButtonDisabled = !name || !comment;

  //#endregion State

  //#region actions

  useEffect(() => {
    try {
      Api.delete(Api.REST_SERVER_URL + Api.routes.deleteComments);
      Api.get(`${Api.REST_SERVER_URL + Api.routes.getComments}`)
        .then((res) => {
          console.log("got: ", res);
          setCommentList(res);
        })
        .catch((error) => console.log(error));

      socketRef.current.addEventListener("open", (event) => {
        console.log("Sersver connection open");
        socketRef.current.send("Hello this is: " + clientIdRef.current);
      });

      socketRef.current.addEventListener("message", (event) => {
        console?.log("Message from Server: ", event?.data);
        let data = JSON.parse(event?.data);
        if (data?.type === "newComment") {
          console?.log("Data is ", data);
          Api.get(`${Api.REST_SERVER_URL + Api.routes.getComment}`, { id: data?.id })
            .then((res) => {
              console.log("got: ", res);
              setCommentList((list) => list.unshift(res));
            })
            .catch((error) => console.log(error));
        }
      });
    } catch (e) {
      console.log(e);
    }
  }, [socketRef, socketRef.current]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    //TODO: do better form validation
    if (!name || !comment) return;

    try {
      Api.post(`${Api.REST_SERVER_URL + Api.routes.createComment}`, {
        name: name,
        message: comment,
      })
        .then(
          (res) => console.log("res of creation: ", res)
          // setCommentList((list) =>
          //   Api.get(`${Api.REST_SERVER_URL + Api.routes.getComment}`, { id: res?.id }).then(
          //     (comment) => list.push(comment)
          //   )
          // )
        )
        .catch((e) => console.log(e));

      // Api.get(`${Api.REST_SERVER_URL + Api.routes.getComment}`).then((res) => {
      //   console.log("Get results: ", res);
      //   setCommentList(res);
      // });
      // const data = response.json();
      // const data = await response.json();
      // console.log("data: ", data);
    } catch (error) {
      console.log(error);
    }
  };

  //#endregion actions

  //#region components

  function CommentItem(comment = { name, message, id, created }) {
    // console.log(new Date(comment.created.split(" "[0])));
    return (
      <div
        className="CommentItem"
        key={comment.id}
        style={{
          backgroundColor: "var(--neutral-clr-02)",
          borderRadius: ".25rem",
          minHeight: "12rem",
          maxWidth: " 18rem",
          padding: ".75em",
          // boxShadow: ""
        }}
      >
        <p style={{ fontSize: "var(--font-05)" }}>"{comment.message}"</p>
        <p className="text-small">
          {comment.name + " posted on " + format(new Date(comment?.created), "PPpp")}
        </p>
      </div>
    );
  }

  //#endregion components
  return (
    <div className="CommentFeed">
      <div>
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
            disabled={isButtonDisabled}
            type="submit"
            style={{
              borderRadius: ".25rem",
              width: "100%",
              padding: ".75em 0",
              backgroundColor: "var(--tertiary-clr)",
              color: "var(--neutral-clr-02)",
            }}
          >
            Post Comment
          </button>
        </form>
      </div>

      <div
        className="comment-list"
        style={{
          width: "min(100%, 80rem)",
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
              fontSize: "var(--font-04)",
            }}
          >
            New comments will appear here...{" "}
          </p>
        ) : (
          <div className="comment-list-ctn">
            {commentList?.map((comment) => {
              return <CommentItem {...comment} key={comment.id} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentFeed;
