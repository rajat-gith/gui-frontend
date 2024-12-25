import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { generateQueryAction } from "../actions/DBActions";

export const fetchResult = async (
  tableSchema,
  prompt,
  dispatch,
  table,
  setResponseLoading,
  setResponseError,
  setResult
) => {
  setResponseLoading(true);
  setResponseError(null);
  const finalPrompt = `Give me Query to find '${prompt}' for the table. The table schema is '${JSON.stringify(
    tableSchema
  )} of ${table}`;
  try {
    if (prompt && table) {
      dispatch(
        generateQueryAction(prompt, table, (result) => {
          setResult(result);
        })
      );
    } else {
      setResult("No valid SQL query found in the response.");
    }
  } catch (err) {
    setResponseError(err.message || "Error generating content");
  } finally {
    setResponseLoading(false);
  }
};
