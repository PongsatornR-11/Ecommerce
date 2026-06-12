import React, { useEffect, useState } from 'react'
import useEcomStore from '../../store/ecom-store'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { formatPrice } from '../../utils/number';
import { Search, SlidersHorizontal, Tag, CircleDollarSign } from 'lucide-react';

const SearchCard = () => {
    const getProduct = useEcomStore((state) => state.getProduct)
    const actionSearchFilter = useEcomStore((state) => state.actionSearchFilter)
    const getCategory = useEcomStore((state) => state.getCategory)
    const categories = useEcomStore((state) => state.categories)

    const [text, setText] = useState('')
    const [categoryChecked, setCategoryChecked] = useState([])
    const [price, setPrice] = useState([0, 100000])
    const [ok, setOk] = useState(false)

    useEffect(() => {
        setText('')
        setCategoryChecked([])
        setPrice([0, 100000])
        getProduct()
        getCategory()
    }, [])

    // Step 1: Search by Text with Debounce
    useEffect(() => {
        const delay = setTimeout(() => {
            if (text) {
                actionSearchFilter({ query: text })
            } else {
                getProduct()
            }
        }, 300);
        return () => clearTimeout(delay)
    }, [text])

    // Step 2: Search by Category
    const handleCheckbox = (e) => {
        const inCheck = e.target.value
        const inState = [...categoryChecked]
        const findCheck = inState.indexOf(inCheck)
        if (findCheck === -1) {
            inState.push(inCheck)
        } else {
            inState.splice(findCheck, 1)
        }
        setCategoryChecked(inState)
        if (inState.length > 0) {
            actionSearchFilter({ category: inState })
        } else {
            getProduct()
        }
    }

    // Step 3: Search by Price
    useEffect(() => {
        actionSearchFilter({ price: price })
    }, [ok])

    const handlePrice = (value) => {
        setPrice(value)
        const delay = setTimeout(() => {
            setOk(!ok)
        }, 300)
        return () => clearTimeout(delay)
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-6">
            
            {/* Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
                <SlidersHorizontal size={18} className="text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Filters</h2>
            </div>

            {/* Search by Text */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Keywords</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Search size={16} />
                    </div>
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Search by Category */}
            <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <Tag size={13} className="text-slate-400" />
                    <span>Categories</span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2.5 pr-1">
                    {categories.map((item, index) => (
                        <label className="flex items-center gap-2.5 cursor-pointer group" key={index}>
                            <input
                                type="checkbox"
                                value={item.id}
                                checked={categoryChecked.includes(String(item.id))}
                                onChange={handleCheckbox}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors">
                                {item.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Search by Price */}
            <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <CircleDollarSign size={13} className="text-slate-400" />
                    <span>Price Range</span>
                </div>
                <div className="space-y-4 px-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Min: {formatPrice(price[0])}</span>
                        <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Max: {formatPrice(price[1])}</span>
                    </div>
                    <div className="pt-2">
                        <Slider
                            range
                            min={0}
                            max={160000}
                            value={price}
                            step={100}
                            onChange={handlePrice}
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SearchCard;