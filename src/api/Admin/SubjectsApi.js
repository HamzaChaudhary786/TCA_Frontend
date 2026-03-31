import axios from "axios";
import apiRequest from "../../utils/ApiRequest";
import { BACKEND_URL } from "../../constants/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

export const getAllSubjects = apiRequest(async () => {
  const url = `${BACKEND_URL}/subject`;
  const response = await axios.get(url);
  return response;
});


export const useGetAllSubjectsWithLevel = (levelId) => {
  const { data: subjectWithLevel = [], isLoading, isFetching } = useQuery({
    queryKey: ['fetchSubjectWithLevel', levelId],
    queryFn: async () => {
      const url = `${BACKEND_URL}/subject/${levelId}`;
      const { data, status } = await axios.get(url);
      if (status !== 200) throw new Error('Failed to fetch subjects');
      return data;
    },
    enabled: !!levelId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: [],
    retry: 2,
  });

  return { subjectWithLevel, isLoading, isFetching };
};




export const createSubject = apiRequest(async (data) => {
  const url = `${BACKEND_URL}/subject`;
  const response = await axios.post(url, data);
  return response;
});

export const editSubject = apiRequest(async (data, id) => {
  const url = `${BACKEND_URL}/subject/${id}`;
  const response = await axios.put(url, data);
  return response;
});

export const deleteSubject = apiRequest(async (id) => {
  const url = `${BACKEND_URL}/subject/${id}`;
  const response = await axios.delete(url);
  return response;
});


export const useGetTeacherSubject = (teacherId) => {
  const getMyTeacherSubjectRequest = async () => {
    const url = `${BACKEND_URL}/subject/teacher-subject/${teacherId}`;
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error('Failed to get teacher subject');
    }

    return response.data;
  };

  const { data: teacherSubject, isLoading, error } = useQuery({
    queryKey: ['fetchTeacherSubject', teacherId],
    queryFn: getMyTeacherSubjectRequest,
    enabled: Boolean(teacherId), // Only trigger if teacherId is truthy
  });

  return {
    isLoading,
    teacherSubject,
    error,
  };
};



// export const getAllSubjectOfStudent = apiRequest(async () => {
//   const url = `${BACKEND_URL}/subject/student-subject`;
//   const response = await axios.get(url);
//   return response;
// });



export const useGetAllSubjectOfStudent = (studentId) => {


  const getMyStudentSubjects = async () => {
    const url = `${BACKEND_URL}/subject/student-subject/${studentId}`;
    const response = await axios.get(url);

    // Note: Axios does not use response.ok, so check the status code directly
    if (response.status !== 200) {
      throw new Error('Failed to get user');
    }

    return response.data; // Axios automatically parses the JSON response
  };

  // Updated useQuery call with object form
  const { data: studentSubject, isLoading, error, refetch } = useQuery({
    queryKey: ['get student subject', studentId],
    queryFn: getMyStudentSubjects,
    enabled: !!studentId, // Only run the query if levelId is truthy

  });

  // if (error) {
  //   toast.error(error.toString());
  // }

  return {
    isLoading,
    studentSubject,
    refetch
  };
};

export const useGetSubjectsOfLevel = (levelId) => {
  const fetchSubjects = async () => {
    const response = await axios.get(`${BACKEND_URL}/subject/${levelId}`);
    if (response.status !== 200) throw new Error('Failed to fetch subjects');
    return response.data;
  };

  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['fetchSubjectsOfLevel', levelId],
    queryFn: fetchSubjects,
    enabled: !!levelId,
  });

  return { subjects, subjectsLoading };
};
