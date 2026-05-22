export default function ActionButtons({fact}){

return(

<div className="flex gap-4 mt-8">

<a
href={fact.readMore}
target="_blank"
className="bg-white  text-black  px-5 py-3 rounded-full " >

Read Docs

</a>

<button
className="
bg-white/20
px-5
py-3
rounded-full
"
>

Save

</button>

</div>

)

}