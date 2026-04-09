import React, { use } from "react";
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { INR_CURRENCY } from "../utils/constsnts";
import { ProductDetails } from './'
import  removeFromCart  from '../redux/cartSlice'


function Checkout(){
  const products = useSelector((state)=> state.cart.products)
  const dispatch = useDispatch()
  const itmesNumber = useSelector((state)=> state.cart.productsNumber)
  const subtotal = useSelector((state)=> state.cart.products.reduce(
    (subtotal,product)=> subtotal+(product.price * product.quantity),0
  ))
  return(
    <div className="h-screen bg-amazonclone-background">
      <div className="min-w-[1000px] max-w-[1500px] m-auto pt-8">
        <div className="grid grid-cols-8  gap-10">
          {/*Products*/}
          <div className="col-span-6 bg-white">
            <div className="text-2xl xl:text-3xl m-4">Shopping Cart</div>
            {
              products.map(product => {
                return(
                  <div key={product.id}>
                      <div className="grid grid-cols-12 divide-y divide-gray-400 mr-4">
                        <div className="col-span-10 grid grid-cols-8 divide-y divide-gray-400">
                          <div className="col-span-2">
                            <Link to={`/product/${product.id}`}>
                              <img className="p-4 m-auto"src={product.image_small}/>
                            
                            </Link>
                          </div>
                          <div className="col-span-6">
                            <div className="font-medium text-black mt-2">
                              <Link to={`/product/${product.id}`}>
                                <ProductDetails product={product} ratings={false}/>
                              </Link>
                            </div>
                            <div>
                              <button className="text-small xl:text-base font-semibold rounded text-blue-500 mt-2 mb-1" onClick={()=> dispatchEvent(removeFromCart(product.id))}>Delete</button>
                            </div>
                            <div className="grid grid-cols-3 w-20 text-center">
                              <div className="text-xl xl:text-2xl bg-gray-400 rounded">-</div>
                              <div className="text-lg xl:text-2xl bg-gray-200">{product.quantity}</div>
                              <div className="text-xl xl:text-2xl bg-gray-400 rounded">+</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-lg xl:text-xl mt-2 mr-4 font-semibold">
                            {INR_CURRENCY.format(product.price)}
                          </div>
                        </div>
                      </div>
                  </div>
                )
              })
            }
            <div className="text-lg xl:text-xl text-right mb-4 mr-4">
              Subtotal({itmesNumber} items): <span className="font-semibold">0</span>
            </div>
          </div>
          {/*Checkout*/}
          <div className="col-span-2 bg-white rounded h=[250px] p-7">
              <div className="text-xs xl:text-sm text-green-800 ">
                Your Order Qualifies for <span> FREE DELIVERY</span>
                .Delivery Details
              </div>
              <div className="text-base xl:text-lg text-right mb-4 mr-4">
              Subtotal({itmesNumber} items): <span className="font-semibold">0</span>
              <button className="btn">Proceed to Checkout</button>
              </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Checkout