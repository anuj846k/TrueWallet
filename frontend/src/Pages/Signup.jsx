import { useState } from "react";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";
import axios from "axios";

const Signup = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const response = await axios.post(
      "http://localhost:5000/api/v1/user/signup",
      {
        username: username,
        firstname: firstname,
        lastname: lastname,
        password: password,
      }
    );
    localStorage.setItem("token", response.data.token);
    localStorage.delete("token");
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <Heading label="Sign Up" />
        <SubHeading label="Enter your details to create an account" />
        <form onSubmit={handleSubmit} className="space-y-8">
          <InputBox
            label="First Name"
            placeholder="John"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <InputBox
            label="Last Name"
            placeholder="Doe"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <InputBox
            label="Email"
            placeholder="anuj846k@gmail.com"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <InputBox
            label="Password"
            type="password"
            placeholder="123456"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button label="Sign Up" type="submit" onClick={handleSubmit} />
        </form>
        <BottomWarning
          label="Already have an account?"
          buttonText="Sign In"
          to="/signin"
        />
      </div>
    </div>
  );
};

export default Signup;
