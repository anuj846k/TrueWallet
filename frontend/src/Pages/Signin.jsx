import { useState } from "react";
import BottomWarning from "../components/BottomWarning";
import Button from "../components/Button";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import SubHeading from "../components/SubHeading";

const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", username);
    // Add your signin logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <Heading label="Sign in" />
          <SubHeading label="Enter your credentials to access your account" />
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputBox
              placeholder="anuj846k@gmail.com"
              label="Email"
              type="email"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <InputBox
              placeholder="••••••"
              label="Password"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="pt-4">
              <Button label="Sign in" type="submit" />
            </div>
          </form>
          <BottomWarning
            label="Don't have an account?"
            buttonText="Sign up"
            to="/signup"
          />
        </div>
      </div>
    </div>
  );
};

export default Signin;
