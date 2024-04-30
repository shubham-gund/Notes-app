import React from 'react';
import { getInitials } from '../../utils/helper';
const ProfileInfo = ({ userInfo, onLogout }) => {
    // Add a null check for userInfo to avoid accessing properties on a null object
    if (!userInfo ) {
        return null;
    }

    // Destructure userInfo to simplify the code
    const { fullName } = userInfo;

    return (
        <div className='flex items-center gap-1 sm:gap-3'>
            <div className='w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-white'>{getInitials(fullName)}</div>
            <div>
                <p className='text-xs sm:text-sm sm:font-medium'>{fullName.split(" ")[0]}</p>
                <button className='text-xs sm:text-sm text-red-500 underline' onClick={onLogout}>Logout</button>
            </div>
        </div>
    );
};



export default ProfileInfo