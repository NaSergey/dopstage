"use client";

import * as React from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { MinusIcon, PlusIcon } from "@/shared/ui/icons";
import { useFormContext } from "react-hook-form";

export function SocialLinksField() {
  const [showSocialInputs, setShowSocialInputs] = React.useState(false);
  const { register } = useFormContext();

  return (
    <div className="space-y-3">
      <Button 
        type="button" 
        variant="frame-gray" 
        className="w-[192px]"  
        onClick={() => setShowSocialInputs((v) => !v)}
      >
        {showSocialInputs ? <MinusIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
        <span className="pl-2">Social links</span>
      </Button>
      {showSocialInputs && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-50 mb-2">Website</label>
            <Input type="url" placeholder="Enter website URL" {...register("website")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-50 mb-2">Telegram</label>
            <Input type="url" placeholder="Enter telegram link" {...register("telegram")} />
          </div>
        </div>
      )}
    </div>
  );
}
