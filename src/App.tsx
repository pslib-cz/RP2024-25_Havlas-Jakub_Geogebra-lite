import React, { useState, useCallback, useRef, useEffect } from "react";
import LibraryController from "./compoenents/LibraryController";
import "./App.css";

function App() {
  return (
    <>
      <LibraryController
        expressions={["x^2"]}
        params={{ x: -2, y: -2, width: 4, height: 4 }}
      />
    </>
  );
}

export default App;











function mergeSortedArrays(arr1: number[], arr2: number[]): number[] {
  const merged: number[] = [];
  let i = 0;
  let j = 0;

  // Loop through both arrays
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      merged.push(arr1[i]);
      i++;
    } else {
      merged.push(arr2[j]);
      j++;
    }
  }

  // Add remaining elements from arr1 (if any)
  while (i < arr1.length) {
    merged.push(arr1[i]);
    i++;
  }

  // Add remaining elements from arr2 (if any)
  while (j < arr2.length) {
    merged.push(arr2[j]);
    j++;
  }

  return merged;
}
