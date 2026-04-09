import React from 'react'
import {useParams , Link} from "react-router-dom"
import { useState,useEffect } from 'react';
import CallApi from "../utils/CallApi"
import ProductDetails from './ProductDetails';
import { INR_CURRENCY } from '../utils/constsnts';
import { addToCart } from '../redux/cartSlice'
import { useDispatch } from 'react-redux'



function ProductPage() {
  const {id} = useParams();
  const [product,setproduct] = useState(null);
  const [quantity, setQuantity] = useState(1)
  const dispatch = useDispatch();
  const getProduct = () => {
      CallApi(`data/products.json`)
      .then((productResults)=> {
        setproduct(productResults[Number(id)]);
      });
  }
  const addQuantityToProduct = () => {
    setproduct(product.uantity = quantity)
  }
  
  
  useEffect(()=>{
    getProduct();

  },[id])
  
  if(!product?.title) return <h1>Loading Product....</h1>

  return ( product &&
    <div className='h-screen bg-amazonclone-background'>
      <div className='min-w-[1000px] max-w-[1500px] m-auto p-4'>
        <div className='grid grid-cols-10 gap-2 bg-orange-500'>
          {/*Left */}
          <div className='col-span-2 p-8 rounded bg-white m-auto'>
            <img src={`${product.image}`}/>
          </div>
          {/*Middle */}
          <div className='col-span-5 p-4 rounded bg-white divide-y divide-gray-400'>
            <div>
              <ProductDetails product={product} ratings={true}/>
            </div>
            <div className='text-base xl:text-lg mt-3'>
                {product.description}
            </div>
          </div>
          {/*Right */}
          <div className='col-span-3 p-4 bg-white'>
              <div className='text-xl xl:text-2xl font-semibold text-red-500'>{INR_CURRENCY.format(product.price)}</div>
              <div className='text-base xl:text-lg font-semibold text-gray-500'>MRP:
                <span className='line-through'>
                    {INR_CURRENCY.format(product.oldPrice)}
                </span>
              </div>
              <div className='text-sm xl:text-base font-semibold mt-3'>FREE Returns</div>
              <div className='text-sm xl:text-base mt-1'>FREE Delivery</div>
              <div className='text-base xl:text-lg font-semibold mt-1'>In Stock</div>
              <div className='text-base xl:text-lg font-semibold'>Quantity:
                <select  value={quantity} onChange={(e)=>{setQuantity(e.target.value)}} className='p-2 bg-white border rounded-md focus:border-indigo-600'>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </select>
                <Link to={"/checkout"}>
                    <button onClick={() => dispatch(addToCart({ ...product, quantity }))} className='btn'>
                    Add To Cart
                    </button>
                </Link>
              </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default ProductPage
