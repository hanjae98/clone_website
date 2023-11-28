import "./App.css";
import gptLogo from "./assets/chatgpt.svg";
import addBtn from "./assets/add-30.png";
import msgIcon from "./assets/message.svg";
import home from "./assets/home.svg";
import saved from "./assets/bookmark.svg";
import rocket from "./assets/rocket.svg";
import sendBtn from "./assets/send.svg";
import userIcon from "./assets/user-icon.png";
import gptImgLogo from "./assets/chatgptLogo.svg";
import { sendMsgToOpenAI } from "./openai";
import { useEffect, useRef, useState } from "react";
function App() {
  const [idx, setIdx] = useState(1);
  const scenarios = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "hello, moto1",
    "hello, world!2",
  ];
  const msgEnd = useRef(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: scenarios[0],
      isBot: true,
    },
  ]);
  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [messages]);

  const handleSend = async () => {
    const text = input;
    setInput("");
    setMessages([
      ...messages,
      { text: input, isBot: false },
      { text: "thinking...", isBot: true },
    ]);

    setTimeout(async () => {
      if (idx < scenarios.length) {
        setMessages([
          ...messages,
          { text: text, isBot: false },
          { text: scenarios[idx], isBot: true },
        ]);
        setIdx(idx + 1);
      } else {
        const res = await sendMsgToOpenAI(input);
        setMessages([
          ...messages,
          { text, isBot: false },
          { text: res, isBot: true },
        ]);
      }
    }, 600);
  };

  const handleEnter = async (e) => {
    if (e.key === "Enter") await handleSend();
  };

  const handleQuery = async (e) => {
    const text = e.target.value;
    setMessages([...messages, { text, isBot: false }]);
    const res = await sendMsgToOpenAI(input);
    setMessages([
      ...messages,
      { text, isBot: false },
      { text: res, isBot: true },
    ]);
  };

  return (
    <div className="App">
      <div className="App">
        <div className="sideBar">
          <div className="upperSide">
            <div className="upperSideTop">
              <img src={gptLogo} alt="Logo" className="logo" />
              <span className="brand">ChatGPT</span>
              <button
                className="midBtn"
                onClick={() => window.location.reload()}
              >
                <img src={addBtn} alt="new chat" className="addBtn" />
                New Chat
              </button>
              <div className="upperSideBottom">
                <button
                  className="query"
                  onClick={handleQuery}
                  value={"What is Programming ?"}
                >
                  <img src={msgIcon} alt="Query" />
                  What is Programming ?
                </button>
                <button
                  className="query"
                  onClick={handleQuery}
                  value={"How to use an API?"}
                >
                  <img src={msgIcon} alt="Query" />
                  How to use an API?
                </button>
              </div>
            </div>
          </div>
          <div className="lowerSide">
            <div className="listItems">
              <img src={home} alt="Home" className="listItemsImg" />
              Home
            </div>
            <div className="listItems">
              <img src={saved} alt="Saved" className="listItemsImg" />
              Saved
            </div>
            <div className="listItems">
              <img src={rocket} alt="Upgrade" className="listItemsImg" />
              Upgrade to Pro
            </div>
          </div>
        </div>
        <div className="main">
          <div className="chats">
            {messages.map((message, i) => (
              <div key={i} className={message.isBot ? "chat bot" : "chat"}>
                <img
                  className="chatImg"
                  src={message.isBot ? gptImgLogo : userIcon}
                  alt=""
                />
                <p className="txt">{message.text}</p>
              </div>
            ))}
            <div ref={msgEnd} />
          </div>
          <div className="chatFooter">
            <div className="inp">
              <input
                type="text"
                placeholder="Send a message"
                value={input}
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
              <button className="send" onClick={handleSend}>
                <img src={sendBtn} alt="Send" />
              </button>
            </div>
            <p>
              ChatGPT may produce inaccurate information about people, places,
              or facts. ChatGPT August 20 Version.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
