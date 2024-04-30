import React, { useState } from "react";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({ title, date, content, isPinned, onEdit, onDelete, onPinNote }) => {
  const [showFullContent, setShowFullContent] = useState(false);

  const handleReadMore = () => {
    setShowFullContent(!showFullContent);
  };

  return (
    <div className="border-black rounded-md p-4 bg-slate-900 sm:hover:shadow-[0_10px_30px_rgba(255,255,255,0.14)] transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div className="mb-2">
          <h6 className="text-xl font-medium mb-1">{title}</h6>
          <span className="text-xs text-slate-200">{date}</span>
        </div>
        <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`} onClick={onPinNote} />
      </div>
      <p className="text-sm text-slate-100">
        {showFullContent ? content : (content.length > 150 ? content?.slice(0, 150) + "...." : content)}
        {content.length > 150 && (
          <span className="text-blue-500 cursor-pointer" onClick={handleReadMore}>
            {showFullContent ? "(read less)" : "(read more)"}
          </span>
        )}
      </p>
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-200"></div>
        <div className="flex items-center gap-2">
          <MdCreate className="icon-btn hover:text-green-600" onClick={onEdit} />
          <MdDelete className="icon-btn hover:text-red-500" onClick={onDelete} />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
