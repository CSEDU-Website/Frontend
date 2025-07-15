import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Users, BookOpen, Award, TrendingUp, Star, ExternalLink, Mail, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);

  // Mock data for news and research
  const newsItems = [
    {
      id: 1,
      title: "CSE Department Receives Excellence Award 2024",
      excerpt: "Our department has been recognized for outstanding contributions to computer science education and research.",
      date: "2024-01-15",
      category: "Achievement",
      image: "/placeholder-news1.jpg"
    },
    {
      id: 2,
      title: "Revolutionary AI Research Published in Nature",
      excerpt: "Faculty members publish groundbreaking research on machine learning applications in healthcare.",
      date: "2024-01-10",
      category: "Research",
      image: "/placeholder-news2.jpg"
    },
    {
      id: 3,
      title: "Annual Tech Summit 2024 Announced",
      excerpt: "Join us for the biggest technology conference featuring industry leaders and cutting-edge innovations.",
      date: "2024-01-08",
      category: "Event",
      image: "/placeholder-news3.jpg"
    },
    {
      id: 4,
      title: "New Quantum Computing Lab Inaugurated",
      excerpt: "State-of-the-art quantum computing facility opens, expanding research capabilities in quantum algorithms.",
      date: "2024-01-05",
      category: "Infrastructure",
      image: "/placeholder-news4.jpg"
    }
  ];

  const recentEvents = [
    {
      id: 1,
      title: "International Conference on AI",
      date: "2024-02-20",
      location: "CSE Auditorium",
      attendees: "500+"
    },
    {
      id: 2,
      title: "Alumni Networking Event",
      date: "2024-02-18",
      location: "University Hall",
      attendees: "200+"
    },
    {
      id: 3,
      title: "Research Paper Presentation",
      date: "2024-02-15",
      location: "Conference Room",
      attendees: "100+"
    }
  ];

  const facultySpotlight = {
    name: "Dr. Sarah Johnson",
    position: "Professor of Computer Science",
    specialization: "Artificial Intelligence & Machine Learning",
    bio: "Dr. Johnson is a leading expert in AI with over 15 years of research experience. She has published 50+ papers and leads breakthrough research in neural networks.",
    image: "/placeholder-faculty.jpg",
    achievements: ["AI Research Excellence Award 2023", "50+ Publications", "Lead Researcher on 5 Major Projects"]
  };

  const researchHighlights = [
    {
      id: 1,
      title: "Revolutionary AI in Healthcare",
      excerpt: "Developing intelligent systems for early disease detection using machine learning algorithms.",
      image: "/placeholder-research1.jpg",
      category: "AI & Healthcare",
      funding: "$2.5M",
      duration: "2023-2026"
    },
    {
      id: 2,
      title: "Quantum Computing Breakthrough",
      excerpt: "Pioneering research in quantum algorithms for cryptography and optimization problems.",
      image: "/placeholder-research2.jpg",
      category: "Quantum Computing",
      funding: "$1.8M",
      duration: "2023-2025"
    },
    {
      id: 3,
      title: "Sustainable Smart Cities",
      excerpt: "IoT-based solutions for energy-efficient urban infrastructure management.",
      image: "/placeholder-research3.jpg",
      category: "IoT & Sustainability",
      funding: "$3.2M",
      duration: "2024-2027"
    }
  ];

  const studentResources = [
    { title: "Course Registration", description: "Register for upcoming semester courses", icon: "📚", link: "/courses" },
    { title: "Academic Calendar", description: "View important dates and deadlines", icon: "📅", link: "/calendar" },
    { title: "Lab Resources", description: "Access lab manuals and equipment", icon: "🔬", link: "/labs" },
    { title: "Career Services", description: "Job placement and internship opportunities", icon: "💼", link: "/careers" },
    { title: "Research Opportunities", description: "Join ongoing research projects", icon: "🔍", link: "/research" },
    { title: "Student Support", description: "Academic and personal counseling", icon: "🤝", link: "/support" }
  ];

  // Animated counter effect
  useEffect(() => {
    const animateCounter = (target, setter) => {
      let current = 0;
      const increment = target / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 20);
    };

    animateCounter(1200, setStudentCount);
    animateCounter(85, setTeacherCount);
    animateCounter(45, setStaffCount);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % newsItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [newsItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % newsItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  const CircularProgress = ({ value, max, label, color = "stroke-slate-600" }) => {
    const percentage = (value / max) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-slate-200"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              className={`${color} transition-all duration-1000 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-slate-800">{value}</span>
          </div>
        </div>
        <span className="mt-2 text-sm font-medium text-slate-600">{label}</span>
      </div>
    );
  };

  const FacultySpotlight = () => (
    <div className="bg-gradient-to-r from-slate-700 to-gray-800 text-white rounded-2xl p-8 mb-8">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="text-yellow-400" size={20} />
            <span className="text-sm font-medium text-slate-300">Faculty Spotlight</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">{facultySpotlight.name}</h3>
          <p className="text-slate-300 mb-1">{facultySpotlight.position}</p>
          <p className="text-slate-400 text-sm mb-4">{facultySpotlight.specialization}</p>
          <p className="text-slate-200 mb-6">{facultySpotlight.bio}</p>
          <div className="space-y-2">
            {facultySpotlight.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Award className="text-yellow-400" size={14} />
                <span className="text-slate-300">{achievement}</span>
              </div>
            ))}
          </div>
          <Link to="/people" className="inline-block mt-4 bg-white text-slate-800 px-6 py-2 rounded-lg hover:bg-slate-100 transition-colors">
            View Full Profile
          </Link>
        </div>
        <div className="relative">
          <img 
            src={facultySpotlight.image} 
            alt={facultySpotlight.name}
            className="w-full h-80 object-cover rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  const ResearchHighlight = ({ research }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img 
        src={research.image} 
        alt={research.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
            {research.category}
          </span>
          <span className="text-sm text-slate-500">
            {research.duration}
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{research.title}</h3>
        <p className="text-slate-600 mb-4">{research.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-green-600">
            Funding: {research.funding}
          </span>
          <button className="flex items-center gap-1 text-slate-600 hover:text-slate-800 transition-colors">
            <span className="text-sm">Learn More</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const StudentResourceCard = ({ resource }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      <div className="text-center">
        <div className="text-4xl mb-3">{resource.icon}</div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{resource.title}</h3>
        <p className="text-slate-600 text-sm mb-4">{resource.description}</p>
        <Link 
          to={resource.link}
          className="inline-block bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm"
        >
          Access Now
        </Link>
      </div>
    </div>
  );

  const NewsletterSection = () => (
    <div className="bg-gradient-to-r from-slate-800 to-gray-800 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-slate-200 mb-8">Subscribe to our newsletter for the latest news, events, and research updates</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="flex-1 px-4 py-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <button className="bg-slate-600 hover:bg-slate-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
            <Mail size={16} />
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Enhanced Hero section */}
      <section className="bg-gradient-to-r from-slate-700 via-gray-800 to-slate-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Department of Computer Science & Engineering
            </h1>
            <h2 className="text-2xl md:text-3xl mb-8 animate-fade-in-delay">University of Dhaka</h2>
            <p className="text-xl max-w-4xl mx-auto text-slate-200 mb-8 animate-fade-in-delay-2">
              Pioneering excellence in computer science education and research since 1992. 
              Shaping the future of technology through innovation and discovery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chairman" className="bg-white text-slate-800 px-8 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                Learn More About Us
              </Link>
              <Link to="/apply" className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-slate-800 transition-colors">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Latest News & Updates</h2>
            <p className="text-slate-600 text-lg">Stay informed about our latest achievements and developments</p>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {newsItems.map((item) => (
                  <div key={item.id} className="w-full flex-shrink-0">
                    <div className="bg-gradient-to-r from-slate-800 to-gray-800 text-white p-8 md:p-12 rounded-2xl mx-2">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-slate-600 rounded-full text-sm font-medium">
                              {item.category}
                            </span>
                            <span className="text-slate-300 text-sm flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold mb-4">{item.title}</h3>
                          <p className="text-slate-200 text-lg mb-6">{item.excerpt}</p>
                          <button className="bg-white text-slate-800 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                            Read More
                          </button>
                        </div>
                        <div className="relative">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-64 object-cover rounded-lg shadow-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft size={24} className="text-slate-600" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-slate-100 transition-colors"
            >
              <ChevronRight size={24} className="text-slate-600" />
            </button>
            
            <div className="flex justify-center mt-6 space-x-2">
              {newsItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-slate-600' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Spotlight */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Faculty Spotlight</h2>
            <p className="text-slate-600 text-lg">Meet our distinguished faculty members making groundbreaking contributions</p>
          </div>
          <FacultySpotlight />
          <div className="text-center">
            <Link to="/people" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
              <span>View All Faculty</span>
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Research Highlights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Research Highlights</h2>
            <p className="text-slate-600 text-lg">Discover our cutting-edge research projects and innovations</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {researchHighlights.map((research) => (
              <ResearchHighlight key={research.id} research={research} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/research" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
              <span>Explore All Research</span>
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Student Resources */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Student Resources</h2>
            <p className="text-slate-600 text-lg">Access essential tools and information for your academic journey</p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {studentResources.map((resource, index) => (
              <StudentResourceCard key={index} resource={resource} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Recent Events</h2>
            <p className="text-slate-600 text-lg">Highlights from our academic and research activities</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {recentEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center">
                    <Calendar className="text-white" size={20} />
                  </div>
                  <span className="text-sm font-medium text-slate-500">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h3>
                <p className="text-slate-600 mb-4">{event.location}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{event.attendees} attendees</span>
                  <Award className="text-slate-400" size={16} />
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/events" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
              <span>View All Events</span>
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Our Community</h2>
            <p className="text-slate-600 text-lg">Building the future of technology together</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 justify-items-center">
            <div className="text-center">
              <CircularProgress 
                value={studentCount} 
                max={1200} 
                label="Current Students" 
                color="stroke-blue-500"
              />
              <p className="mt-4 text-slate-600">Undergraduate & Graduate</p>
            </div>
            <div className="text-center">
              <CircularProgress 
                value={teacherCount} 
                max={85} 
                label="Faculty Members" 
                color="stroke-green-500"
              />
              <p className="mt-4 text-slate-600">Professors & Researchers</p>
            </div>
            <div className="text-center">
              <CircularProgress 
                value={staffCount} 
                max={45} 
                label="Support Staff" 
                color="stroke-purple-500"
              />
              <p className="mt-4 text-slate-600">Administrative & Technical</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Enhanced Content section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <TrendingUp className="text-slate-600 mr-3" size={24} />
              <h2 className="text-2xl font-bold text-slate-800">Quick Links</h2>
            </div>
            <ul className="space-y-3">
              <li><Link to="/apply" className="text-slate-600 hover:text-slate-800 transition-colors">Apply for Admission</Link></li>
              <li><Link to="/admission-hub" className="text-slate-600 hover:text-slate-800 transition-colors">Course Catalog</Link></li>
              <li><Link to="/people" className="text-slate-600 hover:text-slate-800 transition-colors">Faculty</Link></li>
              <li><Link to="https://cseduaa.org/" className="text-slate-600 hover:text-slate-800 transition-colors">Alumni Network</Link></li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <BookOpen className="text-slate-600 mr-3" size={24} />
              <h2 className="text-2xl font-bold text-slate-800">Academic Programs</h2>
            </div>
            <ul className="space-y-4">
            <li>
              <Link to="/program/1" className="block hover:bg-slate-100 p-3 rounded-md transition">
                <h3 className="font-bold text-slate-800">Bachelor of Science (BS)</h3>
                <p className="text-gray-600">4-year undergraduate program in Computer Science.</p>
              </Link>
            </li>

            <li>
              <Link to="/program/2" className="block hover:bg-slate-100 p-3 rounded-md transition">
                <h3 className="font-bold text-slate-800">Master of Science (MS)</h3>
                <p className="text-gray-600">Advanced studies in specialized Computer Science fields.</p>
              </Link>
            </li>

            <li>
              <Link to="/program/3" className="block hover:bg-slate-100 p-3 rounded-md transition">
                <h3 className="font-bold text-slate-800">Doctor of Philosophy (PhD)</h3>
                <p className="text-gray-600">Research-focused doctoral program.</p>
              </Link>
            </li>
          </ul>

          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <Users className="text-slate-600 mr-3" size={24} />
              <h2 className="text-2xl font-bold text-slate-800">Research Areas</h2>
            </div>
            <ul className="space-y-4">
              <li>
                <h3 className="font-bold">Artificial Intelligence</h3>
                <p className="text-gray-600">Machine learning, natural language processing, computer vision.</p>
              </li>
              <li>
                <h3 className="font-bold">Data Science</h3>
                <p className="text-gray-600">Big data analytics, data mining, database systems.</p>
              </li>
              <li>
                <h3 className="font-bold">Network Security</h3>
                <p className="text-gray-600">Cybersecurity, cryptography, secure computing.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Beautified Footer */}
      <footer className="bg-gradient-to-b from-slate-800 to-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Contact Info */}
            <div className="bg-slate-700/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-slate-600">Contact Us</h3>
              <p className="mb-1">Department of Computer Science & Engineering</p>
              <p className="mb-1">Faculty of Science</p>
              <p className="mb-1">University of Dhaka</p>
              <p className="mb-3">Dhaka 1000, Bangladesh</p>
              <div className="mt-4 pt-3 border-t border-slate-600 space-y-2">
                <p className="text-sm text-slate-300 flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" />
                  +880-2-9661900
                </p>
                <p className="text-sm text-slate-300 flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  cse@du.ac.bd
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-slate-700/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-slate-600">Connect With Us</h3>
              <div className="flex space-x-4 mb-6">
                <a href="https://facebook.com" className="bg-slate-600 hover:bg-blue-600 p-3 rounded-full transition-colors duration-300" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" className="bg-slate-600 hover:bg-blue-500 p-3 rounded-full transition-colors duration-300" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" className="bg-slate-600 hover:bg-blue-700 p-3 rounded-full transition-colors duration-300" aria-label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.016 18.6h-2.91v-4.575c0-1.084-.021-2.48-1.51-2.48-1.512 0-1.746 1.18-1.746 2.4V18.6H7.95V8.4h2.79v1.17h.042c.387-.735 1.332-1.512 2.742-1.512 2.94 0 3.489 1.935 3.489 4.447V18.6h.003z"/>
                    <circle cx="4.2" cy="4.2" r="2.4"/>
                    <path d="M5.4 18.6H3V8.4h2.4v10.2z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Map Section */}
            <div className="md:col-span-2 bg-slate-700/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-slate-600">Find Us</h3>
              <div className="w-full h-56 rounded-lg overflow-hidden border border-slate-600 shadow-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.191277524978!2d90.39670607596543!3d23.728738579453224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8ef3976bbbd%3A0x1b3140066a1d7bb8!2sDepartment%20of%20Computer%20Science%20and%20Engineering%2C%20University%20of%20Dhaka!5e0!3m2!1sen!2sbd!4v1721041589123!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Department of Computer Science and Engineering, University of Dhaka"
                ></iframe>
              </div>
              <div className="mt-4 p-3 bg-slate-600/50 rounded-lg text-sm text-slate-200">
                <p className="font-medium">Science Complex, University of Dhaka</p>
                <p>Ramna, Dhaka 1000, Bangladesh</p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-slate-700 text-center">
            <p className="text-sm text-slate-400">© 2025 Department of Computer Science & Engineering, University of Dhaka. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot Component */}
      <Chatbot />
    </div>
  );
}

export default HomePage;