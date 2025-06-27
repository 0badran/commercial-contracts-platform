"use client";

import type React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon: Icon = AlertCircle,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
      <CardContent className="flex items-center justify-center h-64">
        <div className="text-center py-12">
          <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
          {action}
        </div>
      </CardContent>
    </Card>
  );
}
