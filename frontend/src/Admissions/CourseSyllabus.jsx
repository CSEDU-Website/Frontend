import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Sample course syllabi data
const courseSyllabiData = {
  101: {
    title: "Introduction to Computer Science",
    code: "CSE 101",
    semester: "Fall 2025",
    instructor: "Dr. David Miller",
    weeks: [
      { number: 1, topic: "Introduction to Computer Science", date: "August 28, 2025", description: "Course overview, introduction to computing concepts" },
      { number: 2, topic: "History of Computing", date: "September 4, 2025", description: "Evolution of computers, key historical developments" },
      { number: 3, topic: "Number Systems and Data Representation", date: "September 11, 2025", description: "Binary, decimal, hexadecimal, data encoding" },
      { number: 4, topic: "Computer Architecture", date: "September 18, 2025", description: "Hardware components, memory hierarchy" },
      { number: 5, topic: "Operating Systems", date: "September 25, 2025", description: "OS functions, process management, file systems" },
      { number: 6, topic: "Programming Fundamentals", date: "October 2, 2025", description: "Variables, data types, control structures" },
      { number: 7, topic: "Algorithms and Problem Solving", date: "October 9, 2025", description: "Algorithm design, pseudocode, flowcharts" },
      { number: 8, topic: "Introduction to Programming Languages", date: "October 16, 2025", description: "Types of programming languages, syntax basics" },
      { number: 9, topic: "Software Engineering Principles", date: "October 23, 2025", description: "Development lifecycle, requirements, testing" },
      { number: 10, topic: "Data Structures Basics", date: "October 30, 2025", description: "Arrays, lists, stacks, queues" },
      { number: 11, topic: "Database Concepts", date: "November 6, 2025", description: "Database models, SQL introduction" },
      { number: 12, topic: "Computer Networks Basics", date: "November 13, 2025", description: "Network models, protocols, Internet" },
      { number: 13, topic: "Ethical Issues in Computing", date: "November 20, 2025", description: "Privacy, intellectual property, cybersecurity" },
      { number: 14, topic: "Future of Computing", date: "November 27, 2025", description: "Emerging technologies, AI, quantum computing" },
      { number: 15, topic: "Course Review", date: "December 4, 2025", description: "Review of key concepts" },
      { number: 16, topic: "Final Exam Preparation", date: "December 11, 2025", description: "Review exercises and practice problems" }
    ]
  },
  301: {
    title: "Computer Networking",
    code: "CSE 301",
    semester: "Fall 2025",
    instructor: "Prof. Sarah Johnson",
    weeks: [
      { number: 1, topic: "Introduction to Computer Networking", date: "August 20, 2025", description: "Network types, models, and standards" },
      { number: 2, topic: "Protocol Layers", date: "September 4, 2025", description: "OSI model, TCP/IP model, encapsulation" },
      { number: 3, topic: "Circuit and Packet Switching", date: "September 11, 2025", description: "Connection-oriented vs connectionless communication" },
      { number: 4, topic: "Application Layer", date: "September 18, 2025", description: "Client-server model, P2P, API concepts" },
      { number: 5, topic: "HTTP, FTP, Email, DNS, SNMP", date: "September 25, 2025", description: "Web protocols, email protocols, domain name system" },
      { number: 6, topic: "Transport Layer", date: "October 2, 2025", description: "End-to-end delivery, ports, sockets" },
      { number: 7, topic: "TCP & UDP", date: "October 9, 2025", description: "Connection-oriented vs connectionless transport" },
      { number: 8, topic: "TCP Reno, TCP Tahoe, TCP New Reno", date: "October 16, 2025", description: "TCP variants and congestion control" },
      { number: 9, topic: "Network Layer", date: "October 23, 2025", description: "IP addressing, subnetting, routing" },
      { number: 10, topic: "IPv4 and IPv6", date: "October 30, 2025", description: "Address formats, transition mechanisms" },
      { number: 11, topic: "Routing Algorithms", date: "November 6, 2025", description: "Distance vector, link state, BGP" },
      { number: 12, topic: "Wireless Networks", date: "November 13, 2025", description: "WLAN, Bluetooth, mobile networks" },
      { number: 13, topic: "MAC and Routing", date: "November 20, 2025", description: "Media access control, routing protocols" },
      { number: 14, topic: "Research Topics on Networking I", date: "November 27, 2025", description: "Current research in networking" },
      { number: 15, topic: "Research Topics on Networking II", date: "December 4, 2025", description: "Advanced topics and future trends" },
      { number: 16, topic: "Course Review", date: "December 11, 2025", description: "Review of key concepts and exam preparation" }
    ]
  },
  201: {
    title: "Data Structures",
    code: "CSE 201",
    semester: "Spring 2026",
    instructor: "Dr. Michael Chen",
    weeks: [
      { number: 1, topic: "Introduction to Data Structures", date: "January 15, 2026", description: "Overview of data structures and their importance" },
      { number: 2, topic: "Arrays and Linked Lists", date: "January 22, 2026", description: "Implementation and operations" },
      { number: 3, topic: "Stacks and Queues", date: "January 29, 2026", description: "LIFO, FIFO structures and applications" },
      { number: 4, topic: "Recursion", date: "February 5, 2026", description: "Recursive algorithms and problem solving" },
      { number: 5, topic: "Trees: Basic Concepts", date: "February 12, 2026", description: "Tree terminology, binary trees" },
      { number: 6, topic: "Binary Search Trees", date: "February 19, 2026", description: "BST properties and operations" },
      { number: 7, topic: "AVL Trees", date: "February 26, 2026", description: "Self-balancing binary search trees" },
      { number: 8, topic: "Heap and Priority Queues", date: "March 5, 2026", description: "Heap implementation, heapify algorithm" },
      { number: 9, topic: "Graphs: Representation", date: "March 12, 2026", description: "Adjacency matrix, adjacency list" },
      { number: 10, topic: "Graph Traversals", date: "March 19, 2026", description: "Depth-first, breadth-first search" },
      { number: 11, topic: "Shortest Path Algorithms", date: "March 26, 2026", description: "Dijkstra's, Bellman-Ford algorithms" },
      { number: 12, topic: "Minimum Spanning Trees", date: "April 2, 2026", description: "Kruskal's, Prim's algorithms" },
      { number: 13, topic: "Hashing", date: "April 9, 2026", description: "Hash functions, collision resolution" },
      { number: 14, topic: "Advanced Sorting Algorithms", date: "April 16, 2026", description: "Merge sort, quick sort, heap sort" },
      { number: 15, topic: "Algorithm Analysis", date: "April 23, 2026", description: "Time complexity, space complexity" },
      { number: 16, topic: "Final Review", date: "April 30, 2026", description: "Comprehensive review of course material" }
    ]
  },
  // Adding more course syllabi for others (just a couple more as examples)
  302: {
    title: "Operating Systems",
    code: "CSE 302",
    semester: "Fall 2026",
    instructor: "Dr. Lisa Wong",
    weeks: [
      { number: 1, topic: "Introduction to Operating Systems", date: "August 25, 2026", description: "OS functions, types, and structure" },
      { number: 2, topic: "Process Management", date: "September 1, 2026", description: "Process states, PCB, context switching" },
      { number: 3, topic: "CPU Scheduling", date: "September 8, 2026", description: "Scheduling algorithms and criteria" },
      { number: 4, topic: "Process Synchronization", date: "September 15, 2026", description: "Critical section problem, semaphores" },
      { number: 5, topic: "Deadlocks", date: "September 22, 2026", description: "Detection, prevention, avoidance" },
      { number: 6, topic: "Memory Management", date: "September 29, 2026", description: "Logical vs physical addressing, swapping" },
      { number: 7, topic: "Virtual Memory", date: "October 6, 2026", description: "Paging, segmentation, TLB" },
      { number: 8, topic: "Page Replacement Algorithms", date: "October 13, 2026", description: "FIFO, LRU, optimal algorithms" },
      { number: 9, topic: "File System Interface", date: "October 20, 2026", description: "File concepts, access methods" },
      { number: 10, topic: "File System Implementation", date: "October 27, 2026", description: "Allocation methods, free-space management" },
      { number: 11, topic: "Mass Storage Structure", date: "November 3, 2026", description: "Disk structure, scheduling, management" },
      { number: 12, topic: "I/O Systems", date: "November 10, 2026", description: "I/O hardware, software, performance" },
      { number: 13, topic: "Protection and Security", date: "November 17, 2026", description: "Goals, principles, mechanisms" },
      { number: 14, topic: "Distributed Systems", date: "November 24, 2026", description: "Structure, communication, coordination" },
      { number: 15, topic: "Case Studies", date: "December 1, 2026", description: "Linux, Windows, Android OS" },
      { number: 16, topic: "Review and Future Trends", date: "December 8, 2026", description: "Review and discussion of emerging OS technologies" }
    ]
  },
  401: {
    title: "Artificial Intelligence",
    code: "CSE 401",
    semester: "Spring 2027",
    instructor: "Dr. Robert Garcia",
    weeks: [
      { number: 1, topic: "Introduction to AI", date: "January 20, 2027", description: "AI definitions, history, and applications" },
      { number: 2, topic: "Intelligent Agents", date: "January 27, 2027", description: "Agent types, environments, rationality" },
      { number: 3, topic: "Problem Solving by Searching", date: "February 3, 2027", description: "Search algorithms, uninformed search" },
      { number: 4, topic: "Informed Search Methods", date: "February 10, 2027", description: "Heuristics, A* algorithm, best-first search" },
      { number: 5, topic: "Constraint Satisfaction Problems", date: "February 17, 2027", description: "Backtracking, constraint propagation" },
      { number: 6, topic: "Game Playing", date: "February 24, 2027", description: "Minimax, alpha-beta pruning" },
      { number: 7, topic: "Logic and Knowledge Representation", date: "March 3, 2027", description: "Propositional logic, first-order logic" },
      { number: 8, topic: "Planning", date: "March 10, 2027", description: "STRIPS, planning graphs, hierarchical planning" },
      { number: 9, topic: "Uncertainty", date: "March 17, 2027", description: "Probability theory, Bayes' rule" },
      { number: 10, topic: "Probabilistic Reasoning", date: "March 24, 2027", description: "Bayesian networks, inference" },
      { number: 11, topic: "Machine Learning Basics", date: "March 31, 2027", description: "Learning paradigms, decision trees" },
      { number: 12, topic: "Neural Networks", date: "April 7, 2027", description: "Perceptron, backpropagation, deep learning" },
      { number: 13, topic: "Natural Language Processing", date: "April 14, 2027", description: "Text processing, syntax, semantics" },
      { number: 14, topic: "Computer Vision", date: "April 21, 2027", description: "Image processing, object recognition" },
      { number: 15, topic: "Robotics", date: "April 28, 2027", description: "Perception, planning, control" },
      { number: 16, topic: "AI Ethics and Future", date: "May 5, 2027", description: "Ethical considerations and future directions" }
    ]
  }
  // Could add more syllabi for other courses, but keeping it concise for now
};

function CourseSyllabus() {
  const { courseId } = useParams();
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchSyllabus = () => {
      setLoading(true);
      setTimeout(() => {
        const courseSyllabus = courseSyllabiData[courseId] || null;
        setSyllabus(courseSyllabus);
        setLoading(false);
      }, 300); // Simulate loading
    };

    fetchSyllabus();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!syllabus) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-red-600">Syllabus Not Found</h1>
        <p className="mt-4">The course syllabus you're looking for does not exist.</p>
        <Link to="/admission-hub" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Return to Programs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Left sidebar with user info */}
      <div className="flex">
        <div className="w-64 min-h-screen bg-white border-r">
          <div className="p-4 border-b flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
              <span className="text-gray-700 font-medium">M</span>
            </div>
            <div>
              <h2 className="font-medium">Mohbuba</h2>
            </div>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/courses" className="flex items-center p-2 bg-gray-100 text-blue-600 rounded">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Calendar
                </Link>
              </li>
              <li>
                <Link to="/messages" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Messages
                </Link>
              </li>
              <li>
                <Link to="/settings" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main content area */}
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-2">{syllabus.title}</h1>
          <p className="text-gray-600 mb-6">{syllabus.code} - {syllabus.semester}</p>
          
          {/* Tabs */}
          <div className="border-b mb-6">
            <div className="flex">
              <button className="px-4 py-2 border-b-2 border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300">
                Overview
              </button>
              <button className="px-4 py-2 border-b-2 border-red-500 text-gray-900 font-medium">
                Syllabus
              </button>
              <button className="px-4 py-2 border-b-2 border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300">
                Schedule
              </button>
            </div>
          </div>
          
          {/* Syllabus content */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Course Syllabus</h2>
            <div className="space-y-4">
              {syllabus.weeks.map((week) => (
                <div key={week.number} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">Week {week.number}: {week.topic}</h3>
                    <button className="p-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{week.date}</p>
                  <p className="mt-1 text-gray-700">{week.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseSyllabus;
