import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Firebase configuration
import { collection, addDoc, getDocs } from "firebase/firestore"; // Firebase Firestore imports
import logo from "../assets/logos.png"; // Assuming this logo is used in the sidebar

const QuestionAndAnswer = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newExplanation, setNewExplanation] = useState("");
  const [options, setOptions] = useState(["", "", "", "", ""]);

  // Fetch data from Firestore (multiple-choice questions)
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "questions"));
      const fetchedQuestions = querySnapshot.docs.map((doc) => doc.data());
      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddQA = async () => {
    if (!newQuestion || !newExplanation || options.some(option => option === "")) {
      alert("All fields are required.");
      return;
    }

    const newQA = {
      question: newQuestion,
      explanation: newExplanation,
      options: options
    };

    try {
      await addDoc(collection(db, "questions"), newQA); // Save the new question to Firebase
      setQuestions([...questions, newQA]);
      setNewQuestion("");
      setNewExplanation("");
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
              onClick={() => window.location.href = "/dashboard"}
            >
              Dashboard
            </li>
            <li
              className="font-small hover:text-green-500 cursor-pointer"
              onClick={() => window.location.href = "/users"}
            >
              Users
            </li>
            <li
              className="font-small hover:text-green-500 cursor-pointer"
              onClick={() => window.location.href = "/user-details"}
            >
              Generate Reports
            </li>
            <li
              className="text-green-500 font-medium cursor-pointer"
              onClick={() => window.location.href = "/create-qa"}
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
          <h2 className="underline text-3xl font-bold">Create Multiple-Choice Questions</h2>
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
              {questions.map((qa, index) => (
                <li key={index} className="border p-4 rounded shadow">
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuestionAndAnswer;
