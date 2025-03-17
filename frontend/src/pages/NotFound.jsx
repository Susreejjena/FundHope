import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const NotFound = ({ darkMode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-16">
      <div className="text-center">
        <h1 className="text-6xl md:text-9xl font-bold text-purple-600 dark:text-purple-400">404</h1>
        <div className="w-16 h-1 mx-auto my-6 bg-purple-600 dark:bg-purple-400"></div>
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 dark:text-white">Page Not Found</h2>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
          <Link
            to="/"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Return Home
          </Link>
          <Link
            to="/discover"
            className="border-2 border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Discover Campaigns
          </Link>
        </div>
      </div>
    </div>
  );
};

NotFound.propTypes = {
  darkMode: PropTypes.bool
};

export default NotFound; 