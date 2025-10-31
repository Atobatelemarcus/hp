"use client";

import { useState } from "react";
import ReactionButtons from "./ReactionButtons";

export default function CommentThread({
  comments ,// fallback to empty array
  onReactToComment,
  onAddReply,
}) {
  const [replyText, setReplyText] = useState({});
  const [showReplyBox, setShowReplyBox] = useState({});

  if (!comments.length) {
    return <p className="text-gray-500 text-sm">No comments yet</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((c) => {
        const commentId = c._id;

        return (
          <div key={commentId} className="border rounded-lg p-3 bg-gray-50">
            {/* Comment Author */}
            <p className="font-semibold">{c.author || c.user?.name || "Anonymous"}</p>

            {/* Comment Text */}
            <p className="text-gray-700">{c.text || ""}</p>

            {/* Comment Reactions & Reply Button */}
            <div className="flex items-center gap-3 mt-2">
              <ReactionButtons
                size="sm"
                reactions={c.reactions || {}}
                onReact={(type) => onReactToComment?.(commentId, type)}
              />
              <button
                onClick={() =>
                  setShowReplyBox((prev) => ({
                    ...prev,
                    [commentId]: !prev[commentId],
                  }))
                }
                className="text-sm text-blue-600 hover:underline"
              >
                Reply
              </button>
            </div>

            {/* Replies */}
            {Array.isArray(c.replies) && c.replies.length > 0 && (
              <div className="ml-6 mt-3 space-y-2">
                {c.replies.map((r) => {
                  const replyId = r._id;
                  return (
                    <div key={replyId} className="bg-white border p-2 rounded">
                      <p className="font-medium">{r.author}</p>
                      <p>{r.text || ""}</p>
                      <ReactionButtons
                        size="sm"
                        reactions={r.reactions || {}}
                        onReact={(type) => onReactToComment?.(replyId, type)}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Reply Box */}
            {showReplyBox[commentId] && (
              <div className="m-4 mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={replyText[commentId] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({ ...prev, [commentId]: e.target.value }))
                  }
                  placeholder="Write a reply..."
                  className="flex-1 border rounded px-3 py-1.5"
                />
                <button
                  onClick={() => {
                    const text = replyText[commentId];
                    if (text?.trim()) {
                      onAddReply?.(commentId, text);
                      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
                      setShowReplyBox((prev) => ({ ...prev, [commentId]: false }));
                    }
                  }}
                  className="bg-blue-600 text-white p-2 rounded"
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}



