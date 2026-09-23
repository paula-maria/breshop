import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333/api',
  withCredentials: true, // Garante que o navegador vai enviar e salvar os cookies HttpOnly
})
