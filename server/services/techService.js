const fetchTechData = async () => {
  try {

    const response = await fetch(
      "https://dev.to/api/articles?per_page=10"
    )

    if(!response.ok){
      throw new Error("Failed to fetch")
    }

    const data=await response.json()

    const formatted=data.map((item)=>({

      id:item.id,

      title:item.title,

      description:
      item.description ||
      "No description available",

      category:
      item.tag_list?.[0] || "Tech",

      url: item.url,

      bg:
      item.social_image

    }))

    return formatted

  } catch(error){

    console.log(error)

    return []

  }
}

module.exports={fetchTechData}