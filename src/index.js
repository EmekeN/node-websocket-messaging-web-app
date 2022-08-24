import React from "react";
import * as ReactDOM from "react-dom/client";
import CommentFeed from "./CommentFeed";
import "./styles/base.scss";

const root = ReactDOM.createRoot(window.document.getElementById("CommentFeed"));
console.log("rendering root");
root.render(<CommentFeed />);
