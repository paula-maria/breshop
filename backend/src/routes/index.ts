import { Router } from 'express'
import { HealthController } from '../controllers/HealthController'
import { AuthController } from '../controllers/AuthController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { BrechoController } from '../controllers/BrechoController'
import { PecaController } from '../controllers/PecaController'

const routes = Router()
const healthController = new HealthController()
const authController = new AuthController()
const brechoController = new BrechoController()
const pecaController = new PecaController()

routes.get('/health', healthController.check.bind(healthController))

// Rotas de Autenticação
routes.post('/auth/register', authController.register.bind(authController))
routes.post('/auth/login', authController.login.bind(authController))
routes.post('/auth/logout', authController.logout.bind(authController))

// Rotas protegida do Usuário
routes.get('/auth/me', authMiddleware, authController.me.bind(authController))

// Rotas de Brechó
routes.post('/brechos', authMiddleware, brechoController.create.bind(brechoController))
routes.get('/brechos/minha-loja', authMiddleware, brechoController.myStore.bind(brechoController))
routes.get('/brechos', brechoController.list.bind(brechoController))
routes.get('/brechos/:id', brechoController.getById.bind(brechoController))

// Rotas de Peças
routes.post('/pecas', authMiddleware, pecaController.create.bind(pecaController))
routes.get('/pecas', pecaController.list.bind(pecaController))

export { routes }
