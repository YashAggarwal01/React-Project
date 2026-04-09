import React, { useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import CallApi from '../utils/CallApi'
import { useNavigate , useSearchParams, createSearchParams } from 'react-router-dom'


function Search() {
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [category,setcategory] = useState("All")

  const onHandleSubmit = (e) => {
    e.preventDefault();
    navigate({
      pathname:"search",
      search:`${
        createSearchParams({
          category: `${category}`,
          searchTerm: `${searchTerm}`
        })
      }`
    })
    setSearchTerm("");
    setcategory("All");

  }
  
  const getSuggestions = () => {
    CallApi(`data/suggestions.json`)
      .then((suggestionResults) => {
        setSuggestion(suggestionResults)
      })
  };

  useEffect(() => {
    getSuggestions();
  }, [])

  return (
    <header className="w-full">
      <div className="flex items-center h-10">

        {/* Select */}
        <select 
        onChange={(e)=>setcategory(e.target.value)}
        className="p-2 bg-gray-300 text-black border text-xs xl:text-sm h-full rounded-l-md">
          <option>All</option>
          <option>Deals</option>
          <option>Computers</option>
          <option>Amazon</option>
          <option>Mobiles</option>
          <option>Home</option>
          <option>Fashion</option>
        </select>

        {/* Input + Suggestions */}
        <div className="relative flex-1 h-full">
          <input
            type="text"
            className="w-full h-full px-3 text-black outline-none"
            placeholder="Search Amazon.in"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {suggestion && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white text-black z-40 rounded-md shadow-lg border border-gray-200 max-h-72 overflow-y-auto">
              {
                suggestion
                  .filter((suggestion) => {
                    const currentSearchTerm = searchTerm.toLowerCase();
                    const title = suggestion.title?.toLowerCase();
                    return (
                      currentSearchTerm &&
                      title?.startsWith(currentSearchTerm) &&
                      title !== currentSearchTerm
                    )
                  })
                  .slice(0, 10)
                  .map((suggestion) => (
                    <div
                      key={suggestion.id}
                      onClick={()=>setSearchTerm(suggestion.title)} 
                  
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 transition duration-150 text-sm"
                    >
                      {suggestion.title}
                    </div>
                  ))
              }
            </div>
          )}
        </div>

        {/* Search Button */}
        <button 
        onClick={onHandleSubmit}
        className="w-[45px] h-full bg-yellow-400 flex items-center justify-center rounded-r-md">
          <MagnifyingGlassIcon className="h-6 w-6 text-black" />
        </button>

      </div>
    </header>
  )
}

export default Search