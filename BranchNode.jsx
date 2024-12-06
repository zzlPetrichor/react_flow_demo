import React from "react";
import { Handle } from "@xyflow/react";

const BranchNode = ({ id, data, isConnectable }) => {
  const defaultConditions = [
    {
      id: "if",
      label: "IF",
      expression: "",
      handle: "handle-if",
    },
    {
      id: "else",
      label: "ELSE",
      expression: "",
      handle: "handle-else",
    },
  ];
  const {
    meta = { label: "Condition" },
    input = {
      params: {
        conditions: defaultConditions,
      },
    },
    onChange,
  } = data;
  const conditions = input?.params?.conditions || defaultConditions;

  console.log(`input: ${JSON.stringify(input)}\ncondition: ${conditions}`);
  const { label } = meta;
  const handleExpressionChange = (index, newExpression) => {
    const updatedConditions = conditions.map((condition, i) => ({
      ...condition,
      expression: i === index ? newExpression : condition.expression,
      handle: condition.handle ? condition.handle : `handle-${condition.id}`,
    }));
    console.log(
      `newExpression: ${JSON.stringify(
        newExpression
      )}\nupdatedConditions: ${JSON.stringify(updatedConditions)}`
    );
    if (typeof onChange === "function") {
      onChange(id, { conditions: updatedConditions });
    }
  };
  return (
    <div
      className="branch-node"
      style={{
        padding: 10,
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor: "#f0f4f8",
        width: 250,
        position: "relative",
      }}
    >
      <div style={{ marginBottom: "5px" }}>
        <strong>{label}</strong>
      </div>
      <Handle
        type="target"
        position="left"
        id="left"
        isConnectable={isConnectable}
        style={{ top: "50%", transform: "translateY(-50%)", left: "-8px" }}
      />
      {conditions.map((condition, index) => (
        <div key={index} style={{ marginBottom: "5px", position: "relative" }}>
          <span>{condition.label}</span>
          {condition.label !== "ELSE" && (
            <input
              type="text"
              value={condition.expression}
              onChange={(e) => handleExpressionChange(index, e.target.value)}
              placeholder="Enter expression"
              style={{
                marginLeft: "5px",
                width: "calc(100% - 10px)",
                boxSizing: "border-box",
              }}
            />
          )}
          <Handle
            type="source"
            position="right"
            id={
              condition.id
                ? `handle-${condition.id}`
                : condition.label === "ELSE"
                ? "else"
                : `condition-${index}`
            }
            isConnectable={isConnectable}
            style={{
              top: index === 0 ? "30%" : "70%",
              transform: "translateY(-50%)",
              right: "-8px",
            }}
          />
        </div>
      ))}
    </div>
  );
};
export default BranchNode;
