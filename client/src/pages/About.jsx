import React from 'react';
import { MetaData } from '../components/MetaData';
import { MdBusinessCenter, MdPeople, MdTrendingUp, MdStar } from 'react-icons/md';

export const About = () => {
  return (
    <>
      <MetaData title="About" />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-primary-2 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About JobFinder</h1>
            <p className="text-gray-2 text-lg max-w-2xl mx-auto">
              Your trusted partner in career advancement and professional growth
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 -mt-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <MdBusinessCenter />, number: "10K+", label: "Jobs Posted" },
              { icon: <MdPeople />, number: "50K+", label: "Active Users" },
              { icon: <MdTrendingUp />, number: "5K+", label: "Companies" },
              { icon: <MdStar />, number: "95%", label: "Success Rate" }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-8 shadow-lg text-center">
                <div className="text-primary-3 text-3xl mb-4 flex justify-center">{stat.icon}</div>
                <h3 className="text-3xl font-bold mb-2">{stat.number}</h3>
                <p className="text-gray-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-yellow-500">About Us</h2>
              <p className="text-gray-700">
                At JobLane, we're more than just a job application platform – we're your partners
                in realizing your professional aspirations. Our mission is to connect talented
                individuals with remarkable opportunities that elevate their careers and enrich
                their lives.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-yellow-500">What Sets Us Apart</h2>
              <ul className="space-y-4">
                <li>
                  <span className="font-semibold">Tailored Matches:</span>
                  <p className="text-gray-700">
                    Our advanced matching algorithms ensure that your skills align perfectly
                    with the roles you're interested in.
                  </p>
                </li>
                <li>
                  <span className="font-semibold">Exceptional Support:</span>
                  <p className="text-gray-700">
                    Our dedicated support team is always ready to assist you, from optimizing
                    your profile to preparing for interviews.
                  </p>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-yellow-500">Join Our Community</h2>
              <p className="text-gray-700 mb-4">
                When you join JobLane, you're becoming part of a dynamic community of
                professionals, recruiters, and mentors. Together, we're shaping the future
                of work, one opportunity at a time.
              </p>
              <p className="text-gray-700">
                Thank you for choosing JobLane as your partner in career advancement.
                Here's to unlocking a world of possibilities together!
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Innovation",
                  description: "Continuously improving our platform with cutting-edge technology"
                },
                {
                  title: "Integrity",
                  description: "Maintaining the highest standards of professional ethics"
                },
                {
                  title: "Impact",
                  description: "Making a real difference in people's careers and lives"
                }
              ].map((value, index) => (
                <div key={index} className="text-center p-6">
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

