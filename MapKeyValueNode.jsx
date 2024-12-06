import React, { useState, useEffect } from "react";
import { Handle } from "@xyflow/react";
const MapKeyValueNode = ({ id, data, isConnectable }) => {
  const {
    meta = { label: "NodeKV" },
    config = {},
    onChange,
    input = {},
  } = data;
  const { label } = meta;
  const { handles = [] } = config;
  // 使用 data.input.params 作为初始值
  const [inputMap, setInputMap] = useState(input.params || {});
  useEffect(() => {
    setInputMap((prevMap) => ({ ...input.params, ...prevMap }));
  }, []); // 空依赖数组，确保只在组件挂载时运行一次
  const handleInputChange = (key, value) => {
    const updatedMap = { ...inputMap, [key]: value };
    setInputMap(updatedMap);
    if (typeof onChange === "function") {
      onChange(id, updatedMap); // 确保 onChange 是一个函数
    }
  };
  const addKeyValuePair = () => {
    setInputMap({ ...inputMap, [""]: "" });
  };
  const handleKeyChange = (oldKey, newKey) => {
    const { [oldKey]: value, ...rest } = inputMap;
    rest[newKey] = value;
    setInputMap(rest);
  };
  const handleValueChange = (key, value) => {
    handleInputChange(key, value);
  };
  const removeKeyValuePair = (key) => {
    const { [key]: _, ...rest } = inputMap;
    setInputMap(rest);
  };
  return (
    <div
      className="map-key-value-node"
      style={{
        padding: 10,
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor: "#fff",
        width: 250,
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: "5px" }}>
        <strong>{label}</strong>
      </div>
      {Object.entries(inputMap).map(([key, value], index) => (
        <div key={index} style={{ display: "flex", marginBottom: "5px" }}>
          <input
            value={key}
            onChange={(e) => handleKeyChange(key, e.target.value)}
            placeholder="Key"
            style={{
              flexGrow: 1,
              marginRight: "5px",
              minWidth: "0",
            }}
          />
          <input
            value={value}
            onChange={(e) => handleValueChange(key, e.target.value)}
            placeholder="Value"
            style={{
              flexGrow: 2,
              marginRight: "5px",
              minWidth: "0",
            }}
          />
          <button onClick={() => removeKeyValuePair(key)}>Remove</button>
        </div>
      ))}
      <button onClick={addKeyValuePair}>Add Key-Value Pair</button>
      {handles.includes("top") && (
        <Handle
          id="top"
          type="source"
          position="top"
          isConnectable={isConnectable}
        />
      )}
      {handles.includes("bottom") && (
        <Handle
          id="bottom"
          type="source"
          position="bottom"
          isConnectable={isConnectable}
        />
      )}
      {handles.includes("left") && (
        <Handle
          id="left"
          type="target"
          position="left"
          isConnectable={isConnectable}
        />
      )}
      {handles.includes("right") && (
        <Handle
          id="right"
          type="source"
          position="right"
          isConnectable={isConnectable}
        />
      )}
    </div>
  );
};
export default MapKeyValueNode;
