// rafce

import React from "react";
import ContentCarousel from "../components/home/ContentCarousel";
import ProductCarousel from "../components/home/ProductCarousel";
import BestSellerProduct from "../components/home/BestSellerProduct";
import NewProduct from "../components/home/NewProduct";

const Home = () => {

  return (
    <div>
      <ContentCarousel />
      <BestSellerProduct />
      <NewProduct />
      <ProductCarousel />
    </div>
  );
};

export default Home;
