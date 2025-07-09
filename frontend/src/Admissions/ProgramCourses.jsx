import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Sample courses data for Bachelor of Science in Computer Science (Program ID 1)
const programCoursesData = {
  1: [
    {
      id: 101,
      code: "CSE 101",
      title: "Introduction to Computer Science",
      semester: "Fall 2025",
      credits: 3,
      description: "An introduction to computer science and programming concepts.",
      image: "/images/computer-science-intro.jpg"
    },
    {
      id: 102,
      code: "CSE 102",
      title: "Introduction to Programming",
      semester: "Fall 2025",
      credits: 3,
      description: "Fundamentals of programming using a high-level language.",
      image: "/images/programming-intro.jpg"
    },
    {
      id: 201,
      code: "CSE 201",
      title: "Data Structures",
      semester: "Spring 2026",
      credits: 3,
      description: "Implementation and analysis of fundamental data structures.",
      image: "/images/data-structures.jpg"
    },
    {
      id: 202,
      code: "CSE 202",
      title: "Digital Logic Design",
      semester: "Spring 2026",
      credits: 3,
      description: "Boolean algebra, logic gates, and digital circuit design.",
      image: "/images/digital-logic.jpg"
    },
    {
      id: 301,
      code: "CSE 301",
      title: "Computer Networking",
      semester: "Fall 2026",
      credits: 3,
      description: "Principles and practices of computer network systems.",
      image: "/images/computer-networking.jpg"
    },
    {
      id: 302,
      code: "CSE 302",
      title: "Operating Systems",
      semester: "Fall 2026",
      credits: 4,
      description: "Process management, memory management, and file systems.",
      image: "/images/operating-systems.jpg"
    },
    {
      id: 303,
      code: "CSE 303",
      title: "Software Engineering",
      semester: "Fall 2026",
      credits: 3,
      description: "Software development life cycle and project management.",
      image: "/images/software-engineering.jpg"
    },
    {
      id: 304,
      code: "CSE 304",
      title: "Database Management Systems",
      semester: "Fall 2026",
      credits: 3,
      description: "Database design, SQL, and database administration.",
      image: "/images/database-systems.jpg"
    },
    {
      id: 401,
      code: "CSE 401",
      title: "Artificial Intelligence",
      semester: "Spring 2027",
      credits: 3,
      description: "Problem-solving methods in artificial intelligence.",
      image: "/images/artificial-intelligence.jpg"
    },
    {
      id: 402,
      code: "CSE 402",
      title: "Computer Graphics",
      semester: "Spring 2027",
      credits: 3,
      description: "2D and 3D graphics algorithms and programming.",
      image: "/images/computer-graphics.jpg"
    },
    {
      id: 403,
      code: "CSE 403",
      title: "Theory of Computation",
      semester: "Spring 2027",
      credits: 3,
      description: "Formal languages, automata, and computational complexity.",
      image: "/images/theory-of-computation.jpg"
    },
    {
      id: 404,
      code: "CSE 404",
      title: "Compiler Design",
      semester: "Spring 2027",
      credits: 3,
      description: "Lexical analysis, parsing, and code generation.",
      image: "/images/compiler-design.jpg"
    },
    {
      id: 405,
      code: "CSE 405",
      title: "Machine Learning",
      semester: "Fall 2027",
      credits: 3,
      description: "Supervised and unsupervised learning algorithms.",
      image: "/images/machine-learning.jpg"
    },
    {
      id: 406,
      code: "CSE 406",
      title: "Cryptography and Network Security",
      semester: "Fall 2027",
      credits: 3,
      description: "Encryption, authentication, and network security protocols.",
      image: "/images/network-security.jpg"
    },
    {
      id: 407,
      code: "CSE 407",
      title: "Mobile App Development",
      semester: "Fall 2027",
      credits: 3,
      description: "Development of applications for mobile devices.",
      image: "/images/mobile-app-dev.jpg"
    },
    {
      id: 408,
      code: "CSE 408",
      title: "Web Development",
      semester: "Fall 2027",
      credits: 3,
      description: "Client-server architecture and web application development.",
      image: "/images/web-development.jpg"
    },
    {
      id: 409,
      code: "CSE 409",
      title: "Cloud Computing",
      semester: "Spring 2028",
      credits: 3,
      description: "Distributed systems and cloud service models.",
      image: "/images/cloud-computing.jpg"
    },
    {
      id: 410,
      code: "CSE 410",
      title: "Data Science",
      semester: "Spring 2028",
      credits: 3,
      description: "Data analysis, visualization, and statistical modeling.",
      image: "/images/data-science.jpg"
    },
    {
      id: 411,
      code: "CSE 411",
      title: "Natural Language Processing",
      semester: "Spring 2028",
      credits: 3,
      description: "Algorithms for processing and analyzing human language.",
      image: "/images/nlp.jpg"
    },
    {
      id: 412,
      code: "CSE 412",
      title: "Final Year Project",
      semester: "Spring 2028",
      credits: 6,
      description: "Capstone project integrating knowledge from various courses.",
      image: "/images/project.jpg"
    }
  ],
  // Add more program IDs and their courses here
};

// Get program titles for breadcrumb
const programTitles = {
  1: "Bachelor of Science in Computer Science",
  2: "Masters of Science in Computer Science and Engineering",
  3: "Doctor of Philosophy in Physics",
  4: "Bachelor of Arts in History",
  5: "Master of Science in Biology",
  6: "Doctor of Education in Leadership"
};

function ProgramCourses() {
  const { programId } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [programTitle, setProgramTitle] = useState("");

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchCourses = () => {
      setLoading(true);
      setTimeout(() => {
        const programCourses = programCoursesData[programId] || [];
        setCourses(programCourses);
        setProgramTitle(programTitles[programId] || "Program");
        setLoading(false);
      }, 500); // Simulate loading
    };

    fetchCourses();
  }, [programId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-red-600">No Courses Found</h1>
        <p className="mt-4">There are no courses available for this program.</p>
        <Link to={`/program/${programId}`} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Return to Program Details
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with breadcrumb */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center text-sm mb-2">
            <Link to="/" className="hover:text-blue-300">Home</Link>
            <span className="mx-2">›</span>
            <Link to="/admission-hub" className="hover:text-blue-300">Programs</Link>
            <span className="mx-2">›</span>
            <Link to={`/program/${programId}`} className="hover:text-blue-300">{programTitle}</Link>
            <span className="mx-2">›</span>
            <span>Courses</span>
          </div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="mt-2">All courses for {programTitle}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Sidebar layout */}
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 mb-8 md:mb-0 md:mr-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="font-bold text-lg mb-4">Filter Courses</h2>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">By Year</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Year 1</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Year 2</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Year 3</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Year 4</span>
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">By Semester</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Fall</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Spring</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">By Credits</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">3 Credits</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">4 Credits</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">6 Credits</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Course listing */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Courses</h2>
            
            {/* Courses grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(100vh-250px)] pb-6">
              {courses.map(course => (
                <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="h-40 bg-gray-100 flex items-center justify-center p-4">
                    <div className="w-24 h-32 bg-white shadow-md flex items-center justify-center">
                      <span className="text-center text-gray-600 font-medium text-sm px-2">
                        {course.title}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{course.code} • {course.semester}</p>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/course/${course.id}/syllabus`}
                        className="px-3 py-1.5 bg-gray-200 text-gray-800 text-sm font-medium rounded hover:bg-gray-300 transition"
                      >
                        View Syllabus
                      </Link>
                      <Link 
                        to={`/course/${course.id}`}
                        className="px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 transition"
                      >
                        Go to Course
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramCourses;
