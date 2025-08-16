import React from "react";

const Alert = ({ type, message }) => {
  let alertClasses = "p-3 rounded-md mb-4 text-sm font-medium";
  let textClasses = "";
  if (type === "error") {
    alertClasses += "bg-red-100 border border-red-400 text-red-700";
  } else if (type === "success") {
    alertClasses += "bg-green-100 border border-green-400 text-green-700";
  } else if (type === "info") {
    alertClasses += "bg-blue-100 border border-blue-400 text-blue-700";
  } else {
    alertClasses += "bg-gray-100 border border-gray-400 text-gray-700";
  }
  return (
    <div className={alertClasses} role="alert">
      {message}
    </div>
  );
};

export default Alert;
