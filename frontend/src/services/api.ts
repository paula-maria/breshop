import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api',
  withCredentials: true, // Garante que o navegador vai enviar e salvar os cookies HttpOnly
})
