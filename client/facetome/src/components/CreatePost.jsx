import { useState, useEffect, useRef } from "react";
import { createPost } from "../apiServices/posts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const CreatePost = ({
  onPostCreated,
  receiveData,
  setShowForm,
  setIsTyping,
  setStep,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await createPost({ title, content });

    if (result.success) {
      setTitle("");
      setContent("");
      if (onPostCreated) onPostCreated(result.post);
    } else {
      alert(result.error || "Failed to create post");
    }
    setLoading(false);
    setShowForm(false);
  };

  useEffect(() => {
    if (receiveData?.title || receiveData?.content) {
      let titleIndex = 0;
      let contentIndex = 0;
      const typeSpeed = 30; // ms per character,

      setIsTyping(true);

      const typeTitle = () => {
        if (receiveData?.title && titleIndex <= receiveData.title.length) {
          setTitle(receiveData.title.slice(0, titleIndex));
          titleIndex++;
          setTimeout(typeTitle, typeSpeed);
        }
      };

      const typeContent = () => {
        if (
          receiveData?.content &&
          contentIndex <= receiveData.content.length
        ) {
          setContent(receiveData.content.slice(0, contentIndex));
          contentIndex++;
          setTimeout(typeContent, typeSpeed);
        } else {
          setIsTyping(false);
        }
      };

      typeTitle();
      typeContent();
    }
  }, [receiveData]);

  const autoResize = () => {// resize textarea based on scrollHeight
  if (contentRef.current) {
    contentRef.current.style.height = 'auto'; 
    contentRef.current.style.height = contentRef.current.scrollHeight + 'px'; 
  }
};

useEffect(() => {
  autoResize();
}, [content]);


  return (
    <div className="bg-2 p-4  text-white rounded-xl w-full shadow-xl">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title" className="text-l font-bold pl-3">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="p-2 my-2 rounded-xl w-full text-4 bg-gray-100"
        />
       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
  <label htmlFor="content" className="text-l font-bold pl-1 sm:pl-3">
    Content
  </label>
  {setStep && (
    <div className="text-sm font-medium text-white italic text-right sm:text-left">
      Review and edit the generated post.
    </div>
  )}
</div>


        <textarea
         ref={contentRef} 
          id="content"
          value={content}
          onChange={(e) => {
    setContent(e.target.value);
    autoResize();
  }}
          rows="2"
          required
          className="p-2  rounded-xl w-full text-4 bg-gray-100"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="p-2  bg-gray-200 text-2 hover:bg-1 hover:text-gray-100 rounded-xl transition duration-300 ease-in-out"
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
              "Create Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
