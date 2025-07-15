import { useState } from "react";
import { generatePost } from "../apiServices/ai";

const AiPostGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const reply = await generatePost(prompt);
      setResponse(reply);
    } catch (error) {
      setError(error.message || "something went wrong");
    }
  };

  return (
    <div className="m-2 flex justify-center flex-col border border-2">
      <form
        className="w-1/2 bg-orange-400 flex flex-col text-2"
        onSubmit={handleSubmit}
      >
        <input
          className="w-full"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button className="bg-2 text-white">generate post</button>
      </form>
      {response && (
        <div className="flex flex-col border">
          <p className="text-black">Title: {response.generatedpost.title}</p>
          <p>Content: {response.generatedpost.content}</p>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}{" "}
    </div>
  );
};

export default AiPostGenerator;
