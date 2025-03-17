import { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { donationAPI, paymentAPI } from '../api';
import PropTypes from 'prop-types';

const DonationModal = ({ isOpen, onClose, project, onDonationSuccess, onDonationFailure }) => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [donationError, setDonationError] = useState('');
  
  const predefinedAmounts = [10, 25, 50, 100];
  
  const handleAmountClick = (value) => {
    setAmount(value.toString());
    setDonationError('');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setDonationError('Please enter a valid donation amount');
      return;
    }
    
    if (parseFloat(amount) < 5) {
      setDonationError('Minimum donation amount is $5');
      return;
    }
    
    setStep(2);
  };
  
  const handlePayPalCreateOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await paymentAPI.createPayPalOrder(parseFloat(amount), project.id);
      return data.id;
    } catch (error) {
      setDonationError(error.response?.data?.message || 'Failed to create order');
      setIsLoading(false);
      return null;
    }
  };
  
  const handlePayPalApprove = async (data) => {
    try {
      // Capture PayPal order
      await paymentAPI.capturePayPalOrder(data.orderID);
      
      // Create donation in our system
      const donationData = {
        campaignId: project.id,
        amount: parseFloat(amount),
        name: anonymous ? 'Anonymous' : name,
        email: email,
        message: '', // Could add a message field if desired
        isAnonymous: anonymous,
        paymentMethod: 'paypal',
        paymentId: data.orderID
      };
      
      await donationAPI.createDonation(donationData);
      
      setIsLoading(false);
      onDonationSuccess();
    } catch (error) {
      setIsLoading(false);
      onDonationFailure(error.response?.data?.message || 'Payment was processed but donation failed to record');
    }
  };
  
  const handlePayPalError = (err) => {
    setIsLoading(false);
    setDonationError('Payment failed. Please try again.');
    console.error('PayPal error:', err);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">
            {step === 1 ? 'Make a Donation' : 'Payment Details'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            &times;
          </button>
        </div>
        
        {step === 1 ? (
          <div className="p-4">
            <div className="mb-4">
              <h3 className="font-bold text-lg dark:text-white">{project.title}</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                ${project.raised.toLocaleString()} raised of ${project.goal.toLocaleString()} goal
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${Math.min(Math.round((project.raised / project.goal) * 100), 100)}%` }}
                ></div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Choose an amount
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {predefinedAmounts.map((presetAmount) => (
                    <button
                      key={presetAmount}
                      type="button"
                      className={`py-2 rounded-md ${
                        amount === presetAmount.toString()
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                      onClick={() => handleAmountClick(presetAmount)}
                    >
                      ${presetAmount}
                    </button>
                  ))}
                </div>
                <div className="mt-2 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    placeholder="Other amount"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setDonationError('');
                    }}
                    min="1"
                    step="1"
                  />
                </div>
                {donationError && (
                  <p className="text-red-500 text-sm mt-1">{donationError}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={anonymous}
                  required={!anonymous}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700 dark:text-gray-300">
                  Make this donation anonymous
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Continue to Payment
              </button>
            </form>
          </div>
        ) : (
          <div className="p-4">
            <div className="mb-4 pb-4 border-b dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Donation amount:</span>
                <span className="font-semibold dark:text-white">${parseFloat(amount).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method
              </h4>
              
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <PayPalButtons
                  style={{ 
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'donate' 
                  }}
                  createOrder={handlePayPalCreateOrder}
                  onApprove={handlePayPalApprove}
                  onError={handlePayPalError}
                />
              )}
              
              {donationError && (
                <p className="text-red-500 text-sm mt-1">{donationError}</p>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-purple-600 dark:text-purple-400 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

DonationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    raised: PropTypes.number.isRequired,
    goal: PropTypes.number.isRequired
  }).isRequired,
  onDonationSuccess: PropTypes.func.isRequired,
  onDonationFailure: PropTypes.func.isRequired
};

export default DonationModal; 