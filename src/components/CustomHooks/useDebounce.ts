import { useEffect } from "react";
import useTimeout from "./useTimeout"; // adjust path as needed


export default function useDebounce(
  callback: () => void,
  delay: number,
  dependencies: React.DependencyList
) {
  const { reset, clear } = useTimeout(callback, delay);

  useEffect(reset, [...dependencies, reset]);
  useEffect(clear, []);
}
