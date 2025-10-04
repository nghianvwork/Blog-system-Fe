import React from "react";
import BaseUserCard, { BaseUserCardProps } from "./BaseUserCard";

const AuthorUserCard: React.FC<BaseUserCardProps> = (props) => (
  <BaseUserCard {...props} role="Author" />
);

export default AuthorUserCard;