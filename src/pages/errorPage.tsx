const ErrorPage = () => {
  return (
    <div className="flex flex-col justify-center inter space-y-6 items-center h-screen  ">
      <div className="flex gap-4 items-center">
        <h1 className="text-lg font-bold  ">404</h1>
        <div className="h-full w-[1px] bg-fade"></div>
        <h2 className="text-lg font-semibold  ">Oops!</h2>
      </div>
      <p className="text-xs mt-2 text-gray-200 text-center max-w-lg">
        It's not your fault... or maybe the developer is just a bit crappy. Or
        who knows, maybe it *is* your fault, and you're the crappy one.
      </p>
      <p className="text-xs mt-4 text-gray-200">
        Either way, let's get you back on track.
      </p>
      <div className="flex gap-12">
        <a
          href="/"
          className="mt-6 px-4 py-2 bg-secondary text-white   text-xs font-medium rounded  transition duration-300"
        >
          Go Home
        </a>

        <div
          onClick={() => window.location.reload()}
          className="mt-6 cursor-pointer px-4 py-2 bg-blue text-white   text-xs font-medium rounded bg-secondary2  transition duration-300"
        >
          Refresh
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
