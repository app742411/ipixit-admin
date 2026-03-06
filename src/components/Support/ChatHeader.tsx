import React from "react";
import Avatar from "../ui/avatar/Avatar";

interface ChatHeaderProps {
  selectedConversation: any;
  typingStatus: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedConversation,
  typingStatus,
}) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white z-10 shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        <Avatar
          src={
            selectedConversation.user?.profilePic?.startsWith("http")
              ? selectedConversation.user.profilePic
              : `https://ui-avatars.com/api/?name=${selectedConversation.user?.firstName || "U"}+${
                  selectedConversation.user?.lastName || ""
                }&background=random`
          }
          alt={selectedConversation.user?.firstName}
          size="medium"
        />
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-none mb-1">
            {selectedConversation.user?.firstName}{" "}
            {selectedConversation.user?.lastName}
          </h3>
          <p className="text-xs font-medium text-brand-600 transition-opacity">
            {typingStatus ? (
              typingStatus
            ) : (
              <span className="text-gray-500 font-normal">
                {selectedConversation.user?.email}
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
