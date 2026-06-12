import React from 'react'
import { ShoppingCart } from 'lucide-react';
import useEcomStore from '../../store/ecom-store';
import { formatPrice } from '../../utils/number';
import toastifyUtils from '../../utils/toastifyUtils';
import { motion } from "motion/react"

const ProductCard = ({ product }) => {
    const actionAddCart = useEcomStore((state) => state.actionAddCart)
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[220px] h-[340px] flex flex-col rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all overflow-hidden"
        >
            {/* Image Container */}
            <div className="h-36 overflow-hidden relative bg-slate-50">
                {product.images && product.images.length > 0 ? (
                    <img 
                        src={product.images[0].url} 
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-medium text-xs">
                        No Image
                    </div>
                )}
                
                {/* Category Badge overlay */}
                {product.category && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-100 text-[10px] font-bold text-indigo-600 shadow-sm">
                        {product.category.name}
                    </span>
                )}
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-slate-800 line-clamp-1 hover:text-indigo-600 cursor-pointer" title={product.title}>
                        {product.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-normal">
                        {product.description}
                    </p>
                </div>

                {/* Footer Section */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Price</span>
                        <span className="text-sm font-extrabold text-slate-900">{formatPrice(product.price)} <span className="text-[10px] font-medium text-slate-500">THB</span></span>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            toastifyUtils.success(`${product.title} added to your cart!`)
                            actionAddCart(product)
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-2.5 shadow-sm shadow-indigo-100 transition-colors flex items-center justify-center"
                    >
                        <ShoppingCart size={16} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default ProductCard;