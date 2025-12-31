import { useEffect } from "react";

export default function useBodyClass(className:string) {
  useEffect(() => {
    document.body.classList.add(className);
    return () => document.body.classList.remove(className);
  }, [className]);
}