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
    <div className="flex flex-col items-center text-white w-full px-4 sm:px-6 md:px-12 lg:px-20 py-10 sm:py-16">
      <div
        className="bg-white border border-black p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-3xl"
        ref={formRef}
      >
        {!showForm ? (
          <div
            onClick={handleExpandForm}
            className="cursor-pointer bg-gray-100 text-black p-3 sm:p-4 rounded-xl border hover:bg-gray-200 transition text-center text-sm sm:text-base"
          >
            What's on your mind?
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 pb-4">
              <button
                onClick={() => setActiveTab("manual")}
                className={`px-4 py-2 rounded-xl text-sm sm:text-base ${
                  activeTab === "manual"
                    ? "bg-2 text-white font-bold"
                    : "text-4 border hover:bg-1 hover:text-white transition duration-200"
                }`}
              >
                Add Post
              </button>
              <button
                onClick={() => setActiveTab("AI")}
                className={`px-4 py-2 rounded-xl text-sm sm:text-base ${
                  activeTab === "AI"
                    ? "bg-2 text-white font-bold"
                    : "text-4 border hover:bg-1 hover:text-white transition duration-200"
                }`}
              >
                AI Generate Post
              </button>
            </div>

            <div className="w-full">
              {activeTab === "manual" ? (
                <CreatePost
                  onPostCreated={onPostCreated}
                  setShowForm={setShowForm}
                />
              ) : (
                <AiPostGenerator
                  onPostCreated={onPostCreated}
                  setShowForm={setShowForm}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TabsToggle;
