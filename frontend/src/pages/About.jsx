import React from 'react';
import { Heart, Users, Globe, Target } from 'lucide-react';
import PropTypes from 'prop-types';

const About = ({ darkMode }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">About FundHope</h1>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            FundHope is dedicated to connecting passionate change-makers with the resources they need to make a difference.
            We believe that everyone has the power to create positive change, and our platform makes it easier to turn
            compassionate ideas into impactful reality.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">How It Works</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            Our platform provides a simple, transparent, and secure way for individuals and organizations to raise funds
            for causes they care about. Whether you're supporting education, healthcare, emergency relief, or community
            development, FundHope offers the tools to help you succeed.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Create</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Start your campaign with a compelling story and clear goals.</p>
            </div>
            
            <div className="text-center p-4">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Share</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Spread the word and reach supporters through social networks.</p>
            </div>
            
            <div className="text-center p-4">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Collect</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Receive funds securely and keep supporters updated on your progress.</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Transparency</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We believe in complete transparency. Campaign creators can easily share updates,
                and donors can see exactly how their contributions are making an impact.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Accessibility</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our platform is designed to be accessible to everyone, making it easy for anyone
                to create change regardless of technical experience.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Security</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We prioritize the security of our users&apos; data and donations, employing industry-leading
                security measures to protect both campaign creators and donors.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Community</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We're building more than a platform - we're creating a community of changemakers
                who support and inspire each other to create positive impact.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6 dark:text-white">Ready to Make a Difference?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/discover" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Discover Campaigns
            </a>
            <a href="/create-campaign" className="border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors">
              Start a Campaign
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

About.propTypes = {
  darkMode: PropTypes.bool
};

export default About;