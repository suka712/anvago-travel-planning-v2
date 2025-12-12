import { Router } from 'express';
import { getWeather } from '../services/weather.js';
import { getTraffic } from '../services/traffic.js';

const router = Router();

// GET /external/weather/:city
router.get('/weather/:city', async (req, res, next) => {
  try {
    const weather = await getWeather(req.params.city);
    
    res.json({
      success: true,
      data: weather,
    });
  } catch (error) {
    next(error);
  }
});

// GET /external/traffic/:city
router.get('/traffic/:city', async (req, res, next) => {
  try {
    const traffic = await getTraffic(req.params.city);
    
    res.json({
      success: true,
      data: traffic,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

