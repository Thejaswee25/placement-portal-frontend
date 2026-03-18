import axiosInstance from './axiosInstance'

export const getAllStudentsApi       = ()    => axiosInstance.get('/api/admin/students')
export const getStudentByIdApi       = (id) => axiosInstance.get(`/api/admin/student/${id}`)
export const downloadResumeUrl       = (id) => `http://localhost:8080/api/admin/student/${id}/resume`
export const getAllApplicationsApi   = ()    => axiosInstance.get('/api/admin/applications')
export const shortlistApplicationApi = (id) => axiosInstance.put(`/api/admin/application/${id}/shortlist`)
export const rejectApplicationApi    = (id) => axiosInstance.put(`/api/admin/application/${id}/reject`)
export const selectApplicationApi    = (id) => axiosInstance.put(`/api/admin/application/${id}/select`)
export const scheduleInterviewApi    = (data) => axiosInstance.post('/api/admin/interview', data)
export const getAllInterviewsApi      = ()    => axiosInstance.get('/api/admin/interviews')
