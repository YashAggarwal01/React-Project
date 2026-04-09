import React from 'react'
import {Swiper,SwiperSlide} from "swiper/react"
import "swiper/css";
import "swiper/css/navigation";
import {Link} from "react-router-dom"
import { Navigation } from 'swiper/modules';


function CarouselProduct() {
  return (
    <div className='bg-white m-3'>
        <div className='text-2xl font-semibold p-3 text-center'>Best Sellers</div>
        <Swiper className="px-10"slidesPerView={5} spaceBetween={10} navigation={true} modules={[Navigation]} centeredSlides={false}>
           {Array.from({length:9},(_,i)=>
                <SwiperSlide key={i}>
                    <Link to={`/product/${i}`}>
                        <img src ={`../images/product_${i}_small.jpg`}/> 
                    </Link>
                </SwiperSlide>
           
            )
            }

        </Swiper>



    </div>
  )
}

export default CarouselProduct
