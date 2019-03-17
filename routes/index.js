const { Router } = require('express')
const router = Router()
const isEmpty = require('../utils/isEmpty')
const migrationDataCtrl = require('../controllers/migrationData')

router.get('/', handleRoot)

async function handleRoot(req, res) {
  let response = null
  if (!isEmpty(req.query)) {
    response = await migrationDataCtrl.getByQuery(req.query)
  }
  res.send(response)
}

module.exports = router
