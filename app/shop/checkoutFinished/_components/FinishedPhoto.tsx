import React from "react";
import PetSprite from "@/app/accounting/pixel/PixelSpriteSheet";
import "@/app/accounting/pixel/fx.css";

export default function FinishedPhoto() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-end justify-center w-full h-36 mb-4 overflow-hidden">
        <PetSprite mood="happy" size={128} />
      </div>
    </div>
  );
}
