import React from 'react'
import Carousel from './Carousel/Carousel';
import HomePageCard from './HomePageCard';
import CarouselCategory from './Carousel/CarouselCategory';
import CarouselProduct from './Carousel/CarouselProduct';

function HomePage() {
  return(
    <div className='bg-amazonclone-background'> 
      <div className='min-w-[1000px] max-w-[1500px] m-auto'>
        <Carousel/>
        <div className='grid grid-cols-3 xl:grid-cols-4 -mt-80'>
          <HomePageCard title={"We have a surprise for you"} image={"../images/home_grid_1.jpg"} link={"See terms and condition"}/>
          <HomePageCard title={"Watch the Rings of Power"} image={"../images/home_grid_2.jpg"} link={"Start streaming now"}/>
          <HomePageCard title={"Unlimited Streaming"} image={"../images/home_grid_3.jpg"} link={"Find out more"}/>
          <HomePageCard title={"Shop pet supplies"} image={"../images/home_grid_5.jpg"} link={"Browse Kindle Unlimited"}/>
          <HomePageCard title={"We have a surprise for you"} image={"../images/home_grid_4.jpg"} link={"See more"}/>
          <HomePageCard title={"We have a surprise for you"} image={"../images/home_grid_6.jpg"} link={"See the deals"}/>
          <HomePageCard title={"Echo Buds"} image={"../images/home_grid_7.jpg"} link={"See more"}/>
          <HomePageCard title={"Family plan 3 months Freee!!"} image={"../images/home_grid_8.jpg"} link={"Learn More"}/>
          <div className='m-3 pt-8'>
          <img className=" xl:hidden" src={"../images/banner_image_2.jpg"}/>
          </div>
        </div>
        <CarouselCategory/>
        <CarouselProduct/>
        <div className='h-[200px]m-3'>
          <img className="h-[100%] m-auto"src={"../images/banner_image.jpg"}/>
        </div>
      </div>
    </div>

  ) 
}

export default HomePage;