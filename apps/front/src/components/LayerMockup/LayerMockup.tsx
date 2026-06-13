import { ClockIcon, SignalIcon } from "@heroicons/react/24/outline";
import type { LayerModel, PropertyModel } from "@kissnotes/types";
import { asTitle } from "@/utils/stringUtils";

interface LayerMockupProps {
  layer?: LayerModel;
  property?: PropertyModel;
  className?: string;
}

const LayerMockup = ({ layer, property, className = "" }: LayerMockupProps) => {
  return (
    <div className={`rounded-2xl h-fit overflow-hidden ${className}`}>
      <div className="bg-accent py-1 px-4 flex justify-start items-center gap-4">
        <div className="bg-emphasis w-4 h-4 rounded-sm" />
        <p>
          {layer
            ? `${layer.type ? asTitle(layer?.type) : ""} ${layer?.type && layer?.name ? "•" : ""} ${layer?.name || "Layer 1"}`
            : "Layer 1"}
        </p>
      </div>

      <div className="flex justify-between">
        <div className="bg-black w-fit flex justify-start items-center gap-4 py-1 pe-4 ps-10 md:ps-5">
          <div className="flex justify-start gap-4">
            <ClockIcon className="size-6" />
            <p>{property?.name || ""}</p>
          </div>
          {/* TODO: replace with proper spiral icon */}
          <SignalIcon className="size-6" />
        </div>
        <div className="bg-gray-500 flex justify-center items-center py-1 w-full">
          <div className="flex  gap-4">
            <div className="w-3 h-3 border-2 rounded-sm rotate-45" />
            <div className="w-3 h-3 border-2 rounded-sm rotate-45" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default LayerMockup;
