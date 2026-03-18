import axiosInstance from './axiosInstance'

export const getAllCompaniesApi = ()       => axiosInstance.get('/api/companies')
export const getCompanyByIdApi  = (id)    => axiosInstance.get(`/api/companies/${id}`)
export const addCompanyApi      = (data)  => axiosInstance.post('/api/admin/company', data)
export const updateCompanyApi   = (id, data) => axiosInstance.put(`/api/admin/company/${id}`, data)
export const deleteCompanyApi   = (id)    => axiosInstance.delete(`/api/admin/company/${id}`)
