import React, { useCallback, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axiosInstance from "../../utils/axiosinstance"
import moment from "moment";
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';

const Home =()=>{
    const [allNotes,setAllNotes]=useState([])
    const [openAddEditModel,setOpenAddEditModel]=useState({
        isShown:false,
        type:"add",
        date:null,
    });

    const [showToastMag,setShowToastMag]=useState({
        isShown:false,
        type:"add",
        message:"",
    })
    const [userInfo,setUserInfo] = useState(null);

    const [isSearch,setIsSearch] = useState(false);
    const navigate = useNavigate();

    const showToastMessage=(message,type)=>{
        setShowToastMag({
            isShown:true,
            message,
            type
        })
    }
    const handleCloseToast=()=>{
        setShowToastMag({
            isShown:false,
            message:""
        })
    }

    const handleEdit = useCallback((note)=>{
        setOpenAddEditModel({isShown:true,data:note,type:"edit"});
    })

    //Get user info
    const getUserInfo = async ()=>{
        try {
            const response = await axiosInstance.get("/get-user");
            if(response.data && response.data.user){
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if(error.response.status === 401){
                localStorage.clear();
                navigate("/login");
            }
        }
    };

    const getAllNotes = async ()=>{
        try {
            const response = await axiosInstance.get("/get-all-notes");
            if(response.data && response.data.notes){
                setAllNotes(response.data.notes);
            }
        } catch (error) {
            console.log("An Unexpected error occured");
        }
    }

    //Delete note
    const deleteNote = useCallback(async (data)=>{
        const noteId = data._id;
        try {
        const response = await axiosInstance.delete("delete-note/"+noteId);
        if(response.data && !response.data.error){
            showToastMessage("Note Deleted Succesfully",'delete')
            getAllNotes()
        }
        } catch (error) {
        if(error.response && error.response.data && error.response.data.message){
            console.log("An Unexpected error occured");
        }
        }
    })
  
    //search Note
    const onSearchNote = async(query)=>{
        try {
            const response = await axiosInstance.get("/search-notes",{
                params:{query},
            });
            if(response.data && response.data.notes){
                setIsSearch(true);
                setAllNotes(response.data.notes);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updateIsPinned = async (noteData)=>{
        const noteId = noteData._id;
        try {
            const response = await axiosInstance.put("/update-note-pinned/"+noteId,{
              "isPinned": !noteData.isPinned
            })
            if(response.data && response.data.note){
              showToastMessage("Note Updated Succesfully")
              getAllNotes()
            }
          } catch (error) {
            console.log(error);
          } 
    }
    useEffect(()=>{
        getAllNotes()
        getUserInfo();
        return ()=>{};
    },[]);

    return (
        <>
            <Navbar userInfo={userInfo} onSearchNote={onSearchNote} />

            <div className='container mx-auto text-white mt-50'>
                {allNotes.length > 0 ? <div className='grid sm:grid-cols-3 gap-5 sm:gap-10 mt-10 mx-10'>
                {allNotes.map((item, index) => (
                    <NoteCard 
                        key={item._id}
                        title={item.title} 
                        date={moment(item.createdOn).format('Do MMM YYYY')} // Fixed format typo
                        content={item.content}
                        isPinned={item.isPinned}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => deleteNote(item)}
                        onPinNote={() => updateIsPinned(item)}
                    />
                ))}
                </div> : <div className='flex items-center justify-center'><EmptyCard /></div>}
            </div>
            <button className='w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-blue-600 hover:text-white absolute right-10  bottom-10' onClick={()=>{
                setOpenAddEditModel({isShown:true , type:"add",date:null});
            }}>
                <MdAdd className='text-[32px]'> </MdAdd>
            </button>

            <Modal 
                isOpen={openAddEditModel.isShown}
                onRequestClose={()=>{}}
                ariaHideApp={false} // Opt-out
                style={{
                    overlay:{
                        backgroundColor:'rgba(0,0,0,0.8)'
                    },
                }}
                contentLabel=""
                className='flex items-center justify-center rounded-md mx-auto mt-15 p-5 '
            >
            <AddEditNotes
                type={openAddEditModel.type}
                noteData={openAddEditModel.data}
                onClose={()=>{
                    setOpenAddEditModel({isShown:false,type:"add",date:null});
                }}
                getAllNotes={getAllNotes}
                showToastMessage={showToastMessage}
            ></AddEditNotes>
            </Modal>

            <Toast
                isShown={showToastMag.isShown}
                message={showToastMag.message}
                type={showToastMag.type}
                onClose={handleCloseToast}
            />
        </>
    )
}

export default Home