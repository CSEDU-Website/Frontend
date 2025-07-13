import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Bell, User, ChevronRight, ExternalLink, FileText, Pin } from 'lucide-react';

// Components
import Navbar from '../components/Navbar';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  
  // Get user information if logged in
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  const isLoggedIn = user.isAuthenticated;
  
  // Fetch notices when component mounts
  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);
  
  // Fetch all upcoming notices using the API
  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      // Notices are sent to all batches, so no batch filtering needed
      const endpoint = `${BACKEND_URL}/student/notice/upcoming`;
      
      const response = await axios.get(endpoint);
      
      // Sort notices by date and time (newest first)
      const sortedNotices = response.data.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      
      setNotices(sortedNotices);
      
      // Set the first notice as selected if available
      if (sortedNotices.length > 0) {
        setSelectedNotice(sortedNotices[0]);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      setError('Failed to load notices. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch a specific notice by ID
  const fetchNoticeById = async (noticeId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/student/notice/${noticeId}`);
      setSelectedNotice(response.data);
    } catch (error) {
      console.error(`Error fetching notice ${noticeId}:`, error);
    }
  };
  
  // Handle selecting a notice from the list
  const handleNoticeClick = (notice) => {
    // Fetch full notice details if we need to
    if (notice.id !== selectedNotice?.id) {
      fetchNoticeById(notice.id);
    }
    
    // Scroll to the top on mobile
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };
  
  return (
    <>
      <Navbar />
      
      <div className="bg-slate-100 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Notice Board</h1>
              <p className="text-slate-600 mt-2">
                Stay updated with the latest announcements and notifications for all students
              </p>
            </div>
          </div>
          
          {/* Loading, Error and Empty states */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
              {error}
            </div>
          ) : notices.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h2 className="text-xl font-semibold text-slate-800 mb-2">No Notices Available</h2>
              <p className="text-slate-600">
                There are currently no notices to display.
                {!isLoggedIn && (
                  <span className="block mt-2">
                    <Link to="/login" className="text-orange-500 hover:underline">
                      Log in
                    </Link> to access your student dashboard.
                  </span>
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Notices List - Left Column */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-4 bg-slate-800 text-white">
                    <h2 className="font-semibold flex items-center">
                      <Bell className="mr-2 h-4 w-4" />
                      All Notices ({notices.length})
                    </h2>
                  </div>
                  
                  <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
                    {notices.map((notice) => (
                      <div 
                        key={notice.id}
                        className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${
                          selectedNotice?.id === notice.id ? 'bg-orange-50 border-l-4 border-orange-500' : ''
                        }`}
                        onClick={() => handleNoticeClick(notice)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-slate-800 line-clamp-2">{notice.title}</h3>
                            
                            <div className="mt-2 flex items-center text-xs text-slate-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{formatDate(notice.date).split(',')[0]}</span>
                              
                              {notice.batch && (
                                <>
                                  <span className="mx-2">•</span>
                                  <User className="h-3 w-3 mr-1" />
                                  <span>Batch {notice.batch}</span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <ChevronRight className={`h-4 w-4 text-slate-400 ${
                            selectedNotice?.id === notice.id ? 'text-orange-500' : ''
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Notice Detail - Right Column */}
              <div className="md:col-span-2">
                {selectedNotice ? (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Notice Header */}
                    <div className="p-6 border-b border-slate-200">
                      <div className="flex items-start justify-between">
                        <h2 className="text-2xl font-bold text-slate-800">{selectedNotice.title}</h2>
                        
                        {selectedNotice.batch && (
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                            Batch {selectedNotice.batch}
                          </span>
                        )}
                      </div>
                      
                      {selectedNotice.sub_title && (
                        <p className="text-slate-600 mt-2">{selectedNotice.sub_title}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 mt-4">
                        <div className="flex items-center text-sm text-slate-500">
                          <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                          <span>{formatDate(selectedNotice.date)}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-slate-500">
                          <User className="h-4 w-4 mr-2 text-slate-400" />
                          <span>From: {selectedNotice.notice_from}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Notice Content */}
                    <div className="p-6">
                      <div className="prose max-w-none">
                        {/* Format the content with paragraphs */}
                        {selectedNotice.content.split('\n').map((paragraph, idx) => (
                          <p key={idx} className="mb-4 text-slate-700 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                      
                      {/* Attachments (if available) */}
                      {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-slate-200">
                          <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Attachments
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedNotice.attachments.map((attachment, idx) => (
                              <a 
                                key={idx}
                                href={attachment.url} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <FileText className="h-5 w-5 text-slate-500 mr-2" />
                                <span className="text-sm text-slate-700 flex-1 truncate">
                                  {attachment.name || `Attachment ${idx + 1}`}
                                </span>
                                <ExternalLink className="h-4 w-4 text-slate-400" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <Bell className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Select a Notice</h2>
                    <p className="text-slate-600">
                      Choose a notice from the list to view its details
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Important Information Card */}
          <div className="mt-8 bg-orange-50 border border-orange-200 p-6 rounded-xl">
            <div className="flex items-start">
              <Pin className="h-5 w-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">Important Information</h3>
                <p className="text-orange-700 text-sm">
                  All official notices are also sent via email. Make sure your email address is up to date in your profile settings.
                  {isLoggedIn ? (
                    <Link to="/settingspage" className="text-orange-600 hover:underline ml-1">
                      Update your profile
                    </Link>
                  ) : (
                    <Link to="/login" className="text-orange-600 hover:underline ml-1">
                      Log in to update your profile
                    </Link>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticeBoard;