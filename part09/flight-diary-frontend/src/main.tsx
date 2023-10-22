import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

interface WelcomeProps {
  name: string;
}

const Welcome = ({ name }: WelcomeProps) => {
  return <h1>Hello, {name}</h1>;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <Welcome name="sarah" />
    <App />
  </>
);
