import React from 'react';
import Header from './components/Header';
import Footer from '../../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;