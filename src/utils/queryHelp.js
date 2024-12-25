import { fetchResult } from "./suggestQueryUtil";

export const handleQueryHelp = (
  suggestQueryDb,
  suggestQueryTable,
  dispatch,
  queryRun,
  userPrompt,
  setResponseLoading,
  setResponseError,
  setResult,
  setShouldFetchResult
) => {
  if (suggestQueryDb.length && suggestQueryTable.length) {
    dispatch(
      queryRun(
        `DESCRIBE ${suggestQueryDb}.${suggestQueryTable}`,
        "system",
        (data) => {
          fetchResult(
            data,
            userPrompt,
            dispatch,
            suggestQueryTable,
            setResponseLoading,
            setResponseError,
            setResult
          );
        }
      )
    );
    setShouldFetchResult(true);
  }
};
