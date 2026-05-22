export default function FactContent({fact}){

return(

<>

<p className="text-2xl font-bold">
{fact.category}
</p>

<p className="opacity-80 mt-2">
{fact.description}
</p>

</>

)

}