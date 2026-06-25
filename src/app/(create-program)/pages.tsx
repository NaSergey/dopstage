"use client";

import { CampaignStepper } from "./components/stepper/campaign-stepper";
import { BasicInfoForm } from "./components/forms/basic-info-form";
import { BoostersForm } from "./components/forms/boosters-form";
import { ReviewForm } from "./components/forms/review-form";
import { useState, useEffect, useRef } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCampaignSchema,
  defaultValues,
  type CreateCampaignFormValues,
} from "./form-schema";
import Wrapper from "@/shared/ui/wrapper";
import Logo from "@/widgets/header/components/logo";
import { FormNavigation } from "./components/navigation/form-navigation";
import { useCreateCampaignStore } from "./store/use-create-campaign-store";

export default function CreateCampaignPage() {
  const [hasScroll, setHasScroll] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { currentStep, setCurrentStep, updateFormData } =
    useCreateCampaignStore();
  const isInitialized = useRef(false);

  const methods = useForm<CreateCampaignFormValues>({
    resolver: zodResolver(
      createCampaignSchema,
    ) as Resolver<CreateCampaignFormValues>,
    defaultValues,
    mode: "onChange",
  });

  // Wait for store hydration and initialize form with store data
  useEffect(() => {
    const unsubscribe = useCreateCampaignStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
      // Initialize form with hydrated data
      if (!isInitialized.current) {
        const hydratedFormData = useCreateCampaignStore.getState().formData;
        methods.reset(hydratedFormData);
        isInitialized.current = true;
      }
    });

    // Check if already hydrated (synchronous storage like localStorage)
    if (useCreateCampaignStore.persist.hasHydrated()) {
      setIsHydrated(true);
      if (!isInitialized.current) {
        const hydratedFormData = useCreateCampaignStore.getState().formData;
        methods.reset(hydratedFormData);
        isInitialized.current = true;
      }
    }

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update store when form changes (with debounce to avoid too frequent updates)
  useEffect(() => {
    if (!isHydrated) return;

    let timeoutId: NodeJS.Timeout;
    const subscription = methods.watch((data) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        updateFormData(data as Partial<CreateCampaignFormValues>);
      }, 100);
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [isHydrated, methods, updateFormData]);

  useEffect(() => {
    const checkScroll = () => {
      // Use requestAnimationFrame to check after DOM updates
      requestAnimationFrame(() => {
        const hasVerticalScroll =
          document.documentElement.scrollHeight > window.innerHeight;
        setHasScroll(hasVerticalScroll);
      });
    };

    // Initial check with a small delay to ensure DOM is updated
    const timeoutId = setTimeout(checkScroll, 100);

    window.addEventListener("resize", checkScroll);

    // Check on scroll to handle dynamic content changes
    const scrollHandler = () => {
      checkScroll();
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkScroll);
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [currentStep]);

  const totalSteps = 3;

  const renderFormContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoForm />;
      case 1:
        return <BoostersForm />;
      case 2:
        return <ReviewForm />;
      default:
        return <BasicInfoForm />;
    }
  };

  const isLastStep = currentStep === totalSteps - 1;
  const nextLabel = isLastStep ? "Check your campaign" : "Create Campaign";

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Wrapper>
          <div className="flex items-center py-3">
            <Logo />
          </div>
        </Wrapper>
      </div>

      {/* Fixed stepper under the header */}
      <div
        className={`fixed left-0 right-0 pt-8 z-40 bg-zinc-950 max-w-5xl mx-auto ${hasScroll ? "border-b border-zinc-800" : ""}`}
      >
        <Wrapper>
          <div className="flex items-center justify-center py-2">
            <CampaignStepper currentStep={currentStep} />
          </div>
        </Wrapper>
      </div>

      {/* Page heading below fixed stepper */}
      <div className="flex flex-col items-center pt-40 gap-2">
        <h1 className="text-4xl font-normal text-white">{nextLabel}</h1>
      </div>

      <div className="flex-1 flex flex-col items-center gap-8 p-4 pb-32">
        <FormProvider {...methods}>
          <form
            className="w-full"
            onSubmit={methods.handleSubmit(() => {
              // TODO: implement campaign submission
            })}
          >
            {renderFormContent()}
          </form>
        </FormProvider>
      </div>

      <FormNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        methods={methods}
        setCurrentStep={setCurrentStep}
      />
    </div>
  );
}