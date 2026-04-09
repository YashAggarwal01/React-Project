import { StarIcon } from '@heroicons/react/24/outline';
import React from 'react'

function ProductRatings(props) {
  const starNumber = props.avgRating;
  const ratingNumber = props.ratings;
  console.log(props.ratings)
  console.log(props.avgRating)
  
  
    return (
    <div className='flex'>
        
        {Array.from({length: starNumber},(_,i)=> <StarIcon key={i} className='stroke-[#F1B61F] fill-[#F1B61F] h-[20px]'/>)}
        {Array.from({length: 5-starNumber},(_,i)=> <StarIcon key={i} className='stroke-[#F1B61F] h-[20px]'/>)}
        <span className='ml-3 text-blue-500'> {ratingNumber} ratings</span>
    </div>
  )
}

export default ProductRatings
