// ButtonSelectionWithJsonDataAndModal.js
import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Example from "./Example";

const ButtonSelectionWithJsonDataAndModal = ({ onSelectResume }) => {
  const [response, setResponse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  console.log(response);

  // useEffect(() => {
  //   // Fetch data from the local JSON file
  //   fetch("/data.json")
  //     .then((response) => response.json())
  //     .then((data) => setResumes(data))
  //     .catch((error) => console.error("Error fetching data:", error));
  // }, []);

  // // const handleSelectResume = (resumeName) => {
  // //   setSelectedResume(resumeName);
  // // };

  const handleSelectResume = (responseFromChild) => {
    setResponse(responseFromChild);
    // 자식 창에서 부모 창으로 데이터를 전달
    window.opener.postMessage(responseFromChild, "*");

    setIsModalOpen(false); // 모달을 닫음
  };

  useEffect(() => {
    // isModalOpen이 false로 변경되면 창을 닫음
    if (!isModalOpen) {
      // 모달이 닫힌 후에 창을 닫도록 setTimeout 사용
      setTimeout(() => {
        window.close();
      }, 0);
    }
  }, [isModalOpen]);

  return (
    <div className="container mt-4">
      <div className="row"></div>
      {isModalOpen && (
        <div>
          <Example onSelectResume={handleSelectResume} />
        </div>
      )}
    </div>
  );
};

export default ButtonSelectionWithJsonDataAndModal;
