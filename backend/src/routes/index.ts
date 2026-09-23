import { Router } from 'express'
import { HealthController } from '../controllers/HealthController'

const routes = Router()
const healthController = new HealthController()

routes.get('/health', healthController.check.bind(healthController))

export { routes }
