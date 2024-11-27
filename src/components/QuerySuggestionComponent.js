import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const QuerySuggestionComponent = ({ prompt, schema }) => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setError(null);

      try {
        const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent({ prompt });
        setResult(response);
      } catch (err) {
        setError(err.message || "Error generating content");
      } finally {
        setLoading(false);
      }
    };

    if (prompt) {
      fetchResult();
    }
  }, [prompt]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div>
          <strong>Generated Query:</strong>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default QuerySuggestionComponent;
