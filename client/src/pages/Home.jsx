// rafce

import React from "react";
import ContentCarousel from "../components/home/ContentCarousel";
import ProductCarousel from "../components/home/ProductCarousel";
import BestSellerProduct from "../components/home/BestSellerProduct";

const Home = () => {

  return (
    <div>
      <ContentCarousel />

      <BestSellerProduct />
      <ProductCarousel />
    </div>
  );
};

export default Home;
