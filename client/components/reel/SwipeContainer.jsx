"use client"

import {useEffect,useState} from "react"
import ReelCard from "./ReelCard"
import SkeletonReel from "../SkeletonReel"

export default function SwipeContainer(){

const [facts,setFacts]=useState([])
const [loading,setLoading]=useState(true)
setLoading(false)
useEffect(()=>{

const getFacts=async()=>{

try{

const response=await fetch(
"http://localhost:5000/api/facts"
)

const data=await response.json()

setFacts(data)

}catch(error){

console.log(error)

}

setLoading(false)

}

getFacts()

},[])
 
if (loading) {
  return <SkeletonReel />
}
 
return(

<div
className="
h-screen
overflow-y-scroll
snap-y
snap-mandatory
"
>

{facts.map((fact)=>(

<ReelCard
key={fact.id}
fact={fact}
/>

))}

</div>

)

}