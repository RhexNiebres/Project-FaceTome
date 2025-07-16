import { useState } from "react";
import { generatePost } from "../apiServices/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const AiPostGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const reply = await generatePost(prompt);
      setResponse(reply);
    } catch (error) {
      setError(error.message || "something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="bg-2 p-4 m-4 text-white rounded-xl w-1/2 shadow-xl">
      <h1 className="text-white font-extrabold text-2xl text-center mb-4">Generate a post using Tommy, your friendly AI.💡</h1>
      <form
        className="w-full flex flex-col text-2"
        onSubmit={handleSubmit}
      >
        <input
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
              "Generate Ai Post"
            )}
          </button>
        </div>
      </form>
      {response && (
        <div className="flex flex-col border gap-y-3 p-2">
          <p>Title: {response.title}</p>
          <p>Content: {response.content}</p>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}{" "}
    </div>
  );
};

export default AiPostGenerator;
