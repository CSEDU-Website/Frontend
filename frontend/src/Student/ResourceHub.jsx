import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  Monitor, 
  Cpu, 
  Smartphone,
  Wifi,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Download,
  Mail
} from 'lucide-react';

const ResourceHub = () => {
  const [activeTab, setActiveTab] = useState('equipment');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [projectFilters, setProjectFilters] = useState({
    year: 'all',
    topic: 'all',
    supervisor: 'all'
  });

  // Mock data for lab equipment
  const labEquipment = [
    {
      id: 1,
      name: "NVIDIA RTX 4090 GPU",
      category: "GPU",
      description: "High-performance GPU for machine learning and AI research",
      availability: "available",
      nextAvailable: null,
      specifications: ["24GB VRAM", "16384 CUDA Cores", "PCIe 4.0"],
      image: "/placeholder-gpu.jpg"
    },
    {
      id: 2,
      name: "Raspberry Pi 4 Model B",
      category: "Microcontroller",
      description: "Single-board computer for IoT and embedded systems projects",
      availability: "busy",
      nextAvailable: "2024-02-20",
      specifications: ["8GB RAM", "Quad-core ARM", "WiFi & Bluetooth"],
      image: "/placeholder-pi.jpg"
    },
    {
      id: 3,
      name: "Arduino Sensor Kit",
      category: "Sensors",
      description: "Complete sensor collection for environmental monitoring",
      availability: "limited",
      nextAvailable: null,
      specifications: ["Temperature Sensor", "Humidity Sensor", "Motion Detector"],
      image: "/placeholder-sensors.jpg"
    },
    {
      id: 4,
      name: "FPGA Development Board",
      category: "FPGA",
      description: "Field-programmable gate array for digital circuit design",
      availability: "available",
      nextAvailable: null,
      specifications: ["Xilinx Zynq", "DDR4 Memory", "High-speed I/O"],
      image: "/placeholder-fpga.jpg"
    }
  ];

  // Mock data for projects
  const projects = [
    {
      id: 1,
      title: "AI-Powered Medical Diagnosis System",
      year: "2023",
      topic: "AI & Machine Learning",
      supervisor: "Dr. Sarah Johnson",
      team: ["Alice Smith", "Bob Chen", "Carol Williams"],
      abstract: "Developed a deep learning model for automated medical image analysis and diagnosis using convolutional neural networks.",
      demoLink: "https://youtube.com/watch?v=demo1",
      status: "completed",
      image: "/placeholder-project1.jpg"
    },
    {
      id: 2,
      title: "Smart City Traffic Management",
      year: "2023",
      topic: "IoT & Smart Systems",
      supervisor: "Dr. Michael Chen",
      team: ["David Lee", "Emma Brown"],
      abstract: "IoT-based traffic monitoring and optimization system using real-time data analysis and machine learning algorithms.",
      demoLink: "https://figma.com/proto/demo2",
      status: "ongoing",
      image: "/placeholder-project2.jpg"
    },
    {
      id: 3,
      title: "Blockchain-Based Voting System",
      year: "2022",
      topic: "Blockchain & Security",
      supervisor: "Dr. Lisa Anderson",
      team: ["Frank Wilson", "Grace Kim", "Henry Taylor"],
      abstract: "Secure and transparent voting system using blockchain technology with smart contracts for election integrity.",
      demoLink: "https://youtube.com/watch?v=demo3",
      status: "completed",
      image: "/placeholder-project3.jpg"
    }
  ];

  const EquipmentCard = ({ equipment }) => {
    const getAvailabilityColor = (status) => {
      switch (status) {
        case 'available': return 'bg-green-100 text-green-800';
        case 'limited': return 'bg-yellow-100 text-yellow-800';
        case 'busy': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getAvailabilityIcon = (status) => {
      switch (status) {
        case 'available': return <CheckCircle size={16} />;
        case 'limited': return <AlertCircle size={16} />;
        case 'busy': return <XCircle size={16} />;
        default: return <AlertCircle size={16} />;
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <img 
          src={equipment.image} 
          alt={equipment.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-slate-800">{equipment.name}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getAvailabilityColor(equipment.availability)}`}>
            {getAvailabilityIcon(equipment.availability)}
            {equipment.availability}
          </span>
        </div>
        
        <p className="text-slate-600 mb-4">{equipment.description}</p>
        
        <div className="mb-4">
          <h4 className="font-semibold text-slate-700 mb-2">Specifications:</h4>
          <ul className="space-y-1">
            {equipment.specifications.map((spec, index) => (
              <li key={index} className="text-sm text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                {spec}
              </li>
            ))}
          </ul>
        </div>
        
        {equipment.nextAvailable && (
          <p className="text-sm text-slate-500 mb-4">
            Next available: {new Date(equipment.nextAvailable).toLocaleDateString()}
          </p>
        )}
        
        <button 
          onClick={() => setSelectedEquipment(equipment)}
          className="w-full bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          disabled={equipment.availability === 'busy'}
        >
          {equipment.availability === 'busy' ? 'Currently Unavailable' : 'Book Equipment'}
        </button>
      </div>
    );
  };

  const ProjectCard = ({ project }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img 
        src={project.image} 
        alt={project.title}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
            {project.topic}
          </span>
          <span className="text-sm text-slate-500">{project.year}</span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-2">{project.title}</h3>
        <p className="text-slate-600 mb-3">Supervisor: {project.supervisor}</p>
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">{project.abstract}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Team: {project.team.length} members
          </span>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 text-slate-600 hover:text-slate-800 transition-colors">
              <Eye size={14} />
              <span className="text-sm">View Details</span>
            </button>
            <a 
              href={project.demoLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ExternalLink size={14} />
              <span className="text-sm">Demo</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const BookingModal = ({ equipment, onClose }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [duration, setDuration] = useState('');
    const [justification, setJustification] = useState('');

    const timeSlots = [
      '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
    ];

    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle booking submission
      alert('Booking request submitted for admin approval!');
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Book Equipment</h2>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{equipment.name}</h3>
              <p className="text-slate-600">{equipment.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Time Slot
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    required
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Duration (hours)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                >
                  <option value="">Select duration</option>
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Justification for Use
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Please explain why you need this equipment and how it will be used..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 h-32"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const filteredProjects = projects.filter(project => {
    return (
      (projectFilters.year === 'all' || project.year === projectFilters.year) &&
      (projectFilters.topic === 'all' || project.topic === projectFilters.topic) &&
      (projectFilters.supervisor === 'all' || project.supervisor === projectFilters.supervisor)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-800">Resource Hub</h1>
          <p className="text-slate-600">Book lab equipment and explore student projects</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('equipment')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'equipment'
                  ? 'border-slate-600 text-slate-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Lab Equipment
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-slate-600 text-slate-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Projects Gallery
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'equipment' ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-slate-800">Available Equipment</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
                <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
                  <option value="all">All Categories</option>
                  <option value="gpu">GPU</option>
                  <option value="microcontroller">Microcontroller</option>
                  <option value="sensors">Sensors</option>
                  <option value="fpga">FPGA</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {labEquipment.map(equipment => (
                <EquipmentCard key={equipment.id} equipment={equipment} />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Student Projects</h2>
              </div>
              <div className="flex flex-wrap gap-4">
                <select
                  value={projectFilters.year}
                  onChange={(e) => setProjectFilters({...projectFilters, year: e.target.value})}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="all">All Years</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
                
                <select
                  value={projectFilters.topic}
                  onChange={(e) => setProjectFilters({...projectFilters, topic: e.target.value})}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="all">All Topics</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="IoT & Smart Systems">IoT & Smart Systems</option>
                  <option value="Blockchain & Security">Blockchain & Security</option>
                </select>
                
                <select
                  value={projectFilters.supervisor}
                  onChange={(e) => setProjectFilters({...projectFilters, supervisor: e.target.value})}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="all">All Supervisors</option>
                  <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                  <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                  <option value="Dr. Lisa Anderson">Dr. Lisa Anderson</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedEquipment && (
        <BookingModal 
          equipment={selectedEquipment} 
          onClose={() => setSelectedEquipment(null)} 
        />
      )}
    </div>
  );
};

export default ResourceHub;
