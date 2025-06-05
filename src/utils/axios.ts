import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;
const userId = "1234567890abcdef12345678"

export const improveSummary = async (summary: String, description: String) => {

  try {
    const response = await axios.post(backend_url + '/resume/improve-summary', { summary, description });
    // console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error improving summary:", error);
    throw error;
  }
  
}

export const getAllResume = async () => { 
  try {
    const response = await axios.post(backend_url + '/resume/all', {userId});
    // console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    throw error;
  }
}

export const addResume = async (resumeData: any) => {

  try {
    await axios.post(backend_url + '/resume/add', { resumeData, userId });
    // console.log(response.data);
  } catch  (error: any) {
    console.error("Error adding resume:", error);
    throw error;
  }

}

export const getResume = async (resumeId: string) => {
  try {
    const response = await axios.post(backend_url + '/resume/get', { resumeId, userId });
    // console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching resume:", error);
  } 
}

export const updateResume = async (resumeId: string, resumeData: any) => {
  try {
    await axios.post(backend_url + '/resume/update', { resumeId, resumeData, userId });
    // console.log(response.data);
  } catch (error: any) {
    console.error("Error updating resume:", error);
    throw error;
  }
}

export const deleteResume = async (resumeId: string) => {
  try {
    await axios.post(backend_url + '/resume/delete', { resumeId, userId });
    // console.log(response.data);
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
    const response = await axios.post(backend_url + '/coverLetter/all', {userId});
    return response.data;
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    throw error;
  }
}

export const addCoverLetter = async (coverLetterData: any, content: string) => {

  try {
    await axios.post(backend_url + '/coverLetter/add', { coverLetterData, userId, content });
    // console.log(response.data);
  } catch  (error: any) {
    console.error("Error adding cover letter:", error);
    throw error;
  }

}

export const getCoverLetter = async (coverLetterId: string) => {
  try {
    const response = await axios.post(backend_url + '/coverLetter/get', { coverLetterId, userId });
    // console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching cover letter:", error);
  } 
}

export const updateCoverLetter = async (coverLetterId: string, coverLetterData: any, content: any) => {
  try {
    await axios.post(backend_url + '/coverLetter/update', { coverLetterId, coverLetterData, content, userId });
    // console.log(response.data);
  } catch (error: any) {
    console.error("Error updating cover letter:", error);
    throw error;
  }
}

export const deleteCoverLetter = async (coverLetterId: string) => {
  try {
    await axios.post(backend_url + '/coverLetter/delete', { coverLetterId, userId });
    // console.log(response.data);
  } catch (error: any) {
    console.error("Error deleting cover letter:", error);
    throw error;
  }
}