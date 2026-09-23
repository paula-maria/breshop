import { Router } from 'express'
import { HealthController } from '../controllers/HealthController'
import { AuthController } from '../controllers/AuthController'
import { authMiddleware } from '../middlewares/authMiddleware'

const routes = Router()
const healthController = new HealthController()
const authController = new AuthController()

routes.get('/health', healthController.check.bind(healthController))

// Rotas de Autenticação
routes.post('/auth/register', authController.register.bind(authController))
routes.post('/auth/login', authController.login.bind(authController))
routes.post('/auth/logout', authController.logout.bind(authController))

// Rota protegida de exemplo para pegar os dados do usuário atual
routes.get('/auth/me', authMiddleware, authController.me.bind(authController))

export { routes }
