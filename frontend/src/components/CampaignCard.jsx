import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { BASE_URL } from "../api";

function CampaignCard({ id, title, description, image, goal = 1, raised = 0, daysLeft }) {
  const progress = goal > 0 ? (raised / goal) * 100 : 0;
  
  // Handle image URL - prepend BASE_URL if the image path is relative
  const imageUrl = image && !image.startsWith('http') ? `${BASE_URL}/${image}` : image;

  return (
    <Link to={`/campaign/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        {/* Image with proper URL handling */}
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" loading="lazy" />

        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

          <div className="space-y-3">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>

            {/* Fundraising Details */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Raised: <span className="font-semibold text-gray-900">${raised.toLocaleString()}</span>
              </span>
              <span className="text-gray-600">
                Goal: <span className="font-semibold text-gray-900">${goal.toLocaleString()}</span>
              </span>
            </div>

            {/* Funding Percentage & Days Left */}
            <div className="flex justify-between items-center">
              <span className="text-purple-600 font-semibold">{Math.round(progress)}% Funded</span>
              <span className="text-gray-600 text-sm">{daysLeft} days left</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// PropTypes Validation
CampaignCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string.isRequired,
  goal: PropTypes.number,
  raised: PropTypes.number,
  daysLeft: PropTypes.number.isRequired,
};

// Default Props
CampaignCard.defaultProps = {
  description: "No description available.",
  goal: 1,  // Avoid division by zero
  raised: 0,
};

export default CampaignCard;
