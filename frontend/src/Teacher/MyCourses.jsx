import React, { useEffect, useState } from "react";
import axios from "axios";
import ClassCard from "./components/ClassCard";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Skeleton = ({ className = "h-6 w-full" }) => {
  return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;
};

export default function MyCourses() {
  const [user, setUser] = useState(null);
  const [teacherProfile, setTeacherProfile] = useState({});

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    console.log("stored user: ");
    console.log(storedUser);

    if (storedUser?.isAuthenticated && !user) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const fetchTeacherProfile = async (userId) => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/v1/teacher/profile/get`,
          {
            params: { userId },
          }
        );
        setTeacherProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch teacher profile:", error);
      }
    };

    if (user && user?.id) {
      fetchTeacherProfile(user?.id);
    }
  }, [user]);

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teacherProfile && teacherProfile?.id) {
      console.log("teacher profile");
      console.log(teacherProfile);

      axios
        .get(
          `${BACKEND_URL}/v1/teacher/courses/my_classes/${teacherProfile?.id}`
        )
        .then((res) => {
          //   console.log(res.data)
          setClasses(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch classes", err);
          setLoading(false);
        });
    }
  }, [teacherProfile]);

  useEffect(() => {
    if (classes) {
      console.log(classes);
    }
  }, [classes]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">My Classes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-52 w-full max-w-md rounded-2xl" />
            ))
          : classes.map((course) => (
              <ClassCard key={course.id} course={course} />
            ))}
      </div>
    </div>
  );
}
