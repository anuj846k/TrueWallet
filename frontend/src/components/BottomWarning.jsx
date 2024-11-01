import { Link } from "react-router-dom";

const BottomWarning = ({ label, buttonText, to }) => {
  return (
    <div className="mt-6 text-sm text-center">
      <div className="inline-block py-2 px-4 bg-blue-50 rounded-full">
        <span className="text-gray-700">{label}</span>{" "}
        <Link to={to} className="text-blue-600 font-semibold hover:text-blue-800 transition duration-150 ease-in-out">
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default BottomWarning;
