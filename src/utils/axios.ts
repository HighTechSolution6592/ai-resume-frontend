import axios from "axios";
const backend_url = import.meta.env.VITE_BACKEND_URL;

function getUserEmail() {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  return user.email;
}

export const improveSummary = async (summary: String, description: String) => {
  try {
    const response = await axios.post(backend_url + '/resume/improve-summary', { summary, description });
    return response.data;
  } catch (error: any) {
    console.error("Error improving summary:", error);
    throw error;
  }
}

export const improveResponsibility = async (workExperience: Array<any>) => {
  try {
    const response = await axios.post(backend_url + '/resume/improve-responsibility', { workExperience });
    return response.data;
  } catch (error: any) {
    console.error("Error improving responsibility:", error);
    throw error;
  }
}

export const getAllResume = async () => { 
  try {
    const response = await axios.post(backend_url + '/resume/all', {userEmail: getUserEmail()});
    return response.data;
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    throw error;
  }
}

export const addResume = async (resumeData: any) => {
  try {
    await axios.post(backend_url + '/resume/add', { resumeData, userEmail: getUserEmail() });
  } catch  (error: any) {
    console.error("Error adding resume:", error);
    throw error;
  }
}

export const getResume = async (resumeId: string) => {
  try {
    const response = await axios.post(backend_url + '/resume/get', { resumeId, userEmail: getUserEmail() });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching resume:", error);
  } 
}

export const updateResume = async (resumeId: string, resumeData: any) => {
  try {
    await axios.post(backend_url + '/resume/update', { resumeId, resumeData, userEmail: getUserEmail() });
  } catch (error: any) {
    console.error("Error updating resume:", error);
    throw error;
  }
}

export const deleteResume = async (resumeId: string) => {
  try {
    await axios.post(backend_url + '/resume/delete', { resumeId, userEmail: getUserEmail() });
  } catch (error: any) {
    console.error("Error deleting resume:", error);
    throw error;
  }
}

export const generateCoverLetter = async (formData: any) => {
  try {
    const response = await axios.post(backend_url + '/coverLetter/generate-coverLetter', { formData});
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log("Error improving summary:", error);
    throw error;
  }
}

export const getAllCoverLetter = async () => { 
  try {
    const response = await axios.post(backend_url + '/coverLetter/all', {userEmail: getUserEmail()});
    return response.data;
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    throw error;
  }
}

export const addCoverLetter = async (coverLetterData: any, content: string) => {
  try {
    await axios.post(backend_url + '/coverLetter/add', { coverLetterData, userEmail: getUserEmail(), content });
  } catch  (error: any) {
    console.error("Error adding cover letter:", error);
    throw error;
  }
}

export const getCoverLetter = async (coverLetterId: string) => {
  try {
    const response = await axios.post(backend_url + '/coverLetter/get', { coverLetterId, userEmail: getUserEmail() });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching cover letter:", error);
  } 
}

export const updateCoverLetter = async (coverLetterId: string, coverLetterData: any, content: any) => {
  try {
    await axios.post(backend_url + '/coverLetter/update', { coverLetterId, coverLetterData, content, userEmail: getUserEmail() });
  } catch (error: any) {
    console.error("Error updating cover letter:", error);
    throw error;
  }
}

export const deleteCoverLetter = async (coverLetterId: string) => {
  try {
    await axios.post(backend_url + '/coverLetter/delete', { coverLetterId, userEmail: getUserEmail() });
  } catch (error: any) {
    console.error("Error deleting cover letter:", error);
    throw error;
  }
}