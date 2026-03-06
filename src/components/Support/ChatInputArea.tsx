/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";

interface ChatInputAreaProps {
  inputMessage: string;
  mediaPreview: string | null;
  selectedMedia: File | null;
  handleInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleBlur: () => void;
  handleSendMessage: (e: React.FormEvent) => void;
  handleRemoveMedia: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  inputMessage,
  mediaPreview,
  selectedMedia,
  handleInput,
  handleBlur,
  handleSendMessage,
  handleRemoveMedia,
  handleFileChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-[#f0f2f5] px-4 py-3 border-t border-gray-200 z-10 shrink-0">
      {mediaPreview && (
        <div className="mb-3 flex items-center relative gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm mx-auto max-w-lg">
          <div className="relative">
            {selectedMedia?.type.startsWith("video") ? (
              <video
                src={mediaPreview}
                className="w-16 h-16 rounded object-cover border"
              />
            ) : (
              <img
                src={mediaPreview}
                className="w-16 h-16 rounded object-cover border"
                alt="preview"
              />
            )}
            <button
              type="button"
              onClick={() => {
                handleRemoveMedia();
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-700 truncate">
              {selectedMedia?.name}
            </p>
            <p className="text-xs text-brand-500 font-medium">Ready to send</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex gap-2 items-end max-w-4xl mx-auto w-full"
      >
        <div className="flex bg-white rounded-2xl w-full items-end border border-gray-300 focus-within:border-brand-500 overflow-hidden px-2 shadow-sm transition-colors relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-500 hover:text-brand-500 hover:bg-gray-50 transition-colors shrink-0 rounded-l-2xl mb-[2px]"
            title="Attach File"
          >
            <svg
              className="w-6 h-6 transform -rotate-45"
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
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />

          <textarea
            value={inputMessage}
            onChange={(e) => {
              handleInput(e);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            onBlur={handleBlur}
            placeholder="Type a message"
            rows={1}
            className="w-full bg-transparent border-transparent px-2 py-3.5 text-[15px] focus:ring-0 resize-none max-h-32 focus:outline-none placeholder:text-gray-400"
            style={{ minHeight: "44px" }}
          />
        </div>
        <button
          type="submit"
          disabled={!inputMessage.trim() && !selectedMedia}
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-full p-3.5 flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-sm shrink-0 mb-[2px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-[22px] h-[22px] ml-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};
