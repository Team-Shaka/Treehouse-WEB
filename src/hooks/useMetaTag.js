import { useEffect } from "react";

export const useMetaTag = (name, content) => {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = name;
    meta.content = content;
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, [name, content]);
};
