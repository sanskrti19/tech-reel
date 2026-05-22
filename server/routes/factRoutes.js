const router=require("express").Router()
const {getFacts}=require("../controllers/factController")

router.get("/",getFacts)

module.exports=router