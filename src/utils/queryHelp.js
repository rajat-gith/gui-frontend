import { fetchResult } from "./suggestQueryUtil";

export const handleQueryHelp = (
  suggestQueryDb,
  suggestQueryTable,
  dispatch,
  queryRun,
  userPrompt,
  setResult
) => {
  if (suggestQueryDb.length && suggestQueryTable.length) {
    fetchResult(userPrompt, dispatch, suggestQueryTable, setResult);
  }
};
