// rafce

import React, { useEffect } from "react";
import ContentCarousel from "../components/home/ContentCarousel";
import ProductCarousel from "../components/home/ProductCarousel";

const Home = () => {

  return (
    <div>
      <ContentCarousel />
      <ProductCarousel />
    </div>
  );
};

export default Home;
