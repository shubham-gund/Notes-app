import React,{useState} from "react";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosinstance";

const AddEditNotes=({noteData,type,getAllNotes,onClose,showToastMessage})=>{
  console.log(noteData?.title)
  const [title,setTitle] = useState(noteData?.title || "");
  const [content,setContent] = useState(noteData?.content || "");
  const [error,setError] = useState(null);


  const addNewNote = async ()=>{
    try {
      const response = await axiosInstance.post("add-note",{
        title,
        content
      })
      if(response.data && response.data.note){
        showToastMessage("Note Added Succesfully")
        getAllNotes()
        onClose()
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      }
    }
  }
  const editNote = async ()=>{
    const noteId = noteData._id
    try {
      const response = await axiosInstance.put("edit-note/"+noteId,{
        title,
        content
      })
      if(response.data && response.data.note){
        showToastMessage("Note Updated Succesfully")
        getAllNotes()
        onClose()
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      }
    }
  }


  const handleAddNote = () => {
    if(!title){
      setError("Please Enter Title");
      return;
    }
    if(!content){
      setError("Please Enter Content");
      return;
    }
    setError("");

    if(type==='edit'){
      editNote()
    }else{
      addNewNote()
    }
  }

  return (
  <>
  <div className="w-11/12 sm:w-5/12 mx-5 sm:mx-20 mt-20 sm:mt-20 text-white bg-black drop-shadow-[0_2px_20px_rgba(255,255,255,0.14)] ">
    <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-0 -right-0 hover:bg-slate-500 "  onClick={onClose}>
      <MdClose className="text-xl text-slate-200 "> </MdClose>
    </button>
    <div className="flex flex-col gap-2 bg-black">
      <label className="input-label pt-4">TITLE</label>
      <input 
        type="text" 
        className="text-xl px-7 py-3 mx-4 bg-slate-950 text-slate-100 outline-none"
        placeholder="Go To Gym AT 5"
        value={title}
        onChange={(({target})=>setTitle(target.value))}
      />
    </div>
    <div className="flex flex-col gap-2 mt-3">
    <label className="input-label">CONTENT</label>
      <textarea 
        type="text" 
        className="test-sm bg-slate-950 px-7 py-3 rounded text-slate-100 outline-none mx-4 "
        placeholder="Content"
        rows={10}
        value={content}
        onChange={(({target})=>setContent(target.value))}
      />
    </div>

    {error && <p className="text-red-500 text-xs pt-4 mx-5">{error}</p>}

    <div className="flex items-center justify-center">
    <button className="btn-primary font-medium m-7 p-3 w-80" onClick={handleAddNote}>
      {type === 'edit' ? 'UPDATE' : 'ADD'}
    </button>
    </div>
  </div>
  </>)
}

export default AddEditNotes