import { AgentConfig } from "puppetos-core";

export const handleChange = <T extends Partial<AgentConfig>>(
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setForm: React.Dispatch<React.SetStateAction<T>>,
  formData: T
) => {
  const { name, value } = e.target;

  if (name.includes(".")) {
    const [parent, child] = name.split(".") as [keyof AgentConfig, string];
    setForm(prev => {
      const parentValue = prev[parent];
      if (typeof parentValue === "object" && parentValue !== null && !Array.isArray(parentValue)) {
        return {
          ...prev,
          [parent]: {
            ...(parentValue as Record<string, any>),
            [child]: value,
          },
        } as T;
      }
      return prev;
    });
  } else {
    setForm(prev => ({ ...prev, [name]: value } as T));
  }
};

export const handleNestedChange = <T extends Partial<AgentConfig>>(
  e: React.ChangeEvent<HTMLInputElement>,
  parent: string,
  grandparent: string | undefined,
  setForm: React.Dispatch<React.SetStateAction<T>>,
  formData: T
) => {
  const { name, value } = e.target;

  if (grandparent) {
    setForm(prev => {
      const grandparentValue = prev[grandparent as keyof AgentConfig];
      if (typeof grandparentValue === "object" && grandparentValue !== null && !Array.isArray(grandparentValue)) {
        const parentValue = (grandparentValue as Record<string, any>)[parent];
        if (typeof parentValue === "object" && parentValue !== null && !Array.isArray(parentValue)) {
          return {
            ...prev,
            [grandparent]: {
              ...(grandparentValue as Record<string, any>),
              [parent]: {
                ...(parentValue as Record<string, any>),
                [name]: value,
              },
            },
          } as T;
        }
      }
      return prev;
    });
  } else {
    setForm(prev => {
      const parentValue = prev[parent as keyof AgentConfig];
      if (typeof parentValue === "object" && parentValue !== null && !Array.isArray(parentValue)) {
        return {
          ...prev,
          [parent]: {
            ...(parentValue as Record<string, any>),
            [name]: value,
          },
        } as T;
      }
      return prev;
    });
  }
};