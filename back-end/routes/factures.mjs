import express from 'express'
const router = express.Router()
import * as ctrl from '../controllers/factures.mjs'
router.get('/', (req, res) => ctrl.getFactures(req, res) )
router.get('/:id', (req, res) => ctrl.getFacture(req, res))
router.delete('/:id', (req, res) => ctrl.deleteFacture(req, res))
router.patch('/:id', (req, res) => ctrl.updateFacture(req, res))
router.post('/', (req, res) => ctrl.createFactures(req, res))

export default router