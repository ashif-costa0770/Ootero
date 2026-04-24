import React from 'react'
import { Trash, Package,   } from 'lucide-react'
import { Pill } from './Pill'

const DashedH = () => (
    <div className="flex-1 min-w-[16px] border-t border-dashed border-gray-400" />
  );

  const DashedV = () => (
    <div className="w-px h-4 mx-auto border-l border-dashed border-gray-400" />
  );

export default function OrderFilter() {
    return (
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
        {/* Cancelled — top right */}
        <div className="flex justify-end -mb-6">
          <button className="flex items-center gap-1.5 px-5.5 py-1 font-medium cursor-pointer rounded-full border border-gray-300 text-sm text-gray-700 hover:border-gray-400 transition-all">
            <Trash size={16} />
            Cancelled
          </button>
        </div>
  
        {/* Main flow row */}
        <div className="flex items-center">
          {/* Order label */}
          <div className="flex items-center gap-2 mr-3 flex-shrink-0">
            <Package  size={24} className="text-gray-800" />
            <span className="text-2xl font-semibold text-gray-800">Order</span>
          </div>
  
          {/* Unpaid */}
          <Pill label="Unpaid" />
          <DashedH />
  
          {/* Awaiting Process (active) */}
          <Pill label="Awaiting Process" active count={9} />
          <DashedH />
  
          {/* Process with Hold/Issue branches */}
          <div className="flex flex-col items-center flex-shrink-0">
            <Pill label="Hold"   />
            <DashedV />
            <Pill label="Process" />
            <DashedV />
            <Pill label="Issue"   />
          </div>
  
          <DashedH />
          <Pill label="Pick & Pack" />
          <DashedH />
         
          <Pill label="Shipped" />
       
        
         
        </div>
      </div>
    );
  }