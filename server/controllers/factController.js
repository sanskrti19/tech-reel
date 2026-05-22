const {fetchTechData}=require("../services/techService")

const getFacts=async(req,res)=>{

const data=await fetchTechData()

res.json(data)

}

module.exports={getFacts}