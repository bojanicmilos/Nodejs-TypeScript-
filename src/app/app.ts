import express, { Request, Response } from 'express';
import schedule from 'node-schedule';
import { fetchAndTransformData } from '../utils/helper-functions';

const app = express();
const PORT = 1500;

global.cachedData = null; // To store the cached data
global.isFetching = false; // To prevent multiple simultaneous fetches in case API call is too long


// Schedule the data fetching every 10 minutes
schedule.scheduleJob('*/10 * * * *', () => {
    if (!global.isFetching) {
        global.isFetching = true;
        fetchAndTransformData();
    }
});

// Initial fetch
fetchAndTransformData();

// endpoint
app.get('/api/files', async (req: Request, res: Response) => {
    if (global.cachedData) {
        res.json(global.cachedData);
    } else {
        res.status(503).send({ error: 'Service unavailable. Data is being fetched.' });
    }
  });
  
app.listen(PORT, () => {
    console.log(`Express application running on port ${PORT}`);
});