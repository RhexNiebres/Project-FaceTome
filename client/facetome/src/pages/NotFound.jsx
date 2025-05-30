const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-2">
      <div className="bg-red-600 text-center p-10 shadow-2xl rounded-xl">
        <h1 className="text-7xl font-bold text-orange-300 pt-4">404</h1>
        <p className="text-2xl text-orange-300 mb-16 font-thin">
          Oops! The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="mt-8 text-orange-300 scale-95 hover:bg-white hover:text-red-700 transition-transform duration-150  p-4  bg-red-700 rounded-2xl "
        >
          Click here to go back to FaceTome
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
