import { Router } from 'express'
import { HealthController } from '../controllers/HealthController'
import { AuthController } from '../controllers/AuthController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { BrechoController } from '../controllers/BrechoController'
import { PecaController } from '../controllers/PecaController'
import { uploadMiddleware } from '../middlewares/uploadMiddleware'

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
routes.put('/pecas/:id', authMiddleware, pecaController.update.bind(pecaController))
routes.delete('/pecas/:id', authMiddleware, pecaController.delete.bind(pecaController))
routes.get('/pecas', pecaController.list.bind(pecaController))

// Rota genérica de Upload
routes.post('/upload', authMiddleware, uploadMiddleware.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' })
  }
  // Retorna a URL pública
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  res.status(200).json({ url })
})

export { routes }
