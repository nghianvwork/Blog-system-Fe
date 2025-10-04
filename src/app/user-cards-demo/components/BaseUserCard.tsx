import React from "react";

export interface BaseUserCardProps {
  name: string;
  email: string;
  role: string;
  onViewPosts?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const BaseUserCard: React.FC<BaseUserCardProps> = ({
  name,
  email,
  role,
  onViewPosts,
  onEdit,
  onDelete,
}) => (
  <div style={{ border: "1px solid #ccc", padding: 16, marginBottom: 16 }}>
    <h3>{name} <span style={{ fontSize: 14, color: "#888" }}>({role})</span></h3>
    <p>Email: {email}</p>
    <div>
      {onViewPosts && <button onClick={onViewPosts}>View Posts</button>}{" "}
      {onEdit && <button onClick={onEdit}>Edit</button>}{" "}
      {onDelete && <button onClick={onDelete}>Delete</button>}
    </div>
  </div>
);

export default BaseUserCard;