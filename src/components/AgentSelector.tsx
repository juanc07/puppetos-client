"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Agent } from "@/lib/types";

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgentId: string | null; // Updated to accept null
  onSelect: (agentId: string) => void;
}

export function AgentSelector({ agents, selectedAgentId, onSelect }: AgentSelectorProps) {
  return (
    <Select
      value={selectedAgentId ?? undefined} // Convert null to undefined for Select
      onValueChange={onSelect}
    >
      <SelectTrigger className="mb-4">
        <SelectValue placeholder="Select an agent" />
      </SelectTrigger>
      <SelectContent>
        {agents.map((agent) => (
          <SelectItem key={agent.id} value={agent.id}>
            {agent.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}