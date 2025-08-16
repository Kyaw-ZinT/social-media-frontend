import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
        <p className="text-xl text-gray-800 mb-6">Page Not Found</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Go To Home
        </Link>
      </div>
    </div>
  );
}
