import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Welcome to ResuMate
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Create professional resumes with our easy-to-use builder. Choose from
          multiple templates and customize them to fit your needs.
        </p>
        <div className="flex justify-center">
          <Link
            to="/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md"
          >
            Create Your Resume
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
