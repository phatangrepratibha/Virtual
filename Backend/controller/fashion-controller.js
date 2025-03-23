import Fashion from "../models/fashion-model.js";

export const fashion = async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    const filter = {};
    
    if (category) filter.category = category.toLowerCase();
    if (subcategory) filter.subcategory = subcategory.toLowerCase();

    const products = await Fashion.find(filter);
    res.status(200).json(products);
    
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};  


export const getFashionById=async(req,res)=>{
    try {
        const fashion=await Fashion.findById(req.params.id);
        if(!fashion)
        {
            return res.status(404).json({message:"Product not found"});
        }
        res.status(200).json(fashion);
    } catch (error) {
        console.error(error);
      res.status(500).json({ error: "Server error" });
    }
}



export default {fashion,getFashionById};