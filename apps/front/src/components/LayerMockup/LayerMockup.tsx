import { ClockIcon, SignalIcon } from "@heroicons/react/24/outline";
import type { LayerModel, PropertyModel } from "@kissnotes/types";

interface LayerMockupProps {
  layer: LayerModel;
  property: PropertyModel;
  className?: string;
}

const LayerMockup = ({ layer, property, className }: LayerMockupProps) => {
  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}>
      <p className="bg-accent p-2">
        {layer.type} - {layer.name}
      </p>
      <div className="flex">
        <div className="bg-black w-full flex justify-start items-center gap-4 p-2">
          <ClockIcon className="size-6" />
          <p>{property.name}</p>
          <SignalIcon className="size-6" />
        </div>
        <div className="bg-gray-500 w-full flex justify-center items-center gap-4 p-2">
          <div className="w-3 h-3 border-2 rounded-sm rotate-45" />
          <div className="w-3 h-3 border-2 rounded-sm rotate-45" />
        </div>
      </div>
      {/* <div className="w-36 h-36 bg-gray-500 rounded-2xl" /> */}
    </div>
  );
};
export default LayerMockup;
