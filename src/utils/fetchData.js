/*^ =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/
/*^ RapidAPI Fetch Config -=-=-=-=-=-=-=-=-=*/
/*^ =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/

const API_HOST = "exercisedb.p.rapidapi.com";
const API_KEY = process.env.REACT_APP_RAPIDAPI_KEY;

export const searchParam = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": API_HOST,
  },
};

/*^ =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/
/*^ Fetch Helper -=-=-=-=-=-=-=-=-=-=-=-=-=-*/
/*^ =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/

export const fetchData = async (url, options = searchParam) => {
  if (!API_KEY) {
    throw new Error("RapidAPI key is missing. Check your .env file.");
  }

  try {
    const response = await fetch(url, options);

    let data;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        data,
      });

      throw new Error(
        data?.message ||
          `API request failed (${response.status} ${response.statusText})`
      );
    }

    return data;
  } catch (error) {
    console.error("Fetch failed:", error.message);
    throw error;
  }
};
