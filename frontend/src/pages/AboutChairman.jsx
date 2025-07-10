import React from 'react';
import { Mail, Phone, MapPin, Calendar, Award, BookOpen, Users, GraduationCap, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AboutChairman = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-200 hover:text-white mb-6">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                About Our Chairman
              </h1>
              <p className="text-xl text-slate-200 leading-relaxed">
                Leading the Department of Computer Science and Engineering with vision, 
                dedication, and a commitment to academic excellence.
              </p>
            </div>
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-slate-300 shadow-2xl">
                <img 
                  src="/chairman-photo.jpg" 
                  alt="Chairman" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                Professor Dr. [Chairman Name]
              </h2>
              
              <div className="prose max-w-none text-slate-600">
                <p className="text-lg leading-relaxed mb-6">
                  With over two decades of experience in computer science education and research, 
                  our chairman has been instrumental in shaping the future of technology education 
                  at our institution. His vision and leadership have transformed our department into 
                  a center of excellence.
                </p>
                
                <p className="text-lg leading-relaxed mb-6">
                  Under his guidance, the department has achieved remarkable milestones in research, 
                  student placement, and industry collaboration. His commitment to innovation and 
                  academic excellence continues to inspire both faculty and students.
                </p>
                
                <p className="text-lg leading-relaxed">
                  He believes in fostering an environment where creativity meets technology, 
                  preparing students not just for today's challenges but for tomorrow's opportunities.
                </p>
              </div>
            </div>

            {/* Research & Achievements */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Award className="text-slate-600" />
                Research & Achievements
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Research Areas</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Artificial Intelligence & Machine Learning</li>
                    <li>• Data Science & Analytics</li>
                    <li>• Software Engineering</li>
                    <li>• Cybersecurity</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Key Achievements</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li>• 50+ Research Publications</li>
                    <li>• 15+ Years Department Leadership</li>
                    <li>• Multiple Research Awards</li>
                    <li>• Industry Collaboration Expert</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="text-slate-500" size={20} />
                  <span>chairman@university.edu</span>
                </div>
                
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="text-slate-500" size={20} />
                  <span>+1 (555) 123-4567</span>
                </div>
                
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin className="text-slate-500" size={20} />
                  <span>Room 301, CSE Building</span>
                </div>
                
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="text-slate-500" size={20} />
                  <span>Mon-Fri, 9:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Department Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="text-slate-500" size={16} />
                    <span className="text-slate-600">Faculty Members</span>
                  </div>
                  <span className="font-bold text-slate-800">25+</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="text-slate-500" size={16} />
                    <span className="text-slate-600">Students</span>
                  </div>
                  <span className="font-bold text-slate-800">800+</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-slate-500" size={16} />
                    <span className="text-slate-600">Research Projects</span>
                  </div>
                  <span className="font-bold text-slate-800">30+</span>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-slate-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Office Hours</h3>
              
              <div className="space-y-3 text-slate-600">
                <div className="flex justify-between">
                  <span>Monday - Wednesday</span>
                  <span className="font-medium">10:00 AM - 12:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Thursday - Friday</span>
                  <span className="font-medium">2:00 PM - 4:00 PM</span>
                </div>
                <div className="text-sm text-slate-500 mt-4">
                  * Appointments can be scheduled via email
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="bg-slate-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
          <p className="text-xl text-slate-200 max-w-4xl mx-auto leading-relaxed">
            "To create a world-class learning environment where students develop not just technical skills, 
            but also the critical thinking and innovation mindset needed to solve tomorrow's challenges. 
            Our goal is to bridge the gap between academic excellence and industry requirements."
          </p>
          <div className="mt-8">
            <button className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Schedule a Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutChairman;
