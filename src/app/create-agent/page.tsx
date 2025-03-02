"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateAgentForm from "../../components/CreateAgentForm";
import UpdateAgentForm from "../../components/UpdateAgentForm";
import DeleteAgentForm from "../../components/DeleteAgentForm";

const getUserId = (): string => "user123"; // Replace with real auth logic

const AgentManagementPage = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Agent Management</h1>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Agent</TabsTrigger>
          <TabsTrigger value="update">Update Agent</TabsTrigger>
          <TabsTrigger value="delete">Delete Agent</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <CreateAgentForm
            onResponse={setResponse}
            onError={setError}
            getUserId={getUserId}
          />
        </TabsContent>

        <TabsContent value="update">
          <UpdateAgentForm
            onResponse={setResponse}
            onError={setError}
          />
        </TabsContent>

        <TabsContent value="delete">
          <DeleteAgentForm
            onResponse={setResponse}
            onError={setError}
            getUserId={getUserId}
          />
        </TabsContent>
      </Tabs>

      {response && <p className="mt-6 text-green-600 text-center">{response}</p>}
      {error && <p className="mt-6 text-red-600 text-center">{error}</p>}
    </div>
  );
};

export default AgentManagementPage;