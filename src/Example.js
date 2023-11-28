import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import axios from "axios";

function Example({ onSelectResume }) {
  const [open, setOpen] = useState("");
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [newResume, setNewResume] = useState({
    job: "",
    name: "",
    skills: [],
    otherInfo: "",
  });

  useEffect(() => {
    // Fetch data from the local JSON file
    fetch("/data.json")
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const toggle = (id) => {
    if (open === id) {
      setOpen("");
    } else {
      setOpen(id);
      const selectedResume = data.find((item) => item.id === parseInt(id));
      // onSelectResume(selectedResume ? selectedResume.name : "");
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen || (modalOpen && parseInt(open) > 0)) {
      // Reset the state when the modal is opened
      setNewResume({ job: "", name: "", skills: [], otherInfo: "" });
      setEditMode(false);
      setEditIndex(null);
    }
  };

  const handleNewResumeChange = (e) => {
    const { name, options, type } = e.target;

    if (type === "select-multiple" && name === "skills") {
      const selectedSkills = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);

      setNewResume({
        ...newResume,
        [name]: selectedSkills,
      });
    } else {
      setNewResume({
        ...newResume,
        [name]: e.target.value,
      });
    }
  };

  const handleAddResume = () => {
    if (newResume.job && newResume.skills.length > 0) {
      if (editMode) {
        const updatedData = [...data];
        updatedData[editIndex] = {
          ...newResume,
          id: updatedData[editIndex].id,
        };
        setData(updatedData);
      } else {
        setData([...data, { ...newResume, id: data.length + 1 }]);
      }

      toggleModal();
    } else {
      alert("Please fill in the required fields.");
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = [...newResume.skills];
    updatedSkills.splice(index, 1);
    setNewResume({
      ...newResume,
      skills: updatedSkills,
    });
  };

  const [newSkill, setNewSkill] = useState("");

  const handleNewSkillChange = (e) => {
    setNewSkill(e.target.value);
  };

  const addNewSkill = () => {
    if (newSkill.trim() !== "") {
      setNewResume({
        ...newResume,
        skills: [...newResume.skills, newSkill.trim()],
      });
      setNewSkill("");
    } else {
      alert("Please enter a valid skill.");
    }
  };

  const handleJobButtonClick = (selectedJob) => {
    setNewResume({
      ...newResume,
      job: selectedJob,
    });
  };

  const editResume = (index) => {
    setEditMode(true);
    setEditIndex(index);
    setNewResume(data[index]);
    setModalOpen(true);
  };

  const deleteResume = (index) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);
  };

  // const handleDone = () => {
  //   if (open) {
  //     const selectedResume = data.find((item) => item.id === parseInt(open));
  //     onSelectResume(selectedResume);
  //     setOpen("");
  //     toggleModal();
  //   } else {
  //     alert("Please select a resume before clicking 'Done'.");
  //   }
  // };

  const handleDone = async () => {
    if (open && parseInt(open) > 0) {
      const selectedResume = data.find((item) => item.id === parseInt(open));
      // onSelectResume(selectedResume);
      setOpen("");
      toggleModal();

      // 전송할 데이터 준비
      const sendData = {
        data: data.map((resume) => ({
          // id: resume.id,
          // name: resume.name,
          // job: resume.job,
          // skills: resume.skills,
          // otherInfo: resume.otherInfo,
          // 다른 Resume 속성들도 필요한 대로 추가
          job: resume.job,
          requirement: resume.skills,
          level: 0,
        })),
      };

      try {
        const response = await axios.post(
          "https://jsonplaceholder.typicode.com/posts", // 예제 URL, 실제 서버 URL로 변경해야 합니다.
          sendData
        );
        console.log("Server Response:", response.data);
        onSelectResume(response.data);
      } catch (error) {
        console.error("Error sending data:", error);
      }
    } else {
      // Done 버튼을 클릭했을 때, 모달이 열려있지 않거나 id가 0이하면 경고 메시지를 띄움
      alert("Please select a valid resume before clicking 'Done'.");
    }
  };

  return (
    <div>
      <Accordion flush open={open} toggle={toggle}>
        {data.map((item, index) => (
          <AccordionItem key={item.id}>
            <AccordionHeader targetId={item.id.toString()}>
              {item.name}
            </AccordionHeader>
            <AccordionBody accordionId={item.id.toString()}>
              <strong>{`This is ${item.name}'s accordion body.`}</strong>
              {` Job: ${item.job}`}
              <br />
              {`Skills: ${item.skills.join(", ")}`}
              <br />
              {`Other Info: ${item.otherInfo}`}
              <br />
              <Button color="info" size="sm" onClick={() => editResume(index)}>
                Edit
              </Button>{" "}
              <Button
                color="danger"
                size="sm"
                onClick={() => deleteResume(index)}
              >
                Delete
              </Button>
            </AccordionBody>
          </AccordionItem>
        ))}
        <AccordionItem>
          <AccordionHeader targetId="0">Add New Resume</AccordionHeader>
          <AccordionBody accordionId="0">
            <Button color="primary" onClick={toggleModal}>
              Add New Resume
            </Button>
          </AccordionBody>
        </AccordionItem>
      </Accordion>

      {/* Modal for adding/editing a resume */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {editMode ? `Edit Resume` : `Add New Resume`}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="job">Job</Label>
            <div>
              <Button
                color={newResume.job === "Front-end" ? "primary" : "secondary"}
                onClick={() => handleJobButtonClick("Front-end")}
              >
                Front-end
              </Button>{" "}
              <Button
                color={newResume.job === "Back-end" ? "primary" : "secondary"}
                onClick={() => handleJobButtonClick("Back-end")}
              >
                Back-end
              </Button>{" "}
              <Button
                color={newResume.job === "AI" ? "primary" : "secondary"}
                onClick={() => handleJobButtonClick("AI")}
              >
                AI
              </Button>
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Enter name"
              value={newResume.name}
              onChange={handleNewResumeChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="skills">Skills</Label>
            <div>
              {newResume.skills.map((skill, index) => (
                <span key={index} className="selected-skill">
                  {skill}{" "}
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => removeSkill(index)}
                  >
                    x
                  </Button>
                </span>
              ))}
            </div>
            <Input
              type="text"
              name="skills"
              id="skills"
              placeholder="Enter skills"
              value={newSkill}
              onChange={handleNewSkillChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addNewSkill();
                }
              }}
            />
            <Button color="primary" onClick={addNewSkill}>
              Add Skill
            </Button>
          </FormGroup>
          <FormGroup>
            <Label for="otherInfo">Additional descriptions</Label>
            <Input
              type="text"
              name="otherInfo"
              id="otherInfo"
              placeholder="Enter other info"
              value={newResume.otherInfo}
              onChange={handleNewResumeChange}
            />
          </FormGroup>
          <Button color="primary" onClick={handleAddResume}>
            {editMode ? `Save Changes` : `Add Resume`}
          </Button>
        </ModalBody>
      </Modal>

      {/* Done button outside the modal */}
      <Button color="success" onClick={handleDone}>
        Done
      </Button>
    </div>
  );
}

export default Example;
