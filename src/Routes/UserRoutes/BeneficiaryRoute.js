const express = require('express')
const router = express.Router()

const { getUserBeneficiaries, addBeneficiary, updateBeneficiary, deleteBeneficiary } = require('../../Controllers/UserControllers/BeneficiaryController.js')


router.get('/getUserBeneficiaries/:userId', getUserBeneficiaries)

 
router.post('/addBeneficiary', addBeneficiary)


router.put('/updateBeneficiary/:data/:type/:id/:userId', updateBeneficiary )


router.delete('/deleteBeneficiary/:id/:type/:userId', deleteBeneficiary)





module.exports = router