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
     <div className="flex items-center gap-6 text-gray-500">
      <span className="flex items-center gap-2">
       <div className="w-5 h-5 bg-gray-300 rounded"></div>
       CoinGecko
      </span>
      <span className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-300 rounded"></div>
        FTX
      </span>
       <span className="flex items-center gap-2">
         <div className="w-5 h-5 bg-gray-300 rounded"></div>
              Phantom
       </span>
     </div>
    </div>
    <div className="relative">
     <div className="w-full aspect-square bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-3xl flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-purple-300/20 to-transparent"></div>
      <div className="w-64 h-64 bg-purple-700 rounded-full flex items-center justify-center relative z-10 border-8 border-purple-400/30"></div>
      <div className="w-32 h-32 bg-gradient-to-br from-purple-300 to-purple-500 rounded-lg transform rotate-12"></div>
     </div>
     <div className="absolute top-20 left-10 w-16 h-16 bg-purple-300 rounded-full opacity-60"></div>
     <div className="absolute bottom-20 right-10 w-20 h-20 bg-purple-400 rounded-full opacity-50"></div>
     <div className="absolute top-40 right-20 w-12 h-12 bg-white/20 rounded-full"></div>
    </div>
   </section>
   
   
  </div>
 )
}
