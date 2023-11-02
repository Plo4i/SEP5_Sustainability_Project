const express = require('express')
const router = express.Router()
const  { 
    user_list,
    user_detail,
    user_create,
    user_update,
    user_delete
} = require('../controllers/userController.js')

router.get('/', user_list)
router.get('/:id', user_detail)
router.post('/', user_create) 
router.put('/:id', user_update) 
router.delete('/:id', user_delete)

module.exports = router
