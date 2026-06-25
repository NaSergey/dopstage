"use client";

import { Button } from "@/shared/ui/button";
import { DopIcon } from "@/shared/ui/icons";
import { type CreateCampaignFormValues } from "../../form-schema";
import { type FieldPath, type UseFormReturn } from "react-hook-form";
import { useCreateCampaignStore } from "../../store/use-create-campaign-store";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  methods: UseFormReturn<CreateCampaignFormValues>;
  setCurrentStep: (step: number) => void;
}

const stepFields: (keyof CreateCampaignFormValues)[][] = [
  ["name", "ticker", "description", "xHandle", "website", "telegram", "logo", "banner"],
  ["rewardAllocation", "campaignDays", "devSupplyAllocation"],
  [],
];

export function FormNavigation({ currentStep, totalSteps, methods, setCurrentStep }: FormNavigationProps) {
  const isLastStep = currentStep === totalSteps - 1;
  const nextStepLabel = isLastStep ? "Approve campaign creation" : "Next step";
  const { resetForm } = useCreateCampaignStore();

  const handleNextStep = async () => {
    const fields = stepFields[currentStep] as FieldPath<CreateCampaignFormValues>[];
    const isStepValid = fields.length ? await methods.trigger(fields) : true;
    if (!isStepValid) return;
    
    // If on last step, submit and clear storage
    if (isLastStep) {
      // Clear store after successful campaign creation
      resetForm();
      // Here you would normally submit the form data to the server
      return;
    }
    
    setCurrentStep(Math.min(totalSteps - 1, currentStep + 1));
  };
  
  const handlePrevStep = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-5xl mx-auto border border-black bg-zinc-950 py-4 z-50">
      <div className="flex w-full justify-between items-center px-4">
        <Button
          variant="frame-gray"
          onClick={handlePrevStep}
          disabled={currentStep === 0}
          className="w-[98px]"
        >
          Back  
        </Button>

        {isLastStep && (
          <div className="text-sm flex w-full pr-4 items-center justify-end gap-2 text-zinc-400 text-center">
            <div>
              <span>Transaction fee $10.67</span> 
              <span className="pl-4">Your reward 300</span>
            </div>
            <DopIcon />
          </div>
        )}

        <Button
          variant="frame-hover-fire"
          onClick={handleNextStep}
          className="w-[274px]"
        >
          {nextStepLabel}
        </Button>
      </div>
    </div>
  );
}
