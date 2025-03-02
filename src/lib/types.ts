export interface Message {
    sender: "user" | "agent" | "system";
    text: string;
  }
  
  export interface Agent {
    id: string;
    name: string;
  }