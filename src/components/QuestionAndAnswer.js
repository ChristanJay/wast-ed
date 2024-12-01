import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Firebase configuration
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"; // Firebase Firestore imports
import logo from "../assets/logos.png"; // Assuming this logo is used in the sidebar

const QuestionAndAnswer = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newExplanation, setNewExplanation] = useState("");
  const [newAnswer, setNewAnswer] = useState(""); // New state for the answer
  const [options, setOptions] = useState(["", "", "", "", ""]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // State for managing the update modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Fetch data from Firestore (multiple-choice questions)
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "questions"));
      const fetchedQuestions = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddQA = async () => {
    if (
      !newQuestion ||
      !newExplanation ||
      !newAnswer ||
      options.some((option) => option === "")
    ) {
      alert("All fields are required.");
      return;
    }

    const newQA = {
      question: newQuestion,
      explanation: newExplanation,
      answer: newAnswer,
      options: options,
    };

    try {
      const docRef = await addDoc(collection(db, "questions"), newQA); // Save the new question to Firebase
      setQuestions([...questions, { ...newQA, id: docRef.id }]);
      setNewQuestion("");
      setNewExplanation("");
      setNewAnswer(""); // Reset the answer field
      setOptions(["", "", "", "", ""]);
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  // Delete Question
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "questions", id)); // Delete from Firestore
      setQuestions(questions.filter((question) => question.id !== id)); // Remove from local state
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  // Update Question
  const handleUpdate = async (id, updatedQA) => {
    try {
      await updateDoc(doc(db, "questions", id), updatedQA); // Update Firestore document
      setQuestions(questions.map((qa) => (qa.id === id ? { ...qa, ...updatedQA } : qa))); // Update local state
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  // Open modal with current question data
  const openUpdateModal = (qa) => {
    setCurrentQuestion(qa);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentQuestion(null);
  };

  // Handle the modal update action
  const handleModalUpdate = () => {
    const updatedQA = {
      question: currentQuestion.question,
      explanation: currentQuestion.explanation,
      answer: currentQuestion.answer,
      options: currentQuestion.options,
    };

    handleUpdate(currentQuestion.id, updatedQA);
    closeModal();
  };

  // Handle Search
  const handleSearch = () => {
    // Filter the questions based on the search query
    const filteredQuestions = questions.filter((qa) =>
      qa.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setQuestions(filteredQuestions);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <aside className="bg-white w-64 p-6">
        <h1 className="text-2xl font-bold mb-8 flex items-center">
          <img src={logo} alt="Wast.ed Logo" className="w-8 h-8 mr-2" />
          Wast.ed
        </h1>
        <nav>
          <ul className="space-y-4">
            <li
              className="font-small hover:text-green-500 cursor-pointer"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Dashboard
            </li>
            <li
              className="font-small hover:text-green-500 cursor-pointer"
              onClick={() => (window.location.href = "/users")}
            >
              Users
            </li>
            <li
              className="font-small hover:text-green-500 cursor-pointer"
              onClick={() => (window.location.href = "/user-details")}
            >
              Generate Reports
            </li>
            <li
              className="text-green-500 font-medium cursor-pointer"
              onClick={() => (window.location.href = "/create-qa")}
            >
              Create Q&A
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="underline text-3xl font-bold">
            Create Multiple-Choice Questions
          </h2>

          {/* Search Bar */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="border px-4 py-2 rounded"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </header>

        {/* Form for Adding Multiple-Choice Question */}
        <div className="mb-6">
          <div className="mb-4">
            <label className="block font-medium mb-2">Question</label>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter your question here..."
              className="border px-4 py-2 rounded w-full"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Explanation</label>
            <textarea
              value={newExplanation}
              onChange={(e) => setNewExplanation(e.target.value)}
              placeholder="Enter the explanation here..."
              className="border px-4 py-2 rounded w-full"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Answer</label>
            <input
              type="text"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Enter the correct answer..."
              className="border px-4 py-2 rounded w-full"
            />
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-2">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="border px-4 py-2 rounded w-full"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleAddQA}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Add Question & Answer
          </button>
        </div>

        {/* Display Added Questions and Answers */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Questions and Answers</h2>
          {questions.length === 0 ? (
            <p>No questions added yet.</p>
          ) : (
            <ul className="space-y-4">
              {questions.map((qa) => (
                <li key={qa.id} className="border p-4 rounded shadow">
                  <h3 className="font-bold text-lg">{qa.question}</h3>
                  <p className="mt-2">{qa.explanation}</p>
                  <div className="mt-4">
                    <h4 className="font-semibold">Options:</h4>
                    <ul className="list-disc pl-6">
                      {qa.options.map((option, i) => (
                        <li key={i}>{option}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold">Answer:</h4>
                    <p>{qa.answer}</p>
                  </div>
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => openUpdateModal(qa)}
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(qa.id)}
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Modal for Updating Question */}
        {isModalOpen && currentQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded shadow-lg w-96">
              <h3 className="text-2xl font-bold mb-4">Update Question</h3>

              <div className="mb-4">
                <label className="block font-medium mb-2">Question</label>
                <textarea
                  value={currentQuestion.question}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      question: e.target.value,
                    })
                  }
                  className="border px-4 py-2 rounded w-full"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-2">Explanation</label>
                <textarea
                  value={currentQuestion.explanation}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      explanation: e.target.value,
                    })
                  }
                  className="border px-4 py-2 rounded w-full"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-2">Answer</label>
                <input
                  type="text"
                  value={currentQuestion.answer}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      answer: e.target.value,
                    })
                  }
                  className="border px-4 py-2 rounded w-full"
                />
              </div>

              <div className="mb-6">
                <label className="block font-medium mb-2">Options</label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          options: currentQuestion.options.map((opt, i) =>
                            i === index ? e.target.value : opt
                          ),
                        })
                      }
                      className="border px-4 py-2 rounded w-full"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleModalUpdate}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 ml-4"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuestionAndAnswer;
