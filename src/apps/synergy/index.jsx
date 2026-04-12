import React from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../utils/general";

export const Synergy = () => {
  const wnapp = useSelector((state) => state.apps.synergy);

  if (!wnapp) return null;

  return (
    <div
      className="synergy floatTab dpShad"
      data-size={wnapp?.size}
      data-max={wnapp?.max}
      style={{
        ...(wnapp?.size == "cstm" ? wnapp?.dim : null),
        zIndex: wnapp?.z,
      }}
      data-hide={wnapp?.hide}
      id={wnapp?.icon + "App"}
    >
      <ToolBar
        app={wnapp?.action}
        icon={wnapp?.icon}
        size={wnapp?.size}
        name="Synergy Drive"
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow h-full flex flex-col items-center justify-center bg-[#f9f9f9] dark:bg-[#1e1e1e]">
          <div className="text-6xl mb-4">📁</div>
          <h2 className="text-xl font-semibold mb-2">Synergy Drive</h2>
          <p className="text-sm text-gray-500 mb-4">Documents, tasks, and project management</p>
          <span className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
            Coming soon
          </span>
        </div>
      </div>
    </div>
  );
};
