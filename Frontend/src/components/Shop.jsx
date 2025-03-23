import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { FaCamera } from "react-icons/fa6";
import SubCategories from "./SubCategories";

export const Shop = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const [fashion, setFashion] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (subcategory) params.append("subcategory", subcategory);

        const response = await fetch(`http://localhost:3000/fashion?${params.toString()}`);
        const data = await response.json();
        setFashion(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [category, subcategory]);

  return (
    <>
      <h2 className="text-center text-3xl font-bold my-6">
        {category ? `${category}'s Fashion` : "All Fashion"}
        {subcategory && ` > ${subcategory}`}
      </h2>
      <hr className="mb-6" />

      {/* Subcategory Filter */}
      {category && <SubCategories currentCategory={category} />}

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {fashion.length > 0 ? (
            fashion.map((val) => (
              <div
                key={val._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition transform duration-300 relative"
                style={{ height: "500px" }}
              >
                <div className="absolute top-3 right-3 flex gap-2">
                  {/* Wishlist Icon */}
                  <div className="bg-gray-200 p-2 rounded-full cursor-pointer hover:bg-gray-300 transition">
                    <FaRegHeart className="text-black text-lg" />
                  </div>

                  {/* Virtual Try-On Icon */}
                  <div
                    className="bg-gray-200 p-2 rounded-full cursor-pointer hover:bg-gray-300 transition"
                    onClick={() => navigate(`/try-on?clothingImage=${encodeURIComponent(val.image)}`)}
                  >
                    <FaCamera className="text-black text-lg" />
                  </div>
                </div>

                <div 
                  className="h-92 cursor-pointer" 
                  onClick={() => navigate(`/product/${val._id}`)}
                >
                  <img src={val.image} alt={val.name} className="w-full h-full object-cover" />
                </div>

                <div className="p-4 text-center flex flex-col justify-between h-28">
                  <h5 className="text-lg font-semibold">{val.name}</h5>
                  <p className="text-gray-700 text-sm">Price: ${val.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 w-full">
              No fashion items available for this category.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;