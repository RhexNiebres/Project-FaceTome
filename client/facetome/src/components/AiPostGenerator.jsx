import { useState } from "react";
import { generatePost } from "../apiServices/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import CreatePost from "./CreatePost";

const AiPostGenerator = ({ onPostCreated }) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <div className="bg-2 p-4 text-white rounded-xl w-full shadow-xl">
      <h1 className="text-white font-extrabold text-2xl text-center mb-4">
        Generate a post using Tommy, your friendly AI.💡
      </h1>
      <div className="p-4">
        <p className="font-bold">Step 1:</p>
        <p>Type your idea and let Tommy bring it to life.</p>
      </div>
      <form className="w-full flex flex-col text-2" onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 rounded-xl"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your idea and let the Tommy Bring it to life..."
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="p-2 m-2 bg-gray-200 text-2 hover:bg-1 hover:text-gray-100 rounded-xl transition duration-300 ease-in-out"
          >
            {loading ? (
              <div className="flex justify-center w-20">
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  spin
                  className="text-blue-500 text-2xl"
                />
              </div>
            ) : (
              "Generate Post"
            )}
          </button>
        </div>
      </form>
      <div className="p-4">
        <p className="font-bold ">Step 2:</p>
        <p>
          Review and edit the generated post, then click{" "}
          <strong>Create Post</strong>.
        </p>
      </div>
      <CreatePost receiveData={response} onPostCreated={onPostCreated} />
      {error && <p className="text-red-500">{error}</p>}{" "}
    </div>
  );
};

export default AiPostGenerator;
