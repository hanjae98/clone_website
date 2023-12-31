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

const isURL = (text) => {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(text);
};

const renderMessage = (message, index, handleLinkClick, handleButtonClick) => {
  const isLink = isURL(message.text);

  return (
    <div key={index} className={message.isBot ? "chat bot" : "chat"}>
      <img
        className="chatImg"
        src={message.isBot ? gptImgLogo : userIcon}
        alt=""
      />
      <p className="txt">
        {isLink ? (
          <a href={message.text} target="_blank" rel="noopener noreferrer">
            {message.text}
          </a>
        ) : (
          message.text
        )}
      </p>
      {isLink && (
        <button
          className="btnLink"
          onClick={() => handleLinkClick(message.text)}
        >
          Open Link
        </button>
      )}
      {message.buttons && message.buttons.length > 0 && (
        <div className="buttonContainer">
          {message.buttons.map((button, btnIndex) => (
            <button
              key={btnIndex}
              className="customButton"
              onClick={() => handleButtonClick(button)}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const [idx, setIdx] = useState(1);
  const scenarios = [
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      buttons: [],
    },
    { text: "hello, moto1", buttons: [] },
    { text: "hello, world!2", buttons: [] },
    {
      text: "Check out this link: [OpenAI](https://www.openai.com/)",
      buttons: [{ label: "Learn More", action: "open_link" }],
    },
  ];
  const msgEnd = useRef(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: scenarios[0].text,
      isBot: true,
      buttons: scenarios[0].buttons,
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
      { text: input, isBot: false, buttons: [] },
      { text: "thinking...", isBot: true, buttons: [] },
    ]);

    setTimeout(async () => {
      if (idx < scenarios.length) {
        setMessages([
          ...messages,
          {
            text: text,
            isBot: false,
            buttons: scenarios[idx].buttons,
          },
          { text: scenarios[idx].text, isBot: true, buttons: [] },
        ]);
        setIdx(idx + 1);
      } else {
        const res = await sendMsgToOpenAI(input);
        setMessages([
          ...messages,
          { text, isBot: false, buttons: [] },
          { text: res, isBot: true, buttons: [] },
        ]);
      }
    }, 600);
  };

  const handleEnter = async (e) => {
    if (e.key === "Enter") await handleSend();
  };

  const handleQuery = async (e) => {
    const text = e.target.value;
    setMessages([...messages, { text, isBot: false, buttons: [] }]);
    const res = await sendMsgToOpenAI(input);
    setMessages([
      ...messages,
      { text, isBot: false, buttons: [] },
      { text: res, isBot: true, buttons: [] },
    ]);
  };

  const handleLinkClick = (link) => {
    alert(`Link clicked: ${link}`);
    // 여기서 원하는 동작 수행 가능
  };

  const handleButtonClick = (button) => {
    alert(`Button clicked: ${button.label}`);
    // 여기서 버튼에 대한 원하는 동작 수행 가능
  };

  return (
    <div className="App">
      <div className="App">
        <div className="sideBar">{/* ... (이전 코드) */}</div>
        <div className="main">
          <div className="chats">
            {messages.map((message, i) =>
              renderMessage(message, i, handleLinkClick, handleButtonClick)
            )}
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
