import Login from "./Login";
const LandingPage = () => {
  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen gap-10">
      <section>
        <h1 className="text-blue-500 font-extrabold text-7xl mb-4">FaceTome</h1>
        <p className="text-4xl max-w-md">
          Stay connected, share moments, and make memories with FaceTome.{" "}
        </p>
      </section>
      <div>
        <Login />
      </div>
    </div>
  );
};

export default LandingPage;
