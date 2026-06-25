"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type CreateCampaignFormValues, defaultValues } from "../form-schema";

interface CreateCampaignState {
  formData: CreateCampaignFormValues;
  currentStep: number;
  logoPreview?: string;
  bannerPreview?: string;
  showFilters: boolean;

  // Actions
  updateFormData: (data: Partial<CreateCampaignFormValues>) => void;
  setCurrentStep: (step: number) => void;
  setLogoPreview: (preview: string | undefined) => void;
  setBannerPreview: (preview: string | undefined) => void;
  setShowFilters: (show: boolean) => void;
  resetForm: () => void;
}

export const useCreateCampaignStore = create<CreateCampaignState>()(
  persist(
    (set) => ({
      formData: defaultValues,
      currentStep: 0,
      logoPreview: undefined,
      bannerPreview: undefined,
      showFilters: false,

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      setLogoPreview: (preview) => set({ logoPreview: preview }),

      setBannerPreview: (preview) => set({ bannerPreview: preview }),

      setShowFilters: (show) => set({ showFilters: show }),

      resetForm: () =>
        set({
          formData: defaultValues,
          currentStep: 0,
          logoPreview: undefined,
          bannerPreview: undefined,
          showFilters: false,
        }),
    }),
    {
      name: "create-campaign-storage",
      storage: createJSONStorage(() => localStorage),
      // Exclude File objects from storage (they can't be serialized)
      partialize: (state) => ({
        formData: {
          ...state.formData,
          logo: undefined,
          banner: undefined,
        },
        currentStep: state.currentStep,
        logoPreview: state.logoPreview,
        bannerPreview: state.bannerPreview,
        showFilters: state.showFilters,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to rehydrate campaign form:", error);
        } else if (state) {
        }
      },
    }
  )
);

