import React, { useState } from 'react';
import { Search, Home, Compass, Users, UserPlus, Video, ShoppingBag, Settings, Image, FileVideo, Activity, Heart } from 'lucide-react';

const Homepages = () => {
  const [activeTab, setActiveTab] = useState('Community');
  const [activeCommunityTab, setActiveCommunityTab] = useState('Forum');

  const tabs = [
    { id: 'Feed', icon: <Home size={20} /> },
    { id: 'Discover', icon: <Compass size={20} /> },
    { id: 'Friends', icon: <UserPlus size={20} /> },
    { id: 'Community', icon: <Users size={20} /> },
    { id: 'Videos', icon: <Video size={20} /> },
    { id: 'Marketplace', icon: <ShoppingBag size={20} /> },
    { id: 'Settings', icon: <Settings size={20} /> },
  ];

  const recentlyVisited = [
    { id: 'UI/UX Community', icon: 'UI/UX', hasNotification: true },
    { id: 'Serious coding', icon: '</>' },
    { id: 'AndroidDev help', icon: 'A' },
  ];

  const communityTabs = [
    { id: 'About' },
    { id: 'Forum' },
    { id: 'Members' },
    { id: 'Events' },
  ];

  const postOptions = [
    { id: 'Image', icon: <Image size={20} /> },
    { id: 'Video/GIF', icon: <FileVideo size={20} /> },
    { id: 'Activity/Poll', icon: <Activity size={20} /> },
    { id: 'Feelings', icon: <Heart size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col h-full">
        <div className="p-4 border-b flex items-center">
          <div className="bg-blue-500 text-white rounded-md p-1">
            <Users size={20} />
          </div>
          <span className="ml-2 font-bold text-gray-800">FORUMBOARD</span>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b">
          <div className="flex items-center">
            <img src="/api/placeholder/40/40" alt="Profile" className="w-10 h-10 rounded-full" />
            <div className="ml-3">
              <div className="flex items-center">
                <p className="font-semibold text-sm">Jason Smith</p>
                <div className="ml-1 text-blue-500">
                  <span className="bg-blue-500 text-white rounded-full text-xs p-1">✓</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">@JasonS</p>
            </div>
          </div>
          <div className="flex justify-between mt-3 text-sm">
            <div className="text-center">
              <p className="font-semibold">5.5k</p>
              <p className="text-gray-500 text-xs">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">548</p>
              <p className="text-gray-500 text-xs">Following</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">113</p>
              <p className="text-gray-500 text-xs">Posts</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 overflow-y-auto">
          <nav className="mt-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center w-full p-3 text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white rounded-md mx-2'
                    : 'text-gray-700 hover:bg-gray-100 rounded-md mx-2'
                }`}
              >
                <span className="mr-3">{tab.icon}</span>
                <span>{tab.id}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 px-4">
            <h3 className="text-xs font-semibold text-gray-500 mb-2">LAST VISITED</h3>
            {recentlyVisited.map((item) => (
              <div key={item.id} className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer relative">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white ${
                  item.id.includes('UI/UX') ? 'bg-blue-500' : 
                  item.id.includes('coding') ? 'bg-gray-700' : 'bg-purple-500'
                }`}>
                  <span className="text-xs">{item.icon}</span>
                </div>
                <span className="ml-2 text-sm">{item.id}</span>
                {item.hasNotification && (
                  <span className="absolute right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white p-4 shadow-sm flex justify-between items-center">
          <h1 className="text-xl font-semibold">Community</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Find friends, communities or pages here"
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm w-64 focus:outline-none"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {activeTab === 'Community' && (
            <div className="bg-white rounded-lg shadow">
              {/* Community Header */}
              <div className="p-4 border-b">
                <div className="flex items-center">
                  <div className="bg-blue-500 text-white rounded-lg w-12 h-12 flex items-center justify-center">
                    <span className="font-bold">UIX</span>
                  </div>
                  <div className="ml-3">
                    <div className="text-xs text-gray-500">Member since July 2023</div>
                    <h2 className="font-bold text-lg">UI/UX Community forum</h2>
                    <div className="text-sm text-gray-600">Public Community • 56.3k members</div>
                  </div>
                </div>
                
                <div className="flex mt-4 justify-between items-center">
                  <div className="flex">
                    {communityTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveCommunityTab(tab.id)}
                        className={`mr-4 pb-2 px-1 font-medium ${
                          activeCommunityTab === tab.id
                            ? 'text-blue-500 border-b-2 border-blue-500'
                            : 'text-gray-500'
                        }`}
                      >
                        {tab.id}
                      </button>
                    ))}
                  </div>
                  
                  <button className="text-gray-500">
                    <span className="font-bold">•••</span>
                  </button>
                </div>
              </div>

              {/* Create Post */}
              <div className="p-4 border-b">
                <div className="flex items-center">
                  <img src="/vite.svg" alt="User" className="w-10 h-10 rounded-full" />
                  <span className="ml-3 text-gray-500 text-sm">Start post in this group...</span>
                </div>
                <div className="flex justify-between mt-4">
                  {postOptions.map((option) => (
                    <button key={option.id} className="flex items-center text-gray-500 text-sm">
                      <span className="mr-1">{option.icon}</span>
                      <span>{option.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts */}
              <div className="p-4 border-b">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex">
                    <img src="/api/placeholder/40/40" alt="Post author" className="w-10 h-10 rounded-full" />
                    <div className="ml-2">
                      <div className="flex items-center">
                        <p className="font-semibold text-sm">Ali Husni</p>
                        <button className="ml-2 text-xs text-blue-500 font-medium">Follow</button>
                      </div>
                      <p className="text-xs text-gray-500">25 minutes ago</p>
                    </div>
                  </div>
                  <button className="text-gray-500">•••</button>
                </div>

                <div className="mb-4">
                  <p className="text-sm">
                    Hi, folks 👋<br />
                    This is my exploration about Creative digital agency called Rooster Agency. Please enjoy my post and follow me, press Love to support and don't forget to give feedback. 😊
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Feed' && (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-bold text-xl mb-4">Your Feed</h2>
              <div className="border-b pb-4 mb-4">
                <div className="flex items-center mb-3">
                  <img src="/api/placeholder/40/40" alt="User" className="w-10 h-10 rounded-full" />
                  <input 
                    type="text" 
                    placeholder="What's on your mind?" 
                    className="ml-3 bg-gray-100 rounded-full px-4 py-2 w-full text-sm"
                  />
                </div>
                <div className="flex justify-between">
                  {postOptions.map((option) => (
                    <button key={option.id} className="flex items-center text-gray-500 text-sm">
                      <span className="mr-1">{option.icon}</span>
                      <span>{option.id}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4 pb-4 border-b">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex">
                    <img src="/api/placeholder/40/40" alt="Post author" className="w-10 h-10 rounded-full" />
                    <div className="ml-2">
                      <p className="font-semibold text-sm">WebDev Community</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <button className="text-gray-500">•••</button>
                </div>
                <p className="text-sm mb-3">
                  🚀 Exciting news! We're hosting a Hackathon next month focused on AI-powered web applications.
                  Registration is now open. Limited spots available!
                </p>
                <div className="bg-gray-100 rounded-lg p-3 text-sm">
                  <h3 className="font-bold">Web AI Hackathon 2025</h3>
                  <p className="text-gray-600 text-xs mt-1">April 15-17, 2025 • Virtual Event</p>
                  <button className="mt-2 bg-blue-500 text-white rounded-md px-3 py-1 text-xs">Register Now</button>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex">
                    <img src="/api/placeholder/40/40" alt="Post author" className="w-10 h-10 rounded-full" />
                    <div className="ml-2">
                      <p className="font-semibold text-sm">Sarah Johnson</p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <button className="text-gray-500">•••</button>
                </div>
                <p className="text-sm mb-3">
                  Just finished my new portfolio website using React and Tailwind CSS. Would love some feedback from the community! 💻✨
                </p>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <span className="text-gray-500">Portfolio Website Preview</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Discover' && (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-bold text-xl mb-4">Discover</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="h-32 bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-500 font-bold">UI/UX Workshop</span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold">Design Systems Workshop</h3>
                    <p className="text-xs text-gray-500 mb-2">By DesignCommunity • March 20, 2025</p>
                    <p className="text-sm mb-3">Learn how to create and implement design systems for large scale applications.</p>
                    <button className="bg-blue-500 text-white rounded-full px-3 py-1 text-xs">Join Event</button>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="h-32 bg-green-100 flex items-center justify-center">
                    <span className="text-green-500 font-bold">React Developers</span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold">React Developers Community</h3>
                    <p className="text-xs text-gray-500 mb-2">32.4k members • 20+ posts daily</p>
                    <p className="text-sm mb-3">Join the largest community of React developers to share knowledge and collaborate.</p>
                    <button className="bg-green-500 text-white rounded-full px-3 py-1 text-xs">Join Community</button>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="h-32 bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-500 font-bold">Web3 Hackathon</span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold">Blockchain Developer Hackathon</h3>
                    <p className="text-xs text-gray-500 mb-2">By CryptoDevs • April 5-7, 2025</p>
                    <p className="text-sm mb-3">Build the next generation of decentralized applications with $50k in prizes.</p>
                    <button className="bg-purple-500 text-white rounded-full px-3 py-1 text-xs">Register</button>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="h-32 bg-yellow-100 flex items-center justify-center">
                    <span className="text-yellow-500 font-bold">JavaScript Masters</span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold">JavaScript Masters Community</h3>
                    <p className="text-xs text-gray-500 mb-2">45.2k members • Very active</p>
                    <p className="text-sm mb-3">Advanced JavaScript techniques, best practices and job opportunities.</p>
                    <button className="bg-yellow-500 text-white rounded-full px-3 py-1 text-xs">Join Community</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Friends' && (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-bold text-xl mb-4">Friends</h2>
              
              <div className="flex justify-between mb-4">
                <button className="bg-blue-500 text-white rounded-md px-4 py-2 text-sm">Find Friends</button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search friends"
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm w-64 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Friend Requests (3)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3 flex">
                    <img src="/api/placeholder/50/50" alt="Friend" className="w-12 h-12 rounded-full" />
                    <div className="ml-3 flex-1">
                      <p className="font-semibold">Mike Johnson</p>
                      <p className="text-xs text-gray-500 mb-2">5 mutual friends</p>
                      <div className="flex space-x-2">
                        <button className="bg-blue-500 text-white rounded-md px-3 py-1 text-xs">Accept</button>
                        <button className="bg-gray-200 text-gray-700 rounded-md px-3 py-1 text-xs">Decline</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3 flex">
                    <img src="/api/placeholder/50/50" alt="Friend" className="w-12 h-12 rounded-full" />
                    <div className="ml-3 flex-1">
                      <p className="font-semibold">Sara Williams</p>
                      <p className="text-xs text-gray-500 mb-2">2 mutual friends</p>
                      <div className="flex space-x-2">
                        <button className="bg-blue-500 text-white rounded-md px-3 py-1 text-xs">Accept</button>
                        <button className="bg-gray-200 text-gray-700 rounded-md px-3 py-1 text-xs">Decline</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Your Friends</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-3 flex">
                      <img src="/api/placeholder/50/50" alt="Friend" className="w-12 h-12 rounded-full" />
                      <div className="ml-3">
                        <p className="font-semibold">Friend {i + 1}</p>
                        <p className="text-xs text-gray-500 mb-1">Software Developer</p>
                        <button className="text-blue-500 text-xs">Message</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Homepages;