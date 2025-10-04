import React from "react";
import BaseUserCard, { BaseUserCardProps } from "./BaseUserCard";

const AdminUserCard: React.FC<BaseUserCardProps> = (props) => (
  <BaseUserCard {...props} role="Admin" />
);

export default AdminUserCard;