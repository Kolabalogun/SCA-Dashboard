const NotFound = () => {
  return (
    <div className="flex flex-col justify-center inter space-y-6 items-center h-screen bg-gray-50">
      <div className="flex gap-4 items-center">
        <h1 className="text-lg font-bold">404</h1>
        <div className="h-full w-[1px] bg-fade"></div>
        <h2 className="text-lg font-semibold">Page Not Found</h2>
      </div>
      <p className="text-xs mt-2 text-gray-700 text-center max-w-lg">
        Looks like you've stumbled upon a page that doesn't exist. Maybe the URL
        is incorrect, or the page was removed.
      </p>
      <p className="text-xs mt-4 text-gray-500">
        Don't worry, let's get you back to where you belong.
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

export default NotFound;
