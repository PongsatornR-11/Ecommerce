import React from 'react'
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import useEcomStore from '../../store/ecom-store';
import { formatPrice } from '../../utils/number';
import { motion, AnimatePresence } from 'framer-motion';

const CartCard = () => {
    const actionUpdateQuantity = useEcomStore((state) => state.actionUpdateQuantity)
    const actionRemoveProductOncart = useEcomStore((state) => state.actionRemoveProductOncart)
    const getTotalPrice = useEcomStore((state) => state.getTotalPrice)
    const carts = useEcomStore((state) => state.carts)

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-50 flex-none">
                <ShoppingBag size={18} className="text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Cart Summary</h2>
            </div>

            {/* Scrollable Items list */}
            <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-3">
                <AnimatePresence initial={false}>
                    {carts.map((item, index) => (
                        <motion.div 
                            key={item.id || index}
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                        >
                            {/* Product Image */}
                            <div className="w-14 h-14 flex-none rounded-lg overflow-hidden bg-white border border-slate-100">
                                {item.images && item.images.length > 0 ? (
                                    <img 
                                        src={item.images[0].url} 
                                        alt={item.title}
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-[10px]">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {/* Details & Actions */}
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                <div className="flex justify-between items-start gap-1">
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-slate-800 truncate" title={item.title}>
                                            {item.title}
                                        </p>
                                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                            {item.description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => actionRemoveProductOncart(item.id)}
                                        className="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition-colors flex-none"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mt-2.5">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                                        <button
                                            onClick={() => actionUpdateQuantity(item.id, item.count - 1)}
                                            className="px-2 py-1 text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                                        >
                                            <Minus size={10} />
                                        </button>
                                        <span className="px-2 text-xs font-medium text-slate-700">{item.count}</span>
                                        <button
                                            onClick={() => actionUpdateQuantity(item.id, item.count + 1)}
                                            className="px-2 py-1 text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                                        >
                                            <Plus size={10} />
                                        </button>
                                    </div>

                                    {/* Price */}
                                    <span className="text-xs font-bold text-indigo-600">
                                        {formatPrice(item.price * item.count)} <span className="text-[9px] font-medium text-slate-400">THB</span>
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {carts.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                        <p className="text-xs font-medium">Your cart is empty</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Add items from the store to checkout</p>
                    </div>
                )}
            </div>

            {/* Footer / Total & Checkout */}
            <div className="border-t border-slate-100 pt-4 mt-2 space-y-4 flex-none">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Subtotal</span>
                    <span className="text-base font-extrabold text-slate-900">
                        {formatPrice(getTotalPrice())} <span className="text-xs font-medium text-slate-500">THB</span>
                    </span>
                </div>

                {carts.length > 0 ? (
                    <Link to='/cart' className="block w-full">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:shadow-lg hover:shadow-indigo-500/20 text-white font-semibold text-xs tracking-wider transition-all flex items-center justify-center gap-2"
                        >
                            <span>Proceed to Checkout</span>
                        </motion.button>
                    </Link>
                ) : (
                    <button 
                        disabled 
                        className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 font-semibold text-xs tracking-wider cursor-not-allowed flex items-center justify-center"
                    >
                        <span>Proceed to Checkout</span>
                    </button>
                )}
            </div>
        </div>
    )
}

export default CartCard;