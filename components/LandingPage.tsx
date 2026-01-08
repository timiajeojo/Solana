import React from 'react';

export default function SolanaLandingPage() {
 return (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
   <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
    <div className="flex items-center gap-2">
     <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center">
      <div className="w-6 h-1 bg-white rounded-full"></div>
     </div>
     <span className="text-xl font-bold text-gray-900">Solana Coins</span>
    </div>
    <div className="hidden md:flex items-center gap-8">
     <a href="#" className="text-gray-700 hover:text-purple-600 transition">Home</a>
     <a href="#" className="text-gray-700 hover:text-purple-600 transition">Features</a>
          <a href="#" className="text-gray-700 hover:text-purple-600 transition">Support</a>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition">
            Get Started
          </button>condition ? true : false
    </div>
   </nav>
   
   {/* Hero section */}
   <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
    <div>
     <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
      Earn Solana Through Sharing, <span className="text-purple-600">Trading</span> & <span className="text-purple-600">Lending</span>
     </h1>
     <p className="text-gray-600 text-lg mb-8">
      Share, trade, an lend your Solana tokens in a secure and decentralized way, connecting with a global community of readers.
     </p>
     <div className="flex gap-4 mb-12">
      <button className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition font-semibold">
       Get Started
      </button>
      <button className="bg-white text-gray-700 px-8 py-3 rounded-full hover:bg-gray-50 transition font-semibold border border-gray-300">
       Learn More
      </button>
     </div>
     
    </div>
   </section>
  </div>
 )
}
