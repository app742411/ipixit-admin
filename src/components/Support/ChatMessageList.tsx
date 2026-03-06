/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface ChatMessageListProps {
  messages: any[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  messagesEndRef,
}) => {
  const renderMessageMedia = (msg: any) => {
    if (!msg.media || msg.media.length === 0) return null;

    return (
      <div className={`flex flex-col gap-2 ${msg.content ? "mb-2" : ""}`}>
        {msg.media.map((mediaItem: any, i: number) => {
          const mediaUrl =
            typeof mediaItem === "string"
              ? mediaItem
              : mediaItem?.url ||
                mediaItem?.path ||
                mediaItem?.file ||
                mediaItem?.filename ||
                "";

          if (typeof mediaUrl !== "string" || !mediaUrl) return null;

          const isImage =
            /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(mediaUrl) ||
            (!mediaUrl.includes(".pdf") &&
              !mediaUrl.includes(".mp4") &&
              !mediaUrl.includes(".webm") &&
              !mediaUrl.includes(".mov") &&
              !mediaUrl.includes(".mkv"));

          const fullUrl = mediaUrl.startsWith("http")
            ? mediaUrl
            : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4002"}/uploads/chatMedia/${mediaUrl}`;

          if (isImage) {
            return (
              <img
                key={i}
                src={fullUrl}
                alt="Chat Media"
                className="rounded-lg max-w-[200px] max-h-[250px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(fullUrl, "_blank")}
              />
            );
          } else if (
            mediaUrl.includes(".mp4") ||
            mediaUrl.includes(".webm") ||
            mediaUrl.includes(".mov") ||
            mediaUrl.includes(".mkv")
          ) {
            return (
              <video
                key={i}
                src={fullUrl}
                controls
                className="rounded-lg max-w-[200px] max-h-[250px] bg-black/10"
              ></video>
            );
          } else {
            return (
              <a
                key={i}
                href={fullUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2 bg-black/5 rounded-lg border border-black/10 hover:bg-black/10 transition-colors"
              >
                <svg
                  className="w-6 h-6 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <span className="text-xs truncate max-w-[140px]">
                  Download File
                </span>
              </a>
            );
          }
        })}
      </div>
    );
  };

  const renderMessageTick = (msg: any) => {
    if (msg.sender?.senderModel !== "Admin") return null;

    const isSeen =
      msg.status === "seen" ||
      (msg.seenBy &&
        msg.seenBy.length > 0 &&
        msg.seenBy.some((s: any) => s.userModel === "User"));

    if (isSeen) {
      return (
        <span
          className="text-blue-500 ml-1 text-xs font-bold leading-none tracking-tighter"
          title="Read"
        >
          ✔✔
        </span>
      );
    }
    if (msg.status === "delivered") {
      return (
        <span
          className="text-gray-500 ml-1 text-xs font-bold leading-none tracking-tighter"
          title="Delivered"
        >
          ✔✔
        </span>
      );
    }
    return (
      <span
        className="text-gray-400 ml-1 text-xs font-bold leading-none"
        title="Sent"
      >
        ✔
      </span>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 z-10 no-scrollbar">
      <div className="text-center mb-6">
        <span className="text-xs font-medium bg-[#f3f4f6] text-gray-500 px-3 py-1 rounded-lg border border-gray-200">
          Conversation Started
        </span>
      </div>

      {messages.map((msg, idx) => {
        const isAdmin = msg.sender?.senderModel === "Admin";
        return (
          <div
            key={msg._id || idx}
            className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
          >
            <div
              className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 pt-2 pb-1.5 shadow-sm transform transition-all ${
                isAdmin
                  ? "bg-[#d9fdd3] text-gray-900 rounded-tr-none border border-[#c3eca1]" // Whatsapp green bubble equivalent
                  : "bg-white text-gray-900 rounded-tl-none border border-gray-200"
              }`}
            >
              {/* Tail pointer triangles */}
              <div
                className={`absolute top-0 w-3 h-4 ${
                  isAdmin
                    ? "-right-[8px] text-[#c3eca1]"
                    : "-left-[8px] text-gray-200"
                }`}
              >
                <svg viewBox="0 0 8 13" fill="currentColor">
                  {isAdmin ? (
                    <path d="M5.188 1H0v11.156L7.984 2.156Z" />
                  ) : (
                    <path d="M1.533 3.118 8 11.5V1H2.812z" />
                  )}
                </svg>
              </div>
              <div
                className={`absolute top-[1px] w-3 h-4 ${
                  isAdmin
                    ? "-right-[7px] text-[#d9fdd3]"
                    : "-left-[7px] text-white"
                }`}
              >
                <svg viewBox="0 0 8 13" fill="currentColor">
                  {isAdmin ? (
                    <path d="M5.188 1H0v11.156L7.984 2.156Z" />
                  ) : (
                    <path d="M1.533 3.118 8 11.5V1H2.812z" />
                  )}
                </svg>
              </div>

              {/* Media attachment block */}
              {renderMessageMedia(msg)}

              <p className="text-[14.5px] leading-relaxed break-words pr-12 whitespace-pre-wrap">
                {msg.content}
              </p>

              <div
                className={`absolute bottom-1 right-2 flex items-center float-right mt-1 ml-3 text-[10.5px] ${
                  isAdmin ? "text-gray-500" : "text-gray-400"
                }`}
              >
                <span className="tabular-nums opacity-90">
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    },
                  )}
                </span>
                {renderMessageTick(msg)}
              </div>

              {/* A hack to force spacing for the absolute time block wrapping */}
              <div className="h-3 w-16 invisible float-right"></div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};
