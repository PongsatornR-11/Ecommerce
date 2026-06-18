import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useEcomStore from '../../store/ecom-store';
import { 
  Laptop, 
  Monitor, 
  Gamepad2, 
  Cpu, 
  Keyboard, 
  HardDrive, 
  ShoppingBag, 
  Mouse, 
  ArrowRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

const CategoryGrid = () => {
  const navigate = useNavigate();
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);

  useEffect(() => {
    getCategory();
  }, []);

  const getCategoryIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('laptop')) return <Laptop size={26} className="text-indigo-500" />;
    if (lower.includes('desktop') || lower.includes('monitor')) return <Monitor size={26} className="text-sky-500" />;
    if (lower.includes('game') || lower.includes('console')) return <Gamepad2 size={26} className="text-rose-500" />;
    if (lower.includes('keyboard')) return <Keyboard size={26} className="text-emerald-500" />;
    if (lower.includes('mouse')) return <Mouse size={26} className="text-amber-500" />;
    if (lower.includes('storage') || lower.includes('hard') || lower.includes('ssd')) return <HardDrive size={26} className="text-violet-500" />;
    if (lower.includes('cpu') || lower.includes('accessory') || lower.includes('accessories')) return <Cpu size={26} className="text-pink-500" />;
    return <ShoppingBag size={26} className="text-teal-500" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-650 dark:text-indigo-400 mb-1">Browse Collections</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Shop by Category</h2>
        <div className="w-12 h-1 bg-indigo-600 rounded-full mt-3"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pt-2"
      >
        {categories.map((category) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => navigate(`/shop?category=${category.id}`)}
            className="group cursor-pointer glass dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/70 p-5 rounded-2xl flex flex-col justify-between items-center text-center h-36 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/5 dark:hover:shadow-none transition-all duration-300"
          >
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20 group-hover:scale-110 transition-all duration-300">
              {getCategoryIcon(category.name)}
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {category.name}
              </h3>
              <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-indigo-500 dark:group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                <span>View</span>
                <ArrowRight size={10} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryGrid;
