import React from 'react'

function ProductBadge({badge}) {
    if(badge === "choice"){
        return(
            <span className='text-xs xl:text-sm text-white p-1 bg-slate-800 '>
                Amazon's
                <span className='text--orange-500'>
                    Choice
                </span>
            </span>
        )
    }
    else if(badge==="seller"){
        return(
            <span className='text-xs xl:text-sm text-white p-1 bg-orange-500 font-semibold text-center '>
                #1 Best Sellers
            </span>
        )
    }
    else if(badge==="limited"){
        return(
            <span className='text-xs xl:text-sm text-white p-1 bg-red-500 '>
                Limited Time Deal
            </span>
        )
    }
  
  
    return (
    <div>
      
    </div>
  )
}

export default ProductBadge
