import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// This would come from a database in a real application
const programsData = [
  {
    id: 1,
    title: "Bachelor of Science in Computer Science",
    level: "Bachelor",
    description: "The BS in Computer Science program provides a comprehensive foundation in computer science principles, software development, algorithms, and data structures. Students gain hands-on experience through projects and internships, preparing them for careers in software engineering, systems analysis, and research.",
    credits: 140,
    duration: "4 years",
    studentsEnrolled: 325,
    faculty: [
      { name: "Dr. Ahmed Khan", position: "Program Director", expertise: "Artificial Intelligence" },
      { name: "Prof. Sarah Johnson", position: "Senior Faculty", expertise: "Database Systems" },
      { name: "Dr. Michael Chen", position: "Associate Professor", expertise: "Computer Networks" }
    ],
    courses: [
      { code: "CS101", title: "Introduction to Programming", credits: 4 },
      { code: "CS201", title: "Data Structures and Algorithms", credits: 4 },
      { code: "CS301", title: "Database Management Systems", credits: 3 },
      { code: "CS401", title: "Operating Systems", credits: 4 }
    ],
    admissionRequirements: "High school diploma with strong background in mathematics and science. Minimum GPA of 3.0 required.",
    careerProspects: "Graduates find employment as software engineers, systems analysts, database administrators, and IT consultants in both public and private sectors.",
    image: "/images/computer-science-bs.jpg"
  },
  {
    id: 2,
    title: "Masters of Science in Computer Science and Engineering",
    level: "Masters",
    description: "The MS in Computer Science and Engineering program is designed for students seeking advanced knowledge in computer science theory and applications. The curriculum emphasizes research methodology and specialized topics in emerging technologies.",
    credits: 36,
    duration: "2 years",
    studentsEnrolled: 120,
    faculty: [
      { name: "Prof. Jessica Williams", position: "Program Director", expertise: "Machine Learning" },
      { name: "Dr. Robert Garcia", position: "Research Chair", expertise: "High-Performance Computing" },
      { name: "Dr. Emily Zhang", position: "Associate Professor", expertise: "Computer Vision" }
    ],
    courses: [
      { code: "CSE501", title: "Advanced Algorithms", credits: 3 },
      { code: "CSE550", title: "Machine Learning", credits: 3 },
      { code: "CSE560", title: "Advanced Database Systems", credits: 3 },
      { code: "CSE590", title: "Thesis Research", credits: 6 }
    ],
    admissionRequirements: "Bachelor's degree in Computer Science or related field with minimum GPA of 3.2. GRE scores required.",
    careerProspects: "Graduates are prepared for roles in research and development, advanced software engineering, data science, and academia.",
    image: "/images/computer-science-ms.jpg"
  },
  {
    id: 3,
    title: "Doctor of Philosophy in Physics",
    level: "Doctorate",
    description: "The PhD in Physics program prepares students for research careers in physics, focusing on theoretical and experimental methodologies. Students conduct original research in various specializations including quantum mechanics, astrophysics, and condensed matter physics.",
    credits: 72,
    duration: "4-6 years",
    studentsEnrolled: 45,
    faculty: [
      { name: "Prof. David Nelson", position: "Program Director", expertise: "Quantum Mechanics" },
      { name: "Dr. Lisa Chen", position: "Research Professor", expertise: "Astrophysics" },
      { name: "Dr. James Wilson", position: "Distinguished Professor", expertise: "Particle Physics" }
    ],
    courses: [
      { code: "PHY701", title: "Advanced Quantum Mechanics", credits: 4 },
      { code: "PHY720", title: "Quantum Field Theory", credits: 4 },
      { code: "PHY750", title: "Statistical Mechanics", credits: 3 },
      { code: "PHY799", title: "Dissertation Research", credits: 24 }
    ],
    admissionRequirements: "Master's degree in Physics or related field. Research experience and strong recommendation letters required.",
    careerProspects: "Graduates pursue careers in academic research, national laboratories, aerospace industry, and technology research centers.",
    image: "/images/physics-phd.jpg"
  },
  {
    id: 4,
    title: "Bachelor of Arts in History",
    level: "Bachelor",
    description: "The BA in History program offers students a comprehensive understanding of historical events, methodologies, and interpretations. The curriculum covers various regions and time periods, emphasizing critical thinking and research skills.",
    credits: 120,
    duration: "4 years",
    studentsEnrolled: 180,
    faculty: [
      { name: "Prof. Margaret Brown", position: "Program Director", expertise: "European History" },
      { name: "Dr. Carlos Rodriguez", position: "Associate Professor", expertise: "Latin American History" },
      { name: "Dr. Helen Kim", position: "Assistant Professor", expertise: "Asian History" }
    ],
    courses: [
      { code: "HIST101", title: "World History I", credits: 3 },
      { code: "HIST201", title: "Historical Methods", credits: 3 },
      { code: "HIST301", title: "Medieval Europe", credits: 3 },
      { code: "HIST401", title: "Historiography", credits: 3 }
    ],
    admissionRequirements: "High school diploma with strong background in humanities. Minimum GPA of 2.8 required.",
    careerProspects: "Graduates find employment in education, museums, archives, publishing, and government agencies.",
    image: "/images/history-ba.jpg"
  },
  {
    id: 5,
    title: "Master of Science in Biology",
    level: "Masters",
    description: "The MS in Biology program provides advanced training in biological sciences, with options to specialize in areas such as ecology, genetics, or molecular biology. Students conduct original research and develop laboratory skills applicable to various scientific fields.",
    credits: 30,
    duration: "2 years",
    studentsEnrolled: 75,
    faculty: [
      { name: "Dr. Thomas Lee", position: "Program Director", expertise: "Molecular Biology" },
      { name: "Prof. Rachel Green", position: "Research Faculty", expertise: "Ecology" },
      { name: "Dr. Brian Johnson", position: "Associate Professor", expertise: "Genetics" }
    ],
    courses: [
      { code: "BIO501", title: "Advanced Cell Biology", credits: 3 },
      { code: "BIO520", title: "Genomics and Proteomics", credits: 3 },
      { code: "BIO540", title: "Ecological Systems", credits: 3 },
      { code: "BIO590", title: "Research Methods", credits: 3 }
    ],
    admissionRequirements: "Bachelor's degree in Biology or related field with minimum GPA of 3.0. GRE scores required.",
    careerProspects: "Graduates pursue careers in research laboratories, pharmaceutical companies, environmental agencies, and healthcare organizations.",
    image: "/images/biology-ms.jpg"
  },
  {
    id: 6,
    title: "Doctor of Education in Leadership",
    level: "Doctorate",
    description: "The EdD in Leadership program prepares educational professionals to address challenges in academic institutions and implement effective leadership strategies. Students develop expertise in educational policy, administration, and curriculum development.",
    credits: 60,
    duration: "3-5 years",
    studentsEnrolled: 40,
    faculty: [
      { name: "Prof. Sandra Martinez", position: "Program Director", expertise: "Educational Policy" },
      { name: "Dr. Kevin White", position: "Senior Faculty", expertise: "Higher Education Administration" },
      { name: "Dr. Patricia Jackson", position: "Associate Professor", expertise: "Curriculum Development" }
    ],
    courses: [
      { code: "EDD701", title: "Advanced Leadership Theory", credits: 3 },
      { code: "EDD720", title: "Organizational Development", credits: 3 },
      { code: "EDD740", title: "Educational Policy Analysis", credits: 3 },
      { code: "EDD799", title: "Dissertation", credits: 12 }
    ],
    admissionRequirements: "Master's degree in Education or related field. Minimum of 3 years professional experience in education required.",
    careerProspects: "Graduates pursue leadership roles in K-12 schools, higher education institutions, educational non-profits, and government agencies.",
    image: "/images/education-leadership-edd.jpg"
  }
];

function ProgramDetails() {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchProgram = () => {
      setLoading(true);
      // Find the program with the matching ID
      const foundProgram = programsData.find(p => p.id === parseInt(id));
      setProgram(foundProgram);
      setLoading(false);
    };

    fetchProgram();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-red-600">Program Not Found</h1>
        <p className="mt-4">The program you're looking for does not exist.</p>
        <Link to="/admission-hub" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Return to Programs
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
            <span>{program.title}</span>
          </div>
          <h1 className="text-3xl font-bold">{program.title}</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Program header */}
          <div className="h-64 bg-gray-200 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90"></div>
            <div className="relative z-10 text-center text-white px-6">
              <h2 className="text-3xl font-bold mb-2">{program.title}</h2>
              <p className="text-xl">{program.level} Degree Program</p>
            </div>
          </div>

          {/* Program details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left column - Overview */}
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Program Overview</h3>
                <p className="text-gray-700 mb-6">{program.description}</p>

                <div className="mb-8">
                  <Link 
                    to={`/program/${program.id}/courses`} 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                    View All Courses
                  </Link>
                </div>

                <h3 className="text-2xl font-bold text-blue-900 mb-4">Curriculum Highlights</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Course Code</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Course Title</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Credits</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {program.courses.map((course, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{course.code}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{course.title}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{course.credits}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="text-2xl font-bold text-blue-900 mb-4">Faculty</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {program.faculty.map((faculty, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-lg">{faculty.name}</h4>
                      <p className="text-gray-700">{faculty.position}</p>
                      <p className="text-gray-600 text-sm">Expertise: {faculty.expertise}</p>
                    </div>
                  ))}
                </div>

                <h3 className="text-2xl font-bold text-blue-900 mb-4">Career Prospects</h3>
                <p className="text-gray-700 mb-6">{program.careerProspects}</p>
              </div>

              {/* Right column - Quick facts */}
              <div>
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">Program Facts</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Degree Level:</span>
                      <span className="font-medium">{program.level}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{program.duration}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Total Credits:</span>
                      <span className="font-medium">{program.credits}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Students Enrolled:</span>
                      <span className="font-medium">{program.studentsEnrolled}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-bold text-green-800 mb-4">Admission Requirements</h3>
                  <p className="text-gray-700">{program.admissionRequirements}</p>
                  <div className="mt-4">
                    <Link 
                      to="/apply" 
                      className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
                  <p className="text-gray-700 mb-2">Department of {program.title.split(' ').slice(-2).join(' ')}</p>
                  <p className="text-gray-700 mb-2">University of Dhaka</p>
                  <p className="text-gray-700 mb-2">Email: admissions@du.edu</p>
                  <p className="text-gray-700">Phone: (123) 456-7890</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related programs */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-blue-900 mb-6">Related Programs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programsData
              .filter(p => p.id !== program.id && p.level === program.level)
              .slice(0, 3)
              .map(relatedProgram => (
                <div key={relatedProgram.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="h-32 bg-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-800 font-bold px-4">
                      {relatedProgram.title}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 mb-4 line-clamp-2">{relatedProgram.description.substring(0, 100)}...</p>
                    <Link 
                      to={`/program/${relatedProgram.id}`} 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Program Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Footer call to action */}
      <div className="bg-blue-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Academic Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Join our community of scholars and innovators at the University of Dhaka.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/apply" 
              className="px-6 py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 transition duration-300"
            >
              Apply Now
            </Link>
            <Link 
              to="/contact" 
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-blue-800 transition duration-300"
            >
              Contact Admissions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramDetails;
