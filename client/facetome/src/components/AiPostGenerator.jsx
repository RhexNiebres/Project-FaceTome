import { useState } from "react";
import { generatePost } from "../apiServices/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import CreatePost from "./CreatePost";

const AiPostGenerator = ({ onPostCreated, setShowForm }) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const reply = await generatePost(prompt);
      if (reply?.error) {
        setError(reply.error);
        setResponse(null);
      } else {
        setResponse(reply);
      }
    } catch (error) {
      setError(error.message || "something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="bg-2 p-4 sm:p-6 md:p-6 text-white rounded-xl w-full max-w-3xl mx-auto shadow-xl">
      <h1 className="text-white font-extrabold text-xl px-2 sm:text-2xl md:text-3xl text-center ">
        Generate a post using{" "}
        <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
          Tommy
        </span>
        , your friendly AI.💡
      </h1>

      <div className="p-2 sm:p-4">
        <p className="font-bold text-base sm:text-lg">Step 1:</p>
        <p className="text-sm sm:text-base">
          Type your idea and let Tommy bring it to life.
        </p>
      </div>

      <form
        className="w-full flex flex-col gap-2 text-2"
        onSubmit={handleSubmit}
      >
        <textarea
          className="w-full p-3 rounded-xl text-black min-h-[100px] resize-none"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your idea here..."
        />
        <div className="flex justify-end">
          <button
            type="submit"
            title={isTyping ? "Wait for Tommy to finish typing!" : ""}
            disabled={loading || isTyping}
            className={`p-2 px-4 m-2 rounded-xl transition duration-300 ease-in-out 
    ${
      loading || isTyping
        ? "bg-blue-500 text-white animate-pulse"
        : "bg-gray-200 text-black hover:bg-1 hover:text-white"
    }`}
          >
            {loading ? (
              <div className="flex justify-center w-20">
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  spin
                  className="text-blue-500 text-2xl"
                />
              </div>
            ) : isTyping ? (
              "Generating Post..."
            ) : (
              "Generate Post"
            )}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="p-2 sm:p-4">
        <p className="font-bold text-base sm:text-lg">Step 2:</p>
        <p className="text-sm sm:text-base">
          Review and edit the generated post, then click{" "}
          <strong>Create Post</strong>.
        </p>
      </div>

      <CreatePost
        receiveData={response}
        onPostCreated={onPostCreated}
        setShowForm={setShowForm}
        setIsTyping={setIsTyping}
      />
    </div>
  );
};

export default AiPostGenerator;
