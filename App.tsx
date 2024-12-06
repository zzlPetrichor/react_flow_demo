import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import MapKeyValueNode from "./MapKeyValueNode";
import BranchNode from "./BranchNode";
const rfStyle = {
  backgroundColor: "#B8CEFF",
};
const initialNodes = [
  {
    id: "start",
    type: "mapKVType",
    position: { x: 0, y: 100 },
    data: {
      meta: { label: "Start" },
      input: { params: { query: "user_input" } },
      config: { handles: ["right"] },
    },
  },
  {
    id: "condition",
    type: "branchNode",
    position: { x: 300, y: 100 },
    data: {
      meta: { label: "Condition" },
      conditions: [
        {
          id: "if",
          label: "IF",
          expression: "query.Contains('代码报错')",
          handle: "handle-if",
        },
        { id: "else", label: "ELSE", expression: "", handle: "handle-else" },
      ],
      config: { handles: ["left", "right"] },
    },
  },
  {
    id: "output-true",
    type: "mapKVType",
    position: { x: 600, y: 0 },
    data: {
      meta: { label: "Action1" },
      content: "if: {{output}}",
      config: { handles: ["left", "right"] },
    },
  },
  {
    id: "output-false",
    type: "mapKVType",
    position: { x: 600, y: 200 },
    data: {
      meta: { label: "Action2" },
      content: "else: {{output}}",
      config: { handles: ["left", "right"] },
    },
  },
  {
    id: "end",
    type: "mapKVType",
    position: { x: 900, y: 100 },
    data: {
      meta: { label: "End" },
      output: "output",
      config: { handles: ["left"] },
    },
  },
];
const initialEdges = [
  {
    source: "start",
    sourceHandle: "right",
    target: "condition",
    targetHandle: "left",
    id: "edge-1",
  },
  {
    source: "condition",
    sourceHandle: "handle-if",
    target: "output-true",
    targetHandle: "left",
    id: "edge-2",
  },
  {
    source: "condition",
    sourceHandle: "handle-else",
    target: "output-false",
    targetHandle: "left",
    id: "edge-3",
  },
  {
    source: "output-true",
    sourceHandle: "right",
    target: "end",
    targetHandle: "left",
    id: "edge-4",
  },
  {
    source: "output-false",
    sourceHandle: "right",
    target: "end",
    targetHandle: "left",
    id: "edge-5",
  },
];
const nodeTypes = { mapKVType: MapKeyValueNode, branchNode: BranchNode };
function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
  const handleNodeDataChange = (id, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, input: { params: newData } } }
          : node
      )
    );
  };
  const generateUniqueId = () => {
    let id;
    do {
      id = Math.random().toString(36).substring(2, 8);
    } while (nodes.some((node) => node.id === id));
    return id;
  };
  const addNode = (type) => {
    const maxLabelIndex = nodes
      .filter((n) => n.type === type)
      .map((n) => {
        const labelSplits = (
          n?.data?.meta?.label?.length > 0 ? n?.data?.meta?.label : "0"
        ).split("-");
        const idx = parseInt(
          labelSplits?.length > 0 ? labelSplits[labelSplits.length - 1] : "0",
          10
        );
        return idx > 0 ? idx : 1;
      })
      .reduce((max, current) => Math.max(max, current), -1);
    const newNode = {
      id: generateUniqueId(),
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        meta: {
          label: `${type === "mapKVType" ? "Action" : "Condition"}-${
            maxLabelIndex + 1
          }`,
        },
        input: { params: {} },
        config: { handles: ["left", "right"] },
        onChange: handleNodeDataChange,
        ...(type === "branchNode" && {
          conditions: [
            { id: "if", label: "IF", expression: "" },
            { id: "else", label: "ELSE", expression: "" },
          ],
        }),
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };
  const handleDownloadJson = () => {
    const flowData = { nodes, edges };
    const fileName = "flow-data.json";
    const json = JSON.stringify(flowData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files || files.length < 1) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      try {
        const { nodes: newNodes, edges: newEdges } = JSON.parse(content);
        setNodes(newNodes);
        setEdges(newEdges);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
    reader.readAsText(files[0]); // 确保传递的是文件对象
  };
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: { ...node.data, onChange: handleNodeDataChange },
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={rfStyle}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      <button
        onClick={() => addNode("mapKVType")}
        style={{ position: "absolute", top: 10, left: 10 }}
      >
        Add Action Node
      </button>
      <button
        onClick={() => addNode("branchNode")}
        style={{ position: "absolute", top: 50, left: 10 }}
      >
        Add Condition Node
      </button>
      <button
        onClick={handleDownloadJson}
        style={{ position: "absolute", top: 10, right: 10 }}
      >
        Download
      </button>
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        style={{ position: "absolute", top: 90, left: 10 }}
      />
    </div>
  );
}
export default Flow;
