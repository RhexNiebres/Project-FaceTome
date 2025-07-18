import { useState, useEffect, useRef } from "react";
import CreatePost from "./CreatePost";
import AiPostGenerator from "./AiPostGenerator";

const TabsToggle = ({ onPostCreated }) => {
  const [activeTab, setActiveTab] = useState("manual");
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);

   const handleExpandForm = () => {
    setShowForm(true);
  };
  
  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setShowForm(false);
    }
  };

  useEffect(() => {
    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm]);


  return (
    <div className="flex flex-col text-white w-full p-20">
      <div
        className="bg-white border-black p-4 rounded-2xl shadow-xl"
        ref={formRef}
      >
        {!showForm ? (
          <div
            onClick={handleExpandForm}
            className="cursor-pointer bg-gray-100 text-black p-2 rounded-xl border hover:bg-gray-200 transition"
          >
            What's on your mind?
          </div>
        ) : (
          <>
            <div className="pb-2">
              <button
                onClick={() => setActiveTab("manual")}
                className={`px-4 py-2 ml-3 rounded-xl ${
                  activeTab === "manual"
                    ? "bg-2 text-white font-bold"
                    : "text-4 border hover:bg-1 hover:text-white transition duration-200"
                }`}
              >
                Add Post
              </button>
              <button
                onClick={() => setActiveTab("AI")}
                className={`px-4 py-2 ml-1 rounded-xl ${
                  activeTab === "AI"
                    ? "bg-2 text-white font-bold"
                    : "text-4 border hover:bg-1 hover:text-white transition duration-200"
                }`}
              >
                AI Generate Post
              </button>
            </div>

            {activeTab === "manual" ? (
              <CreatePost onPostCreated={onPostCreated} setShowForm={setShowForm}/>
            ) : (
              <AiPostGenerator onPostCreated={onPostCreated} setShowForm={setShowForm}/>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TabsToggle;
