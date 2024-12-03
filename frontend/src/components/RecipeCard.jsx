import { useState } from "react";
import Ingredients from "../components/Ingredients";
import axios from "../helpers/axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function RecipeCard({ recipe, onDeleted }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteRecipe = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      setIsDeleting(true);
      try {
        const res = await axios.delete("/api/recipes/" + recipe._id);
        if (res.status === 200) {
          onDeleted(recipe._id);
        }
      } catch (error) {
        console.error("Failed to delete recipe:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-64">
        <motion.img
          className="w-full h-full object-cover transition-transform duration-300"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          src={import.meta.env.VITE_BACKEND_ASSET_URL + recipe.photo}
          alt={recipe.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Container */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-orange-500 hover:text-orange-600 transition-colors">
            {recipe.title}
          </h3>
          <div className="space-x-2">
            <Link
              to={`/recipes/edit/${recipe._id}`}
              className="inline-flex items-center px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </Link>
            <button
              onClick={deleteRecipe}
              disabled={isDeleting}
              className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 
                                ${
                                  isDeleting
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-red-500 hover:bg-red-600 text-white"
                                }`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-gray-700">Description</h4>
          <p className="text-gray-600 leading-relaxed">{recipe.description}</p>
        </div>

        {/* Ingredients */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-gray-700">Ingredients</h4>
          <Ingredients ingredients={recipe.ingredients} />
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Published on {formatDate(recipe.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
