import Login from "./Login";
const LandingPage = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center bg-gray-100 min-h-screen gap-10 px-4 text-center md:text-left">
      <section>
        <h1 className="text-blue-500 font-extrabold text-5xl md:text-7xl mb-4">
          FaceTome
        </h1>
        <p className="text-2xl md:text-4xl max-w-md">
          Stay connected, share moments, and make memories with FaceTome.
        </p>
      </section>
      <div className="w-full max-w-sm">
        <Login />
      </div>
    </div>
  );
};

export default LandingPage;
