"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DeleteAgentFormProps {
  onResponse: (message: string | null) => void; // Updated to accept null
  onError: (message: string | null) => void;    // Updated to accept null
  getUserId: () => string;
}

const DeleteAgentForm = ({ onResponse, onError, getUserId }: DeleteAgentFormProps) => {
  const [deleteAgentId, setDeleteAgentId] = useState("");

  const handleDeleteAgent = async () => {
    if (!deleteAgentId) {
      onError("Please enter an Agent ID to delete");
      return;
    }
    onError(null);   // Now valid with string | null
    onResponse(null); // Now valid with string | null

    try {
      const { data } = await axios.delete(`http://localhost:3000/api/agents/${deleteAgentId}`, {
        data: { userId: getUserId() },
        headers: { "Content-Type": "application/json" },
      });
      onResponse(data.message);
      setDeleteAgentId("");
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to delete agent");
    }
  };

  const handleDeleteAllAgents = async () => {
    onError(null);   // Now valid with string | null
    onResponse(null); // Now valid with string | null

    try {
      const { data } = await axios.delete("http://localhost:3000/api/agents", {
        data: { userId: getUserId() },
        headers: { "Content-Type": "application/json" },
      });
      onResponse(data.message);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to delete all agents");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Delete an Agent</h2>
        <div className="space-y-2">
          <Label htmlFor="deleteAgentId" className="block text-sm font-medium text-gray-700">Agent ID</Label>
          <Input
            id="deleteAgentId"
            value={deleteAgentId}
            onChange={e => setDeleteAgentId(e.target.value)}
            placeholder="Enter Agent ID to delete"
            className="w-full"
          />
        </div>
        <Button
          onClick={handleDeleteAgent}
          variant="destructive"
          className="w-full"
          disabled={!deleteAgentId}
        >
          Delete Agent
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Delete All Agents</h2>
        <Button
          onClick={handleDeleteAllAgents}
          variant="destructive"
          className="w-full"
        >
          Delete All Agents
        </Button>
      </div>
    </div>
  );
};

export default DeleteAgentForm;