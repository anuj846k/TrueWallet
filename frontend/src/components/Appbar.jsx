const Appbar = () => {
  return (
    <div className="shadow-md h-16 flex justify-between items-center px-6 bg-white">
      <div className="text-xl font-bold text-blue-600">TrueWallet App</div>
      <div className="flex items-center space-x-4">
        <div className="text-lg font-medium text-gray-700">Hello</div>
        <div className="rounded-full h-12 w-12 bg-blue-100 flex items-center justify-center">
          <div className="text-xl font-semibold text-blue-600">U</div>
        </div>
      </div>
    </div>
  );
};

export default Appbar;
