import axiosInstance from './axiosInstance'

export const getProfileApi      = ()           => axiosInstance.get('/api/student/profile')
export const updateProfileApi   = (data)       => axiosInstance.put('/api/student/profile', data)
export const uploadResumeApi    = (formData)   =>
  axiosInstance.post('/api/student/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
export const getJobsApi         = ()           => axiosInstance.get('/api/student/jobs')
export const applyToJobApi      = (jobId)      => axiosInstance.post(`/api/student/apply/${jobId}`)
export const getMyApplicationsApi = ()         => axiosInstance.get('/api/student/applications')
export const getMyInterviewsApi   = ()         => axiosInstance.get('/api/student/interviews')
