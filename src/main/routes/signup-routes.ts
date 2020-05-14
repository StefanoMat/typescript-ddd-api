import { Router } from 'express'
import {} from '../factories/signup'

export default (router: Router): void => {
  router.post('/signup', (req, res) => {
    res.json({ ok: 'ok' })
  })
}
