import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6"
import {IoMdClose} from 'react-icons/io'

const SearchBar=({value,onChange,handleSearch,onClearSearch,userInfo})=>{
    if (!userInfo ) {
        return null;
    }
    return (
        <div className="w-28 h-8 sm:w-80 sm:h-10 flex items-center px-4 bg-slate-900 rounded-lg">
            <input 
                type="text"
                placeholder="Search"
                className=" text-xs sm:text-lg w-full font-semibold text-base bg-transparent py-{12px} outline-none"
                value={value}
                onChange={onChange}    
            />

            { value && (<IoMdClose 
                className="text-xl text-slate-500 cursor-pointer hover:text-white mr-3" 
                onClick={onClearSearch}
            ></IoMdClose>)}

            <FaMagnifyingGlass 
                className="text-slate-400 cursor-pointer hover:text-white"
                onClick={handleSearch}
            ></FaMagnifyingGlass>
        </div>
    )
}

export default SearchBar