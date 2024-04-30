import React,{useEffect, useState} from 'react';
import ProfileInfo from '../Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

const Navbar =({ userInfo, onSearchNote })=>{
    const [searchQuery,setSearchQuery]=useState("");

    const navigate=useNavigate();
    const onLogout=()=>{
        localStorage.clear()
        navigate("/login");
    }
    const handleSearch = () => {
        if (userInfo ) {
            onSearchNote(searchQuery);
        }
    };
    
    const onClearSearch = async () => {
        setSearchQuery("");
        onSearchNote("") // Reset the search query
    };
    
    useEffect(() => {
        handleSearch();
    }, [searchQuery]);

    return (
        <div className="h-16 bg-black text-white flex items-center justify-between px-6 py-2 drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
            <h2 className='text-2xl ml-1 sm:text-3xl font-bold text-white sm:ml-5 sm:py-2 '> Notes </h2>
            <SearchBar 
                userInfo={userInfo}
                value={searchQuery} 
                onChange={({target})=>{
                    setSearchQuery(target.value)
                }}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
            ></SearchBar>
            <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
        </div>

    )
}

export default Navbar