const express = require('express')
const router = express.Router()

const { getUserBeneficiaries, deleteBeneficiary } = require('../../Controllers/UserControllers/BeneficiaryController.js')


router.get('/getUserBeneficiaries/:userId', getUserBeneficiaries)


router.delete('/deleteBeneficiary/:id/:type/:userId', deleteBeneficiary)





module.exports = router