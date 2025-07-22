import Login from "./Login";
const LandingPage = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center bg-gray-100 min-h-screen gap-10 px-4 text-center md:text-left">
      <section className="relative">
        <h1 className="text-blue-500 font-extrabold text-5xl md:text-7xl mb-4">
          FaceTome
        </h1>
      <span
  className="fixed 
             top-2 right-2 
             sm:top-4 sm:right-4 
             md:top-4 md:right-6 
             lg:top-8 lg:right-8 
             z-50 
             bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 
             px-2 py-1 
             sm:px-3 sm:py-1.5 
             md:px-4 md:py-2 
             text-white 
             rounded-full font-bold font-mono 
             text-xs 
             sm:text-sm 
             md:text-base 
             lg:text-lg 
             shadow-lg"
>
  Powered By AI
</span>


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
