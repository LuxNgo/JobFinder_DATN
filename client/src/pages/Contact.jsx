import React from "react";
import { MetaData } from "../components/MetaData";
import { BsFacebook } from "react-icons/bs";
import {
  AiFillInstagram,
  AiOutlineTwitter,
  AiTwotoneMail,
} from "react-icons/ai";
import { MdEmail, MdPhone, MdLocationOn, MdSend } from 'react-icons/md';

export const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <>
      <MetaData title="Contact" />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-primary-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-white text-lg max-w-2xl mx-auto">
              We're excited to hear from you! Get in touch with us for any questions or support.
            </p>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="container mx-auto px-4 -mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-primary-3 mb-4">
                <MdLocationOn className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Address</h3>
              <p className="text-gray-2">JobLane, Wall Street</p>
              <p className="text-gray-2">New York, 123, United States</p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-primary-3 mb-4">
                <MdEmail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-2">info@joblane.com</p>
              <p className="text-gray-2">support@joblane.com</p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-primary-3 mb-4">
                <MdPhone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-2">+123-456-7890</p>
              <p className="text-gray-2">+123-456-7891</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-3 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-3 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-3 focus:border-transparent"
                  required
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 bg-primary-3 text-white font-semibold rounded-lg hover:bg-primary-800 transition duration-300"
                >
                  <MdSend className="mr-2" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Social Media */}
        <div className="container mx-auto px-4 pb-20">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-6">Connect With Us</h3>
            <div className="flex justify-center gap-6">
              <BsFacebook className="w-8 h-8 text-gray-600 hover:text-primary-3 cursor-pointer transition-colors" />
              <AiFillInstagram className="w-8 h-8 text-gray-600 hover:text-primary-3 cursor-pointer transition-colors" />
              <AiOutlineTwitter className="w-8 h-8 text-gray-600 hover:text-primary-3 cursor-pointer transition-colors" />
              <AiTwotoneMail className="w-8 h-8 text-gray-600 hover:text-primary-3 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

