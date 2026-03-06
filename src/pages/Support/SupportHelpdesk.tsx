/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
    getAllConversations,
    getConversationMessages,
    sendMessage as sendApiMessage,
} from "../../api/chatApi";
import { useSocket } from "../../context/SocketContext";
import { ConversationSidebar } from "../../components/Support/ConversationSidebar";
import { ChatHeader } from "../../components/Support/ChatHeader";
import { ChatMessageList } from "../../components/Support/ChatMessageList";
import { ChatInputArea } from "../../components/Support/ChatInputArea";

export default function SupportHelpdesk() {
    const { socket } = useSocket();
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [typingStatus, setTypingStatus] = useState("");
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [shouldScroll, setShouldScroll] = useState(true);

    // Initial Fetch
    useEffect(() => {
        getAllConversations()
            .then((res) => {
                const payload = res.data?.data || res.data;
                let convList = [];
                if (Array.isArray(payload)) {
                    convList = payload;
                } else if (payload && Array.isArray(payload.conversations)) {
                    convList = payload.conversations;
                }
                setConversations(convList);

                // Join all rooms so we can receive notifications on the sidebar
                if (socket) {
                    convList.forEach((c: any) => {
                        socket.emit("join-conversation", c.conversationId);
                    });
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching conversations", err);
                setLoading(false);
            });
    }, [socket]);

    // Socket Event Listeners
    useEffect(() => {
        if (!socket) return;

        const onReceiveMessage = (msg: any) => {
            if (
                selectedConversation &&
                msg.conversation === selectedConversation.conversationId
            ) {
                setMessages((prev) => {
                    if (prev.find((m) => m._id === msg._id)) return prev;
                    return [...prev, msg];
                });
                socket.emit("message-seen", {
                    conversationId: selectedConversation.conversationId,
                });
                setShouldScroll(true);
            }

            setConversations((prev) => {
                const updated = [...prev];
                const convIndex = updated.findIndex(
                    (c) => c.conversationId === msg.conversation,
                );
                if (convIndex > -1) {
                    updated[convIndex].lastMessage = msg;
                    const [conv] = updated.splice(convIndex, 1);
                    updated.unshift(conv);
                }
                return updated;
            });
        };

        const onMessageStatus = (data: { messageId: string; status: string }) => {
            setMessages((prev) =>
                prev.map((m) => {
                    if (m._id === data.messageId) {
                        return { ...m, status: data.status };
                    }
                    return m;
                }),
            );
        };

        const onTyping = ({ userId }: { userId: string }) => {
            if (selectedConversation && userId === selectedConversation.user?._id) {
                setTypingStatus("User is typing...");
            }
        };

        const onStopTyping = () => {
            setTypingStatus("");
        };

        const onUserStatus = ({ userId, online }: { userId: string; online: boolean }) => {
            setOnlineUsers((prev) => {
                const next = new Set(prev);
                if (online) next.add(userId);
                else next.delete(userId);
                return next;
            });
        };

        socket.on("receive-message", onReceiveMessage);
        socket.on("message-status", onMessageStatus);
        socket.on("typing", onTyping);
        socket.on("stop-typing", onStopTyping);
        socket.on("user-status", onUserStatus);

        return () => {
            socket.off("receive-message", onReceiveMessage);
            socket.off("message-status", onMessageStatus);
            socket.off("typing", onTyping);
            socket.off("stop-typing", onStopTyping);
            socket.off("user-status", onUserStatus);
        };
    }, [socket, selectedConversation]);

    // Fetch messages when conversation changes
    useEffect(() => {
        if (selectedConversation && socket) {
            socket.emit("join-conversation", selectedConversation.conversationId);
            setShouldScroll(true);
            getConversationMessages(selectedConversation.conversationId)
                .then((res) => {
                    const msgData = res.data?.data || res.data || [];
                    if (Array.isArray(msgData)) {
                        setMessages(msgData);
                    } else if (msgData.messages) {
                        setMessages(msgData.messages);
                    } else {
                        setMessages([]);
                    }
                })
                .catch((err) => console.error("Error loading messages", err));
        }
    }, [selectedConversation, socket]);

    // Scroll trigger
    useEffect(() => {
        if (shouldScroll) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setShouldScroll(false);
        }
    }, [messages, shouldScroll]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedMedia(file);
            setMediaPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveMedia = () => {
        setSelectedMedia(null);
        setMediaPreview(null);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!inputMessage.trim() && !selectedMedia) || !selectedConversation)
            return;

        const content = inputMessage.trim();
        const mediaToSend = selectedMedia;

        setInputMessage("");
        handleRemoveMedia();
        setShouldScroll(true);
        socket?.emit("stop-typing", {
            conversationId: selectedConversation.conversationId,
        });

        try {
            const res = await sendApiMessage(
                selectedConversation.conversationId,
                content,
                mediaToSend
            );
            const newMsg = res.data?.data || res.data;
            if (newMsg) {
                setMessages((prev) => [...prev, newMsg]);
                setShouldScroll(true);
                socket?.emit("send-message", {
                    messageId: newMsg._id,
                    conversationId: selectedConversation.conversationId,
                });

                setConversations((prev) => {
                    const updated = [...prev];
                    const idx = updated.findIndex(
                        (c) => c.conversationId === selectedConversation.conversationId,
                    );
                    if (idx > -1) {
                        updated[idx].lastMessage = newMsg;
                        const [c] = updated.splice(idx, 1);
                        updated.unshift(c);
                    }
                    return updated;
                });
            }
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setInputMessage(e.target.value);
        if (selectedConversation && socket) {
            socket.emit("typing", {
                conversationId: selectedConversation.conversationId,
            });
        }
    };

    const handleBlur = () => {
        if (selectedConversation && socket) {
            socket.emit("stop-typing", {
                conversationId: selectedConversation.conversationId,
            });
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] p-6 flex flex-col">
            <PageMeta title="Support Helpdesk" />
            <PageBreadcrumb pageTitle="Support Helpdesk" />

            <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden flex-1 shadow-sm h-full max-h-full">
                <ConversationSidebar
                    loading={loading}
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    onSelectConversation={setSelectedConversation}
                    onlineUsers={onlineUsers}
                />

                <div className="flex-1 flex flex-col bg-[#efeae2] relative overflow-hidden bg-[url('https://i.pinimg.com/originals/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-white/80 z-0"></div>

                    {selectedConversation ? (
                        <>
                            <ChatHeader
                                selectedConversation={selectedConversation}
                                typingStatus={typingStatus}
                            />

                            <ChatMessageList
                                messages={messages}
                                messagesEndRef={messagesEndRef}
                            />

                            <ChatInputArea
                                inputMessage={inputMessage}
                                mediaPreview={mediaPreview}
                                selectedMedia={selectedMedia}
                                handleInput={handleInput}
                                handleBlur={handleBlur}
                                handleSendMessage={handleSendMessage}
                                handleRemoveMedia={handleRemoveMedia}
                                handleFileChange={handleFileChange}
                            />
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center z-10">
                            <div className="bg-white/90 backdrop-blur rounded-full px-6 py-2 shadow-sm mb-6 flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                                <span className="text-sm font-medium text-gray-600">
                                    End-to-end encrypted connection
                                </span>
                            </div>
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md mb-5 border-4 border-gray-50">
                                <svg
                                    className="w-10 h-10 text-brand-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-light text-gray-800 mb-2">
                                Support Center
                            </h2>
                            <p className="text-sm text-gray-500 max-w-sm text-center">
                                Select a conversation from the active list to interact with the
                                user and resolve tickets securely.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
