import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { generateQueryAction } from "../actions/DBActions";

export const fetchResult = async (prompt, dispatch, table, setResult) => {
  // const finalPrompt = `Give me Query to find '${prompt}' for the table. The table schema is '${JSON.stringify(
  //   tableSchema
  // )} of ${table}'`;

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
    console.log(err.message || "Error generating content");
  } finally {
    console.log(false); // Ensures loading state is updated after the async operation
  }
};
