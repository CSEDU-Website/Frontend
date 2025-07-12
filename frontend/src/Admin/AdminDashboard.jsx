import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminMeeting from "./AdminMeeting";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Event management states
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [runningEvents, setRunningEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    registration_deadline: "",
    image_url: "",
    video_url: "",
    registration_link: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Notice management states
  const [notices, setNotices] = useState([]);
  const [upcomingNotices, setUpcomingNotices] = useState([]);
  const [noticeFormData, setNoticeFormData] = useState({
    title: "",
    sub_title: "",
    content: "",
    batch: "",
    date: "",
    notice_from: "",
    attachments: [],
  });
  const [noticeFormErrors, setNoticeFormErrors] = useState({});

  // Exam management states
  const [exams, setExams] = useState([]);
  const [examFilters, setExamFilters] = useState({
    batch: "",
    type: "",
    room: "",
  });
  const [examFormData, setExamFormData] = useState({
    name: "",
    date: "",
    duration: "",
    batch: "",
    room: "",
    type: "",
  });
  const [examFormErrors, setExamFormErrors] = useState({});

  // Equipment management states
  const [equipment, setEquipment] = useState([]);
  const [studentEquipment, setStudentEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [equipmentFormData, setEquipmentFormData] = useState({
    name: "",
    description: "",
    quantity_available: 0,
    image_url: "",
  });
  const [isEditingEquipment, setIsEditingEquipment] = useState(false);
  const [equipmentFormErrors, setEquipmentFormErrors] = useState({});

  // Admission management states
  const [admissionForms, setAdmissionForms] = useState([]);
  const [admissionLoading, setAdmissionLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in and has admin role
    const userData = JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
    );
    if (!userData.isAuthenticated) {
      navigate("/login");
      return;
    }

    if (userData.role !== "admin") {
      navigate(`/${userData.role}-dashboard`);
      return;
    }

    setUser(userData);
  }, [navigate]);

  // Fetch events when active tab is 'events'
  useEffect(() => {
    if (activeTab === "events") {
      fetchAllEvents();
      fetchUpcomingEvents();
      fetchRunningEvents();
    }
  }, [activeTab]);

  // Fetch all events
  const fetchAllEvents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/events/all`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Fetch upcoming events
  const fetchUpcomingEvents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/events/upcoming`);
      setUpcomingEvents(response.data);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
    }
  };

  // Fetch running events
  const fetchRunningEvents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/events/running`);
      setRunningEvents(response.data);
    } catch (error) {
      console.error("Error fetching running events:", error);
    }
  };

  // Create new event
  const createEvent = async (e) => {
    e.preventDefault();

    // Basic validation
    const errors = {};
    if (!eventFormData.name) errors.name = "Name is required";
    if (!eventFormData.start_date) errors.start_date = "Start date is required";
    if (!eventFormData.end_date) errors.end_date = "End date is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/admin/events/create`, eventFormData);
      // Reset form and refetch events
      setEventFormData({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        location: "",
        registration_deadline: "",
        image_url: "",
        video_url: "",
        registration_link: "",
      });
      setFormErrors({});
      fetchAllEvents();
      fetchUpcomingEvents();
      fetchRunningEvents();
    } catch (error) {
      console.error("Error creating event:", error);
      setFormErrors({ submit: "Failed to create event. Please try again." });
    }
  };

  // Update existing event
  const updateEvent = async (e) => {
    e.preventDefault();

    if (!selectedEvent) return;

    try {
      await axios.put(
        `${BACKEND_URL}/admin/events/update/${selectedEvent.id}`,
        eventFormData
      );
      // Reset form, exit editing mode and refetch events
      setEventFormData({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        location: "",
        registration_deadline: "",
        image_url: "",
        video_url: "",
        registration_link: "",
      });
      setIsEditing(false);
      setSelectedEvent(null);
      setFormErrors({});
      fetchAllEvents();
      fetchUpcomingEvents();
      fetchRunningEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      setFormErrors({ submit: "Failed to update event. Please try again." });
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/admin/events/delete/${eventId}`);
      fetchAllEvents();
      fetchUpcomingEvents();
      fetchRunningEvents();

      // If we were editing this event, reset the form
      if (selectedEvent && selectedEvent.id === eventId) {
        setEventFormData({
          name: "",
          description: "",
          start_date: "",
          end_date: "",
          location: "",
          registration_deadline: "",
          image_url: "",
          video_url: "",
          registration_link: "",
        });
        setIsEditing(false);
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  // Select event for editing
  const selectEventForEdit = (event) => {
    setSelectedEvent(event);
    setIsEditing(true);

    // Format dates for the form
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    };

    setEventFormData({
      name: event.name || "",
      description: event.description || "",
      start_date: formatDate(event.start_date),
      end_date: formatDate(event.end_date),
      location: event.location || "",
      registration_deadline: formatDate(event.registration_deadline),
      image_url: event.image_url || "",
      video_url: event.video_url || "",
      registration_link: event.registration_link || "",
    });
  };

  // Handle form input changes
  const handleEventFormChange = (e) => {
    const { name, value } = e.target;
    setEventFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
    setSelectedEvent(null);
    setEventFormData({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      location: "",
      registration_deadline: "",
      image_url: "",
      video_url: "",
      registration_link: "",
    });
    setFormErrors({});
  };

  // Fetch notices when active tab is 'notices'
  useEffect(() => {
    if (activeTab === "notices") {
      fetchAllNotices();
      fetchUpcomingNotices();
    }
  }, [activeTab]);

  // Fetch all notices
  const fetchAllNotices = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/notices/all`);
      setNotices(response.data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  // Fetch upcoming notices
  const fetchUpcomingNotices = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/notices/upcoming`);
      setUpcomingNotices(response.data);
    } catch (error) {
      console.error("Error fetching upcoming notices:", error);
    }
  };

  // Create new notice
  const createNotice = async (e) => {
    e.preventDefault();

    // Basic validation
    const errors = {};
    if (!noticeFormData.title) errors.title = "Title is required";
    if (!noticeFormData.content) errors.content = "Content is required";
    if (!noticeFormData.date) errors.date = "Date is required";
    if (!noticeFormData.notice_from)
      errors.notice_from = "Notice from is required";

    if (Object.keys(errors).length > 0) {
      setNoticeFormErrors(errors);
      return;
    }

    // Convert batch to number or null
    const payload = {
      ...noticeFormData,
      batch: noticeFormData.batch ? parseInt(noticeFormData.batch) : null,
    };

    try {
      await axios.post(`${BACKEND_URL}/admin/notices/create`, payload);
      // Reset form and refetch notices
      setNoticeFormData({
        title: "",
        sub_title: "",
        content: "",
        batch: "",
        date: "",
        notice_from: "",
        attachments: [],
      });
      setNoticeFormErrors({});
      fetchAllNotices();
      fetchUpcomingNotices();
    } catch (error) {
      console.error("Error creating notice:", error);
      setNoticeFormErrors({
        submit: "Failed to create notice. Please try again.",
      });
    }
  };

  // Delete notice
  const deleteNotice = async (noticeId) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/admin/notices/delete/${noticeId}`);
      fetchAllNotices();
      fetchUpcomingNotices();
    } catch (error) {
      console.error("Error deleting notice:", error);
      alert("Failed to delete notice. Please try again.");
    }
  };

  // Handle notice form input changes
  const handleNoticeFormChange = (e) => {
    const { name, value } = e.target;
    setNoticeFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    if (noticeFormErrors[name]) {
      setNoticeFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Fetch exams when active tab is 'exams' or filters change
  useEffect(() => {
    if (activeTab === "exams") {
      fetchExams();
    }
  }, [activeTab, examFilters]);

  // Fetch exams with optional filters
  const fetchExams = async () => {
    try {
      const params = {};
      if (examFilters.batch) params.batch = examFilters.batch;
      if (examFilters.type) params.type = examFilters.type;
      if (examFilters.room) params.room = examFilters.room;

      const response = await axios.get(`${BACKEND_URL}/admin/exams/list`, {
        params,
      });
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  // Create new exam
  const createExam = async (e) => {
    e.preventDefault();

    // Basic validation
    const errors = {};
    if (!examFormData.name) errors.name = "Exam name is required";
    if (!examFormData.date) errors.date = "Date is required";
    if (!examFormData.type) errors.type = "Exam type is required";
    if (!examFormData.batch) errors.batch = "Batch is required";

    if (Object.keys(errors).length > 0) {
      setExamFormErrors(errors);
      return;
    }

    try {
      // Format the duration to ensure it's a number
      const payload = {
        ...examFormData,
        duration: examFormData.duration ? parseInt(examFormData.duration) : 0,
      };

      await axios.post(`${BACKEND_URL}/admin/exams/create`, payload);
      // Reset form and refetch exams
      setExamFormData({
        name: "",
        date: "",
        duration: "",
        batch: "",
        room: "",
        type: "",
      });
      setExamFormErrors({});
      fetchExams();
    } catch (error) {
      console.error("Error creating exam:", error);
      setExamFormErrors({ submit: "Failed to create exam. Please try again." });
    }
  };

  // Delete exam
  const deleteExam = async (examId) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/admin/exams/delete/${examId}`);
      fetchExams();
    } catch (error) {
      console.error("Error deleting exam:", error);
      alert("Failed to delete exam. Please try again.");
    }
  };

  // Handle exam form input changes
  const handleExamFormChange = (e) => {
    const { name, value } = e.target;
    setExamFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    if (examFormErrors[name]) {
      setExamFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle exam filter changes
  const handleExamFilterChange = (e) => {
    const { name, value } = e.target;
    setExamFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Clear all exam filters
  const clearExamFilters = () => {
    setExamFilters({
      batch: "",
      type: "",
      room: "",
    });
  };

  // Fetch equipment when active tab is 'equipment'
  useEffect(() => {
    if (activeTab === "equipment") {
      fetchEquipment();
      fetchStudentEquipment();
    }
  }, [activeTab]);

  // Fetch all equipment
  const fetchEquipment = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/admin/equipment/list-all`
      );
      setEquipment(response.data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  // Fetch student equipment orders
  const fetchStudentEquipment = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/admin/equipment/student-equipments/list-all`
      );
      setStudentEquipment(response.data);
    } catch (error) {
      console.error("Error fetching student equipment orders:", error);
    }
  };

  // Create new equipment
  const createEquipment = async (e) => {
    e.preventDefault();

    // Basic validation
    const errors = {};
    if (!equipmentFormData.name) errors.name = "Name is required";
    if (!equipmentFormData.description)
      errors.description = "Description is required";
    if (equipmentFormData.quantity_available < 0)
      errors.quantity_available = "Quantity must be non-negative";

    if (Object.keys(errors).length > 0) {
      setEquipmentFormErrors(errors);
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/admin/equipment/create`, {
        ...equipmentFormData,
        quantity_available: parseInt(equipmentFormData.quantity_available),
      });
      // Reset form and refetch equipment
      setEquipmentFormData({
        name: "",
        description: "",
        quantity_available: 0,
        image_url: "",
      });
      setEquipmentFormErrors({});
      fetchEquipment();
    } catch (error) {
      console.error("Error creating equipment:", error);
      setEquipmentFormErrors({
        submit: "Failed to create equipment. Please try again.",
      });
    }
  };

  // Update existing equipment
  const updateEquipment = async (e) => {
    e.preventDefault();

    if (!selectedEquipment) return;

    // Basic validation
    const errors = {};
    if (!equipmentFormData.name) errors.name = "Name is required";
    if (!equipmentFormData.description)
      errors.description = "Description is required";
    if (equipmentFormData.quantity_available < 0)
      errors.quantity_available = "Quantity must be non-negative";

    if (Object.keys(errors).length > 0) {
      setEquipmentFormErrors(errors);
      return;
    }

    try {
      await axios.put(`${BACKEND_URL}/admin/equipment/edit`, {
        equipment_id: selectedEquipment.id,
        ...equipmentFormData,
        quantity_available: parseInt(equipmentFormData.quantity_available),
      });
      // Reset form, exit editing mode and refetch equipment
      setEquipmentFormData({
        name: "",
        description: "",
        quantity_available: 0,
        image_url: "",
      });
      setIsEditingEquipment(false);
      setSelectedEquipment(null);
      setEquipmentFormErrors({});
      fetchEquipment();
    } catch (error) {
      console.error("Error updating equipment:", error);
      setEquipmentFormErrors({
        submit: "Failed to update equipment. Please try again.",
      });
    }
  };

  // Delete equipment
  const deleteEquipment = async (equipmentId) => {
    if (!window.confirm("Are you sure you want to delete this equipment?"))
      return;

    try {
      await axios.delete(`${BACKEND_URL}/admin/equipment/delete`, {
        data: { equipment_id: equipmentId },
      });
      fetchEquipment();

      // If we were editing this equipment, reset the form
      if (selectedEquipment && selectedEquipment.id === equipmentId) {
        setEquipmentFormData({
          name: "",
          description: "",
          quantity_available: 0,
          image_url: "",
        });
        setIsEditingEquipment(false);
        setSelectedEquipment(null);
      }
    } catch (error) {
      console.error("Error deleting equipment:", error);
      alert("Failed to delete equipment. Please try again.");
    }
  };

  // Accept equipment return
  const acceptEquipmentReturn = async (orderId) => {
    if (!window.confirm("Confirm that this equipment has been returned?"))
      return;

    try {
      await axios.post(
        `${BACKEND_URL}/admin/equipment/student-equipments/accept-return`,
        {
          order_id: orderId,
        }
      );
      fetchStudentEquipment();
      fetchEquipment();
    } catch (error) {
      console.error("Error accepting equipment return:", error);
      alert("Failed to process equipment return. Please try again.");
    }
  };

  // Select equipment for editing
  const selectEquipmentForEdit = (item) => {
    setSelectedEquipment(item);
    setIsEditingEquipment(true);

    setEquipmentFormData({
      name: item.name || "",
      description: item.description || "",
      quantity_available: item.quantity_available || 0,
      image_url: item.image_url || "",
    });
  };

  // Handle equipment form input changes
  const handleEquipmentFormChange = (e) => {
    const { name, value } = e.target;
    setEquipmentFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    if (equipmentFormErrors[name]) {
      setEquipmentFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Cancel equipment editing
  const cancelEquipmentEdit = () => {
    setIsEditingEquipment(false);
    setSelectedEquipment(null);
    setEquipmentFormData({
      name: "",
      description: "",
      quantity_available: 0,
      image_url: "",
    });
    setEquipmentFormErrors({});
  };

  // Fetch admission forms when active tab is 'admission'
  useEffect(() => {
    if (activeTab === "admission") {
      fetchAdmissionForms();
    }
  }, [activeTab]);

  // Fetch all admission forms
  const fetchAdmissionForms = async () => {
    setAdmissionLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/admission/list`);
      setAdmissionForms(response.data);
    } catch (error) {
      console.error("Error fetching admission forms:", error);
    } finally {
      setAdmissionLoading(false);
    }
  };

  // Delete admission form
  const deleteAdmissionForm = async (formId) => {
    if (!window.confirm("Are you sure you want to delete this admission form?"))
      return;

    try {
      await axios.delete(`${BACKEND_URL}/admin/admission/delete/${formId}`);
      fetchAdmissionForms();
    } catch (error) {
      console.error("Error deleting admission form:", error);
      alert("Failed to delete admission form. Please try again.");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  if (!user) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-purple-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex items-center py-4">
              <span className="font-semibold text-lg">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{user.email}</span>
              <Link to="/" className="hover:text-purple-300">
                Home
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  sessionStorage.removeItem("user");
                  navigate("/");
                }}
                className="py-2 px-3 bg-red-600 hover:bg-red-500 rounded transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "dashboard"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "users"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("users")}
          >
            User Management
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "courses"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("courses")}
          >
            Course Management
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "exams"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("exams")}
          >
            Exam Schedule
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "events"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("events")}
          >
            Event Management
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "notices"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("notices")}
          >
            Notice Board
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "resources"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("resources")}
          >
            Resources
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "website"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("website")}
          >
            Website Content
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "equipment"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("equipment")}
          >
            Equipment
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "admission"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("admission")}
          >
            Admission
          </button>

          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "meeting"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("meeting")}
          >
            Meeting
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "dashboard" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome, Admin {user.fullname || user.email}!
            </h1>
            <p className="text-gray-600">
              This is your administrative dashboard where you can manage
              department resources, user accounts, and oversee academic
              operations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-purple-800 mb-4">
                  User Management
                </h2>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">Total Users</span>
                    <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded">
                      350
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-sm font-medium">Students</div>
                      <div className="text-purple-700 font-bold">280</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-sm font-medium">Teachers</div>
                      <div className="text-purple-700 font-bold">45</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-sm font-medium">Admins</div>
                      <div className="text-purple-700 font-bold">25</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveTab("users")}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1 rounded transition"
                    >
                      Manage Users
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-purple-800 mb-4">
                  Course Management
                </h2>
                <ul className="space-y-3">
                  <li className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">Active Courses</div>
                    <div className="text-sm text-gray-600 mb-2">
                      Current Semester: 28 courses
                    </div>
                    <button
                      onClick={() => setActiveTab("courses")}
                      className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200"
                    >
                      Manage Courses
                    </button>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-purple-800 mb-4">
                  Events
                </h2>
                <ul className="space-y-3">
                  <li className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">Upcoming Events</div>
                    <div className="text-sm text-gray-600 mb-2">
                      {upcomingEvents.length || 0} events scheduled
                    </div>
                    <button
                      onClick={() => setActiveTab("events")}
                      className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200"
                    >
                      Manage Events
                    </button>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-purple-800 mb-4">
                  Notice Board
                </h2>
                <ul className="space-y-3">
                  <li className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">Upcoming Notices</div>
                    <div className="text-sm text-gray-600 mb-2">
                      {upcomingNotices.length || 0} notices published
                    </div>
                    <button
                      onClick={() => setActiveTab("notices")}
                      className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200"
                    >
                      Manage Notices
                    </button>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-purple-800 mb-4">
                  Exam Schedule
                </h2>
                <ul className="space-y-3">
                  <li className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">Upcoming Exams</div>
                    <div className="text-sm text-gray-600 mb-2">
                      {exams.length || 0} exams scheduled
                    </div>
                    <button
                      onClick={() => setActiveTab("exams")}
                      className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200"
                    >
                      Manage Exams
                    </button>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-purple-800 mb-4">
                  Admission Forms
                </h2>
                <ul className="space-y-3">
                  <li className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">Applications</div>
                    <div className="text-sm text-gray-600 mb-2">
                      {admissionForms.length || 0} forms submitted
                    </div>
                    <button
                      onClick={() => setActiveTab("admission")}
                      className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200"
                    >
                      Manage Admissions
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                {isEditing ? "Edit Event" : "Create New Event"}
              </h2>

              {formErrors.submit && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {formErrors.submit}
                </div>
              )}

              <form
                onSubmit={isEditing ? updateEvent : createEvent}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={eventFormData.name}
                      onChange={handleEventFormChange}
                      className={`w-full p-2 border ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md`}
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={eventFormData.location}
                      onChange={handleEventFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={eventFormData.description}
                    onChange={handleEventFormChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date*
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={eventFormData.start_date}
                      onChange={handleEventFormChange}
                      className={`w-full p-2 border ${
                        formErrors.start_date
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {formErrors.start_date && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.start_date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date*
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={eventFormData.end_date}
                      onChange={handleEventFormChange}
                      className={`w-full p-2 border ${
                        formErrors.end_date
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {formErrors.end_date && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.end_date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Deadline
                    </label>
                    <input
                      type="date"
                      name="registration_deadline"
                      value={eventFormData.registration_deadline}
                      onChange={handleEventFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={eventFormData.image_url}
                      onChange={handleEventFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video URL
                    </label>
                    <input
                      type="url"
                      name="video_url"
                      value={eventFormData.video_url}
                      onChange={handleEventFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Link
                    </label>
                    <input
                      type="url"
                      name="registration_link"
                      value={eventFormData.registration_link}
                      onChange={handleEventFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="https://forms.google.com/..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    {isEditing ? "Update Event" : "Create Event"}
                  </button>
                </div>
              </form>
            </div>

            {/* Event Lists */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-purple-800 mb-4">
                  Upcoming Events ({upcomingEvents.length})
                </h2>

                {upcomingEvents.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No upcoming events found.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {upcomingEvents.map((event) => (
                          <tr key={event.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {event.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {new Date(
                                  event.start_date
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(event.end_date).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {event.location || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => selectEventForEdit(event)}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteEvent(event.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-purple-800 mb-4">
                  Running Events ({runningEvents.length})
                </h2>

                {runningEvents.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No running events found.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {runningEvents.map((event) => (
                          <tr key={event.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {event.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {new Date(
                                  event.start_date
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(event.end_date).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {event.location || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => selectEventForEdit(event)}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteEvent(event.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* All Events */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                All Events ({events.length})
              </h2>

              {events.length === 0 ? (
                <p className="text-gray-500 italic">No events found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registration Deadline
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.map((event) => (
                        <tr key={event.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {event.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {event.description?.substring(0, 50)}...
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(event.start_date).toLocaleDateString()}{" "}
                              - {new Date(event.end_date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {event.location || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {event.registration_deadline
                                ? new Date(
                                    event.registration_deadline
                                  ).toLocaleDateString()
                                : "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => selectEventForEdit(event)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "notices" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                Create New Notice
              </h2>

              {noticeFormErrors.submit && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {noticeFormErrors.submit}
                </div>
              )}

              <form onSubmit={createNotice} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title*
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={noticeFormData.title}
                      onChange={handleNoticeFormChange}
                      className={`w-full p-2 border ${
                        noticeFormErrors.title
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {noticeFormErrors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {noticeFormErrors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      name="sub_title"
                      value={noticeFormData.sub_title}
                      onChange={handleNoticeFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content*
                  </label>
                  <textarea
                    name="content"
                    value={noticeFormData.content}
                    onChange={handleNoticeFormChange}
                    rows="5"
                    className={`w-full p-2 border ${
                      noticeFormErrors.content
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md`}
                  ></textarea>
                  {noticeFormErrors.content && (
                    <p className="mt-1 text-sm text-red-600">
                      {noticeFormErrors.content}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date*
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={noticeFormData.date}
                      onChange={handleNoticeFormChange}
                      className={`w-full p-2 border ${
                        noticeFormErrors.date
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {noticeFormErrors.date && (
                      <p className="mt-1 text-sm text-red-600">
                        {noticeFormErrors.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From*
                    </label>
                    <input
                      type="text"
                      name="notice_from"
                      value={noticeFormData.notice_from}
                      onChange={handleNoticeFormChange}
                      className={`w-full p-2 border ${
                        noticeFormErrors.notice_from
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                      placeholder="e.g., Chairman, CSEDU"
                    />
                    {noticeFormErrors.notice_from && (
                      <p className="mt-1 text-sm text-red-600">
                        {noticeFormErrors.notice_from}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch (Optional)
                    </label>
                    <input
                      type="number"
                      name="batch"
                      value={noticeFormData.batch}
                      onChange={handleNoticeFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., 25"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for all batches
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Publish Notice
                  </button>
                </div>
              </form>
            </div>

            {/* Upcoming Notices */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                Upcoming Notices ({upcomingNotices.length})
              </h2>

              {upcomingNotices.length === 0 ? (
                <p className="text-gray-500 italic">
                  No upcoming notices found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          From
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Batch
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {upcomingNotices.map((notice) => (
                        <tr key={notice.id}>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {notice.title}
                            </div>
                            {notice.sub_title && (
                              <div className="text-xs text-gray-500">
                                {notice.sub_title}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(notice.date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {notice.notice_from}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {notice.batch ? notice.batch : "All"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteNotice(notice.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* All Notices */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                All Notices ({notices.length})
              </h2>

              {notices.length === 0 ? (
                <p className="text-gray-500 italic">No notices found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Content
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          From
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Batch
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {notices.map((notice) => (
                        <tr key={notice.id}>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {notice.title}
                            </div>
                            {notice.sub_title && (
                              <div className="text-xs text-gray-500">
                                {notice.sub_title}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {notice.content.length > 50
                                ? `${notice.content.substring(0, 50)}...`
                                : notice.content}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(notice.date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {notice.notice_from}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {notice.batch ? notice.batch : "All"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteNotice(notice.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "exams" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                Create New Exam
              </h2>

              {examFormErrors.submit && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {examFormErrors.submit}
                </div>
              )}

              <form onSubmit={createExam} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exam Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={examFormData.name}
                      onChange={handleExamFormChange}
                      className={`w-full p-2 border ${
                        examFormErrors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                      placeholder="e.g., CSE4103 Final Exam"
                    />
                    {examFormErrors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {examFormErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date*
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={examFormData.date}
                      onChange={handleExamFormChange}
                      className={`w-full p-2 border ${
                        examFormErrors.date
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {examFormErrors.date && (
                      <p className="mt-1 text-sm text-red-600">
                        {examFormErrors.date}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exam Type*
                    </label>
                    <select
                      name="type"
                      value={examFormData.type}
                      onChange={handleExamFormChange}
                      className={`w-full p-2 border ${
                        examFormErrors.type
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    >
                      <option value="">Select Type</option>
                      <option value="Quiz">Quiz</option>
                      <option value="Midterm">Midterm</option>
                      <option value="Final">Final</option>
                      <option value="Lab Test">Lab Test</option>
                      <option value="Assignment">Assignment</option>
                    </select>
                    {examFormErrors.type && (
                      <p className="mt-1 text-sm text-red-600">
                        {examFormErrors.type}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch*
                    </label>
                    <input
                      type="text"
                      name="batch"
                      value={examFormData.batch}
                      onChange={handleExamFormChange}
                      className={`w-full p-2 border ${
                        examFormErrors.batch
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                      placeholder="e.g., 25"
                    />
                    {examFormErrors.batch && (
                      <p className="mt-1 text-sm text-red-600">
                        {examFormErrors.batch}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room
                    </label>
                    <input
                      type="text"
                      name="room"
                      value={examFormData.room}
                      onChange={handleExamFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Room 302"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={examFormData.duration}
                    onChange={handleExamFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., 120"
                    min="0"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Schedule Exam
                  </button>
                </div>
              </form>
            </div>

            {/* Exam Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                Exam Filters
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch
                  </label>
                  <input
                    type="text"
                    name="batch"
                    value={examFilters.batch}
                    onChange={handleExamFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., 25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Type
                  </label>
                  <select
                    name="type"
                    value={examFilters.type}
                    onChange={handleExamFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Types</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Midterm">Midterm</option>
                    <option value="Final">Final</option>
                    <option value="Lab Test">Lab Test</option>
                    <option value="Assignment">Assignment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room
                  </label>
                  <input
                    type="text"
                    name="room"
                    value={examFilters.room}
                    onChange={handleExamFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Room 302"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearExamFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 w-full"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Exam List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                Upcoming Exams ({exams.length})
              </h2>

              {exams.length === 0 ? (
                <p className="text-gray-500 italic">No upcoming exams found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exam Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Batch
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Room
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {exams.map((exam) => (
                        <tr key={exam.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {exam.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(exam.date).toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                exam.type === "Quiz"
                                  ? "bg-blue-100 text-blue-800"
                                  : exam.type === "Midterm"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : exam.type === "Final"
                                  ? "bg-red-100 text-red-800"
                                  : exam.type === "Lab Test"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {exam.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {exam.batch}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {exam.room || "TBA"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {exam.duration ? `${exam.duration} mins` : "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteExam(exam.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "equipment" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                {isEditingEquipment ? "Edit Equipment" : "Add New Equipment"}
              </h2>

              {equipmentFormErrors.submit && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {equipmentFormErrors.submit}
                </div>
              )}

              <form
                onSubmit={
                  isEditingEquipment ? updateEquipment : createEquipment
                }
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Equipment Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={equipmentFormData.name}
                      onChange={handleEquipmentFormChange}
                      className={`w-full p-2 border ${
                        equipmentFormErrors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {equipmentFormErrors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {equipmentFormErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available Quantity*
                    </label>
                    <input
                      type="number"
                      name="quantity_available"
                      value={equipmentFormData.quantity_available}
                      onChange={handleEquipmentFormChange}
                      min="0"
                      className={`w-full p-2 border ${
                        equipmentFormErrors.quantity_available
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {equipmentFormErrors.quantity_available && (
                      <p className="mt-1 text-sm text-red-600">
                        {equipmentFormErrors.quantity_available}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <textarea
                    name="description"
                    value={equipmentFormData.description}
                    onChange={handleEquipmentFormChange}
                    rows="3"
                    className={`w-full p-2 border ${
                      equipmentFormErrors.description
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md`}
                  ></textarea>
                  {equipmentFormErrors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {equipmentFormErrors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image_url"
                    value={equipmentFormData.image_url}
                    onChange={handleEquipmentFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  {isEditingEquipment && (
                    <button
                      type="button"
                      onClick={cancelEquipmentEdit}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    {isEditingEquipment ? "Update Equipment" : "Add Equipment"}
                  </button>
                </div>
              </form>
            </div>

            {/* Equipment List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                Available Equipment ({equipment.length})
              </h2>

              {equipment.length === 0 ? (
                <p className="text-gray-500 italic">No equipment found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Equipment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Available
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {equipment.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {item.image_url && (
                                <div className="flex-shrink-0 h-10 w-10 mr-3">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={item.image_url}
                                    alt={item.name}
                                  />
                                </div>
                              )}
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {item.description.length > 100
                                ? `${item.description.substring(0, 100)}...`
                                : item.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.quantity_available > 0
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.quantity_available}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => selectEquipmentForEdit(item)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteEquipment(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Student Equipment Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                Student Equipment Orders ({studentEquipment.length})
              </h2>

              {studentEquipment.length === 0 ? (
                <p className="text-gray-500 italic">
                  No equipment orders found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Equipment ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Checkout Period
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentEquipment.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {order.student_id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {order.equipment_id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(order.start_date).toLocaleDateString()}{" "}
                              - {new Date(order.end_date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {order.quantity}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.returned
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.returned ? "Returned" : "Checked Out"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {!order.returned && (
                              <button
                                onClick={() => acceptEquipmentReturn(order.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Accept Return
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admission Tab Content */}
        {activeTab === "admission" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                Admission Applications ({admissionForms.length})
              </h2>

              {admissionLoading ? (
                <div className="flex justify-center py-6">
                  <svg
                    className="animate-spin h-10 w-10 text-purple-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : admissionForms.length === 0 ? (
                <p className="text-gray-500 italic">
                  No admission applications found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applicant Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted On
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {admissionForms.map((form) => (
                        <tr key={form.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {form.full_name || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {form.email || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {form.phone || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(form.form_given_on)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                form.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : form.status === "Accepted"
                                  ? "bg-green-100 text-green-800"
                                  : form.status === "Rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {form.status || "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() =>
                                window.open(
                                  `${BACKEND_URL}/admin/admission/download/${form.id}`,
                                  "_blank"
                                )
                              }
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Download
                            </button>
                            <button
                              onClick={() => deleteAdmissionForm(form.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                Admission Process Overview
              </h2>

              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="bg-purple-100 text-purple-800 rounded-full h-10 w-10 flex items-center justify-center mr-4">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      Application Submission
                    </h3>
                    <p className="text-gray-600">
                      Students submit their applications through the admission
                      portal
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="bg-purple-100 text-purple-800 rounded-full h-10 w-10 flex items-center justify-center mr-4">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Application Review</h3>
                    <p className="text-gray-600">
                      Admin staff review applications and verify documents
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="bg-purple-100 text-purple-800 rounded-full h-10 w-10 flex items-center justify-center mr-4">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      Entrance Examination
                    </h3>
                    <p className="text-gray-600">
                      Eligible candidates take the entrance examination
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="bg-purple-100 text-purple-800 rounded-full h-10 w-10 flex items-center justify-center mr-4">
                    <span className="font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Final Selection</h3>
                    <p className="text-gray-600">
                      Students are selected based on merit and examination
                      results
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab == "meeting" && <AdminMeeting user={user}/>}

        {/* ...existing tab contents... */}
      </div>
    </div>
  );
}

export default AdminDashboard;
