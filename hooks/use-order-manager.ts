// React Hook for Order Management
"use client";

import { useState } from "react";
import { Order } from "@/lib/firebase-admin";

interface CreateOrderPayload {
  name: string;
  phone: string;
  address: string;
  email?: string;
  productName?: string;
  productPrice?: number;
  quantity?: number;
  paymentMethod?: string;
  notes?: string;
}

interface UseOrderManagerReturn {
  createOrder: (data: CreateOrderPayload) => Promise<Order | null>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  lastOrder: Order | null;
}

export function useOrderManager(): UseOrderManagerReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const createOrder = async (data: CreateOrderPayload): Promise<Order | null> => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch("/api/orders/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "فشل في إنشاء الطلب");
      }

      const result = await response.json();
      setSuccess(true);
      setLastOrder(result.order);
      
      return result.order;
    } catch (err: any) {
      const errorMessage = err.message || "خطأ غير متوقع";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrder,
    isLoading,
    error,
    success,
    lastOrder
  };
}
