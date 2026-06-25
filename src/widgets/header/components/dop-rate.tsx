"use client";

import { useState, useEffect } from "react";
import DopValue from "@/shared/ui/dops-value";
import { AppImage } from "@/shared/ui/app-image";
import TaoIcon from "@/shared/assets/tao-icon.webp";
import { formatNumber } from "@/shared/lib/format/formatNumber";

function DopRate() {
    const [price, setPrice] = useState<number | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPrice(Math.random() * (20000 - 1000) + 1000);
    }, []);

    if (price === null) return null;

    return (
        <DopValue className="flex items-center font-medium gap-1 text-sm" iconClassName="size-3">
            <AppImage
                src={TaoIcon}
                alt="Dop Rate"
                width={16}
                height={16}
            />
            ≈ {formatNumber(price, 0)}
        </DopValue >
    )
}

export default DopRate;