"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type ActivityItemProps = {
  name: string;
  onDelete: () => void;
};

export function ActivityItem({ name, onDelete }: ActivityItemProps) {
  return (
    <div
      style={{
        borderRadius: 8,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        border: "1px solid gray",
      }}
    >
      <span className="font-medium">{name}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 size={16} className="text-red-500" />
      </Button>
    </div>
  );
}