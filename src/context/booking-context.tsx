"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Theater, SelectedAddOn, Booking } from "@/types/frontend";

export interface BookingState {
  currentStep: number;
  date: string;
  slotId: number | null;
  slotTime: string;
  theaterId: number | null;
  theater: Theater | null;

  name: string;
  phone: string;
  email: string;

  occasion: string;
  guests: number;

  selectedAddOns: SelectedAddOn[];

  couponCode: string;
  discount: number;

  createdBooking: Booking | null;
  confirmedReceipt: any | null;
}

interface BookingContextType {
  state: BookingState;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateState: (fields: Partial<BookingState>) => void;
  addOrUpdateAddOn: (addOnId: number, optionName: string, price: number, name: string, category: "CAKE" | "DECOR" | "GIFT", quantity?: number) => void;
  removeAddOn: (addOnId: number) => void;
  setCoupon: (code: string, discount: number) => void;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
  resetBooking: () => void;
}

const initialBookingState: BookingState = {
  currentStep: 1,
  date: new Date().toISOString().split("T")[0],
  slotId: null,
  slotTime: "",
  theaterId: null,
  theater: null,

  name: "",
  phone: "",
  email: "",

  occasion: "BIRTHDAY",
  guests: 2,

  selectedAddOns: [],

  couponCode: "",
  discount: 0,

  createdBooking: null,
  confirmedReceipt: null,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BookingState>(initialBookingState);

  const nextStep = () => {
    setState((prev) => ({ ...prev, currentStep: Math.min(9, prev.currentStep + 1) }));
  };

  const prevStep = () => {
    setState((prev) => ({ ...prev, currentStep: Math.max(1, prev.currentStep - 1) }));
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 9) {
      setState((prev) => ({ ...prev, currentStep: step }));
    }
  };

  const updateState = (fields: Partial<BookingState>) => {
    setState((prev) => ({ ...prev, ...fields }));
  };

  const addOrUpdateAddOn = (
    addOnId: number,
    optionName: string,
    price: number,
    name: string,
    category: "CAKE" | "DECOR" | "GIFT",
    quantity: number = 1
  ) => {
    setState((prev) => {
      const existingIdx = prev.selectedAddOns.findIndex((item) => item.addOnId === addOnId);
      let updatedAddOns = [...prev.selectedAddOns];

      if (existingIdx >= 0) {
        updatedAddOns[existingIdx] = {
          addOnId,
          optionName,
          price,
          name,
          category,
          quantity,
        };
      } else {
        updatedAddOns.push({
          addOnId,
          optionName,
          price,
          name,
          category,
          quantity,
        });
      }

      return { ...prev, selectedAddOns: updatedAddOns };
    });
  };

  const removeAddOn = (addOnId: number) => {
    setState((prev) => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.filter((item) => item.addOnId !== addOnId),
    }));
  };

  const setCoupon = (code: string, discount: number) => {
    setState((prev) => ({ ...prev, couponCode: code, discount }));
  };

  const calculateSubtotal = () => {
    const baseTheaterPrice = state.theater?.basePrice || 0;
    const addOnsTotal = state.selectedAddOns.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    return baseTheaterPrice + addOnsTotal;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return Math.max(0, subtotal - state.discount);
  };

  const resetBooking = () => {
    setState(initialBookingState);
  };

  return (
    <BookingContext.Provider
      value={{
        state,
        nextStep,
        prevStep,
        goToStep,
        updateState,
        addOrUpdateAddOn,
        removeAddOn,
        setCoupon,
        calculateSubtotal,
        calculateTotal,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
