export interface Message {
    sender: "user" | "agent";
    text: string;
  }
  
  export interface Agent {
    id: string;
    name: string;
  }