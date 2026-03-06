/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Avatar from "../ui/avatar/Avatar";

interface ConversationSidebarProps {
  loading: boolean;
  conversations: any[];
  selectedConversation: any;
  onSelectConversation: (conv: any) => void;
  onlineUsers: Set<string>;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  loading,
  conversations,
  selectedConversation,
  onSelectConversation,
  onlineUsers,
}) => {
  return (
    <div className="w-full md:w-[350px] lg:w-[400px] border-r border-gray-200 flex flex-col bg-gray-50/50 shrink-0">
      <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {loading && (
          <div className="p-8 flex flex-col items-center justify-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mb-4"></div>
            <p className="text-sm">Loading conversations...</p>
          </div>
        )}
        {!loading && conversations.length === 0 && (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No active connections</p>
            <p className="text-sm text-gray-400 mt-1">
              Users will appear here when they send a message.
            </p>
          </div>
        )}

        {conversations.map((conv) => (
          <div
            key={conv.conversationId}
            onClick={() => onSelectConversation(conv)}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-gray-100 ${selectedConversation?.conversationId === conv.conversationId
              ? "bg-brand-50/50 border-l-4 border-l-brand-500"
              : "border-l-4 border-l-transparent"
              }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar
                  src={
                    conv.user?.profilePic?.startsWith("http")
                      ? conv.user.profilePic
                      : `https://ui-avatars.com/api/?name=${conv.user?.firstName || "U"}+${conv.user?.lastName || ""
                      }&background=random`
                  }
                  alt={conv.user?.firstName}
                  size="medium"
                />

                {conv.user?._id && onlineUsers.has(conv.user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-semibold text-gray-900 truncate pr-2">
                    {conv.user?.firstName} {conv.user?.lastName}
                  </h4>
                  {conv.lastMessage?.createdAt && (
                    <span className="text-[10px] text-gray-400 shrink-0 tabular-nums">
                      {new Date(conv.lastMessage.createdAt).toLocaleDateString(
                        [],
                        {
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <p
                    className={`text-xs truncate ${conv.lastMessage?.seenBy?.length === 0
                      ? "font-semibold text-gray-800"
                      : "text-gray-500"
                      }`}
                  >
                    {conv.lastMessage?.sender?.senderModel === "Admin" ? (
                      <span className="text-gray-400 mr-1">You:</span>
                    ) : null}
                    {conv.lastMessage?.content ||
                      (conv.lastMessage?.media?.length > 0
                        ? "📷 Photo/Video"
                        : "Started conversation")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
