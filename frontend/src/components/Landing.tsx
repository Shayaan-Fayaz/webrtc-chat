import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Room } from "./Room"

export const Landing = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);

  if (!joined) {
    return (
      <>
        <input
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <button
          onClick={() => {
            setJoined(true)
          }}
        >
          Join
        </button>
      </>
    );
  }

  return <Room name={name}/>
};
