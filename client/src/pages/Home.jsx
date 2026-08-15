import React from "react";
import ContentCarousel from "../components/home/ContentCarousel";
import CategoryGrid from "../components/home/CategoryGrid";
import BestSellerProduct from "../components/home/BestSellerProduct";
import PromoBanner from "../components/home/PromoBanner";
import NewProduct from "../components/home/NewProduct";
import ProductCarousel from "../components/home/ProductCarousel";

const Home = () => {
  return (
    <div className="space-y-4 pb-12 bg-slate-50/50 dark:bg-slate-950/20 min-h-screen transition-colors duration-250">
      {/* Hero Carousel & Trust Badges */}
      <ContentCarousel />
      
      {/* Quick Category Navigation */}
      <CategoryGrid />
      
      {/* Best Sellers Section */}
      <BestSellerProduct />
      
      {/* Special Promotional Call to Action */}
      <PromoBanner />
      
      {/* New Arrivals Section */}
      <NewProduct />
      
      {/* Showcase / Product Carousel */}
      <ProductCarousel />
    </div>
  );
};

export default Home;
