import React from 'react'
import { MdOutlineBusinessCenter } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-2 border-t border-gray-active-sidebar">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link 
              to="/" 
              className="flex items-center gap-3 hover:no-underline group transition-transform duration-300 hover:transform hover:translate-x-1"
            >
              <div className="p-2.5 rounded-lg bg-primary-3 shadow-lg group-hover:bg-primary-800 transition-colors duration-300">
                <MdOutlineBusinessCenter  size={28} />
              </div>
              <span className="font-montserrat font-bold text-2xl text-primary-800">
                JOBFINDER
              </span>
            </Link>
            <p className="text-gray-1 text-lg leading-relaxed">
              Empowering careers, connecting opportunities. Your journey to success starts here.
            </p>
            {/* Social Links */}
            <div className="flex gap-5 pt-4">
              {[
                { icon: FaFacebook, link: "#" },
                { icon: FaTwitter, link: "#" },
                { icon: FaInstagram, link: "#" },
                { icon: FaLinkedin, link: "#" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.link} 
                  className="text-gray-2 hover:text-primary-3 transition-all duration-300 hover:transform hover:scale-110"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 md:mt-0">
            <h3 className="text-white font-semibold text-xl mb-6 pb-2 border-b border-gray-active-sidebar">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { text: "Home", path: "/" },
                { text: "Find Jobs", path: "/jobs" },
                { text: "About Us", path: "/about" },
                { text: "Contact", path: "/contact" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-2 hover:text-primary-3 transition-all duration-300 flex items-center group"
                  >
                    <span className="transform group-hover:translate-x-2 transition-transform duration-300">
                      {link.text}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Job Seekers */}
          <div className="mt-8 md:mt-0">
            <h3 className="text-white font-semibold text-xl mb-6 pb-2 border-b border-gray-active-sidebar">
              For Job Seekers
            </h3>
            <ul className="space-y-4">
              {[
                { text: "Create Profile", path: "/profile" },
                { text: "Job Search", path: "/jobs/search" },
                { text: "Career Resources", path: "/resources" },
                { text: "Saved Jobs", path: "/saved-jobs" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-2 hover:text-primary-3 transition-all duration-300 flex items-center group"
                  >
                    <span className="transform group-hover:translate-x-2 transition-transform duration-300">
                      {link.text}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="mt-8 md:mt-0">
            <h3 className="text-white font-semibold text-xl mb-6 pb-2 border-b border-gray-active-sidebar">
              Contact Info
            </h3>
            <div className="space-y-4 text-gray-2">
              <div className="flex items-start space-x-3 group cursor-pointer hover:text-primary-3 transition-colors duration-300">
                <div className="mt-1">📍</div>
                <p>1234 Job Street<br/>Career City, ST 12345</p>
              </div>
              <div className="flex items-center space-x-3 group cursor-pointer hover:text-primary-3 transition-colors duration-300">
                <div>📞</div>
                <p>(123) 456-7890</p>
              </div>
              <div className="flex items-center space-x-3 group cursor-pointer hover:text-primary-3 transition-colors duration-300">
                <div>✉️</div>
                <p>info@jobfinder.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-active-sidebar">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-2 text-sm">
              © {currentYear} JobFinder. All rights reserved.
            </p>
            <div className="flex gap-8">
              {[
                { text: "Privacy Policy", path: "/privacy" },
                { text: "Terms of Service", path: "/terms" },
                { text: "Sitemap", path: "/sitemap" }
              ].map((link, index) => (
                <Link 
                  key={index}
                  to={link.path} 
                  className="text-gray-2 hover:text-primary-3 text-sm transition-all duration-300 hover:underline"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}




