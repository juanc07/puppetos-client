"use client";

import { useState } from "react";
import axios from "axios";
import { AgentConfig } from "puppetos-core";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { handleChange, handleNestedChange } from "../lib/agent-utils";

interface UpdateAgentFormProps {
  onResponse: (message: string | null) => void;
  onError: (message: string | null) => void;
}

type Tone = "friendly" | "sassy" | "formal" | "casual";
type Formality = "casual" | "formal";

const UpdateAgentForm = ({ onResponse, onError }: UpdateAgentFormProps) => {
  const [formData, setFormData] = useState<Partial<AgentConfig>>({});
  const [agentId, setAgentId] = useState("");
  const [knowledgeInput, setKnowledgeInput] = useState("");
  const [topicsInput, setTopicsInput] = useState("");
  const [platformsInput, setPlatformsInput] = useState("");
  const [ruleIdsInput, setRuleIdsInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onError(null);
    onResponse(null);

    if (!agentId) {
      onError("Please enter an Agent ID to update");
      return;
    }

    const config: Partial<AgentConfig> = {
      ...formData,
      knowledge: formData.knowledge
        ? {
            ...formData.knowledge,
            data: knowledgeInput.split(",").map(item => item.trim()).filter(Boolean),
          }
        : undefined,
      personality: formData.personality
        ? {
            ...formData.personality,
            preferences: {
              ...(formData.personality.preferences || { topics: [], languages: [] }), // Fallback to empty preferences
              topics: topicsInput ? topicsInput.split(",").map(item => item.trim()).filter(Boolean) : formData.personality.preferences?.topics || [],
              languages: formData.personality.preferences?.languages || [], // Preserve existing languages if not updated
            },
          }
        : undefined,
      settings: formData.settings
        ? {
            ...formData.settings,
            platforms: platformsInput.split(",").map(item => item.trim()).filter(Boolean),
          }
        : undefined,
      ruleIds: ruleIdsInput ? ruleIdsInput.split(",").map(id => id.trim()).filter(Boolean) : undefined,
    };

    try {
      const { data } = await axios.put(`http://localhost:3000/api/agents/${agentId}`, { config }, {
        headers: { "Content-Type": "application/json" },
      });
      onResponse(`Agent ${agentId} updated successfully`);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to update agent");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="agentId" className="block text-sm font-medium text-gray-700">Agent ID</Label>
        <Input
          id="agentId"
          value={agentId}
          onChange={e => setAgentId(e.target.value)}
          placeholder="Enter Agent ID to update"
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={e => handleChange(e, setFormData, formData)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={e => handleChange(e, setFormData, formData)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio || ""}
          onChange={e => handleChange(e, setFormData, formData)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mission" className="block text-sm font-medium text-gray-700">Mission</Label>
        <Textarea
          id="mission"
          name="mission"
          value={formData.mission || ""}
          onChange={e => handleChange(e, setFormData, formData)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vision" className="block text-sm font-medium text-gray-700">Vision</Label>
        <Textarea
          id="vision"
          name="vision"
          value={formData.vision || ""}
          onChange={e => handleChange(e, setFormData, formData)}
          className="w-full"
        />
      </div>

      {/* Contact */}
      <div className="space-y-2">
        <Label htmlFor="contact.email" className="block text-sm font-medium text-gray-700">Email</Label>
        <Input
          id="contact.email"
          name="contact.email"
          type="email"
          value={formData.contact?.email || ""}
          onChange={e => handleChange(e, setFormData, formData)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact.website" className="block text-sm font-medium text-gray-700">Website</Label>
        <Input
          id="contact.website"
          name="contact.website"
          type="url"
          value={formData.contact?.website || ""}
          onChange={e => handleChange(e, setFormData, formData)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact.socials.twitter" className="block text-sm font-medium text-gray-700">Twitter</Label>
        <Input
          id="contact.socials.twitter"
          name="twitter"
          type="url"
          value={formData.contact?.socials?.twitter || ""}
          onChange={e => handleNestedChange(e, "socials", "contact", setFormData, formData)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact.socials.github" className="block text-sm font-medium text-gray-700">GitHub</Label>
        <Input
          id="contact.socials.github"
          name="github"
          type="url"
          value={formData.contact?.socials?.github || ""}
          onChange={e => handleNestedChange(e, "socials", "contact", setFormData, formData)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact.socials.linkedin" className="block text-sm font-medium text-gray-700">LinkedIn</Label>
        <Input
          id="contact.socials.linkedin"
          name="linkedin"
          type="url"
          value={formData.contact?.socials?.linkedin || ""}
          onChange={e => handleNestedChange(e, "socials", "contact", setFormData, formData)}
          className="w-full"
        />
      </div>

      {/* Wallets */}
      <div className="space-y-2">
        <Label htmlFor="wallets.solana" className="block text-sm font-medium text-gray-700">Solana Wallet</Label>
        <Input
          id="wallets.solana"
          name="wallets.solana"
          value={formData.wallets?.solana || ""}
          onChange={e => handleChange(e, setFormData, formData)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="wallets.ethereum" className="block text-sm font-medium text-gray-700">Ethereum Wallet</Label>
        <Input
          id="wallets.ethereum"
          name="wallets.ethereum"
          value={formData.wallets?.ethereum || ""}
          onChange={e => handleChange(e, setFormData, formData)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="wallets.bitcoin" className="block text-sm font-medium text-gray-700">Bitcoin Wallet</Label>
        <Input
          id="wallets.bitcoin"
          name="wallets.bitcoin"
          value={formData.wallets?.bitcoin || ""}
          onChange={e => handleChange(e, setFormData, formData)}
          className="w-full"
        />
      </div>

      {/* Knowledge */}
      <div className="space-y-2">
        <Label htmlFor="knowledge" className="block text-sm font-medium text-gray-700">Knowledge (comma-separated)</Label>
        <Textarea
          id="knowledge"
          value={knowledgeInput}
          onChange={e => setKnowledgeInput(e.target.value)}
          placeholder="e.g., I help with tech, I love sustainability"
          className="w-full"
        />
      </div>

      {/* Personality */}
      <div className="space-y-2">
        <Label htmlFor="personality.tone" className="block text-sm font-medium text-gray-700">Tone</Label>
        <Select
          value={formData.personality?.tone || ""}
          onValueChange={value =>
            setFormData(prev => ({
              ...prev,
              personality: {
                ...(prev.personality || { tone: "friendly", humor: false, formality: "casual", preferences: { topics: [], languages: [] } }),
                tone: value as Tone,
              },
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="sassy">Sassy</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="personality.humor"
          checked={formData.personality?.humor || false}
          onCheckedChange={checked =>
            setFormData(prev => ({
              ...prev,
              personality: {
                ...(prev.personality || { tone: "friendly", humor: false, formality: "casual", preferences: { topics: [], languages: [] } }),
                humor: checked as boolean,
              },
            }))
          }
        />
        <Label htmlFor="personality.humor">Humor</Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="personality.formality" className="block text-sm font-medium text-gray-700">Formality</Label>
        <Select
          value={formData.personality?.formality || ""}
          onValueChange={value =>
            setFormData(prev => ({
              ...prev,
              personality: {
                ...(prev.personality || { tone: "friendly", humor: false, formality: "casual", preferences: { topics: [], languages: [] } }),
                formality: value as Formality,
              },
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select formality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="personality.catchphrase" className="block text-sm font-medium text-gray-700">Catchphrase</Label>
        <Input
          id="personality.catchphrase"
          name="personality.catchphrase"
          value={formData.personality?.catchphrase || ""}
          onChange={e => handleChange(e, setFormData, formData)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="topics" className="block text-sm font-medium text-gray-700">Topics (comma-separated)</Label>
        <Input
          id="topics"
          value={topicsInput}
          onChange={e => setTopicsInput(e.target.value)}
          placeholder="e.g., technology, sustainability"
          className="w-full"
        />
      </div>

      {/* Settings */}
      <div className="space-y-2">
        <Label htmlFor="settings.max_memory_context" className="block text-sm font-medium text-gray-700">Max Memory Context</Label>
        <Input
          id="settings.max_memory_context"
          name="settings.max_memory_context"
          type="number"
          value={formData.settings?.max_memory_context || ""}
          onChange={e => handleChange(e, setFormData, formData)}
          min="1"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="platforms" className="block text-sm font-medium text-gray-700">Platforms (comma-separated)</Label>
        <Input
          id="platforms"
          value={platformsInput}
          onChange={e => setPlatformsInput(e.target.value)}
          placeholder="e.g., discord, web"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ruleIds" className="block text-sm font-medium text-gray-700">Rule IDs (comma-separated)</Label>
        <Input
          id="ruleIds"
          value={ruleIdsInput}
          onChange={e => setRuleIdsInput(e.target.value)}
          placeholder="e.g., helloBlock, codeBoost"
          className="w-full"
        />
      </div>

      <Button type="submit" className="mt-6 w-full">Update Agent</Button>
    </form>
  );
};

export default UpdateAgentForm;