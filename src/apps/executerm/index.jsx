import React from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../utils/general";

export const ExecuTerm = () => {
  const wnapp = useSelector((state) => state.apps.executerm);

  return (
    <div
      className="executerm floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="ExecuTerm"
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow h-full flex flex-col items-center justify-center bg-[#0c0c0c] text-white">
          <div className="text-6xl mb-4">⌨️</div>
          <h2 className="text-xl font-semibold mb-2">ExecuTerm</h2>
          <p className="text-sm text-gray-400 mb-4">Internal terminal access</p>
          <span className="px-3 py-1 text-xs bg-gray-800 rounded text-gray-400">
            Coming soon
          </span>
        </div>
      </div>
    </div>
  );
};
