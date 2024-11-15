import axios from "axios";
import { useEffect, useState } from "react";

const Balance = ({ value }) => {
  
  return (
    <div className="flex">
      <div className="font-bold text-lg font-serif">Your Balance</div>
      <div className="font-semibold ml-4 text-lg">Rs {value}</div>
    </div>
  );
};

export default Balance;
