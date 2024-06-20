import { JsonStructure } from "../types/types";

// Function to fetch and transform data
export async function fetchAndTransformData() {
    try {
        const response = await fetch('https://rest-test-eight.vercel.app/api/test');
        const json: JsonStructure = await response.json();
        global.cachedData = parseUrls(json.items.map((item) => item.fileUrl));
    } catch (error) {
        console.error('Error fetching or transforming data:', error);
    } finally {
        global.isFetching = false;
    }
}


// Transform data
function parseUrls(urls: string[]) {
    const result = {};

    urls.forEach(url => {
        const [protocol, , host, ...pathParts] = url.split('/');
        const [ ipAddress ] = host.split(':');
        let currentLevel = result[ipAddress] = result[ipAddress] || [];

        for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i];
            if (part === "") continue; // Skip empty strings
            let nextLevel = currentLevel.find(entry => typeof entry === 'object' && entry[part]);
            if (!nextLevel) {
                nextLevel = { [part]: [] };
                currentLevel.push(nextLevel);
            }
            currentLevel = nextLevel[part];
        }

        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart !== "") { // Add last part if it's not an empty string
            currentLevel.push(lastPart);
        }
    });

    return result;
}