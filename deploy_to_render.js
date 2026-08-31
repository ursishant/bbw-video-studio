const axios = require('axios');

const RENDER_API_KEY = 'rnd_nLEbeZpxkP50PCtzQhoqRpzJSmvt';
const OWNER_ID = 'tea-da0lml0jo6nc73er4bbg';
const REPO_URL = 'https://github.com/ursishant/bbw-video-studio';

async function deployService() {
  console.log('=== 1. Creating Web Service on Render ===');
  
  const payload = {
    type: 'web_service',
    name: 'bbw-video-studio',
    ownerId: OWNER_ID,
    repo: REPO_URL,
    branch: 'main',
    autoDeploy: 'yes',
    serviceDetails: {
      env: 'docker',
      plan: 'free',
      region: 'oregon',
      dockerfilePath: './Dockerfile',
      envVars: [
        { key: 'PORT', value: '3000' },
        { key: 'PUPPETEER_EXECUTABLE_PATH', value: '/usr/bin/chromium' },
        { key: 'CHROME_BIN', value: '/usr/bin/chromium' }
      ]
    }
  };

  try {
    const res = await axios.post('https://api.render.com/v1/services', payload, {
      headers: {
        Authorization: `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const service = res.data.service;
    console.log('✅ Service created successfully on Render!');
    console.log(`Service ID: ${service.id}`);
    console.log(`Service Name: ${service.name}`);
    console.log(`Live Dashboard URL: ${service.dashboardUrl}`);
    console.log(`Permanent Web URL: ${service.serviceDetails.url}`);

    console.log('\n=== 2. Triggering Initial Deployment ===');
    const deployRes = await axios.post(`https://api.render.com/v1/services/${service.id}/deploys`, {}, {
      headers: {
        Authorization: `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`Deploy Triggered! Deploy ID: ${deployRes.data.id}`);
    console.log(`Status: ${deployRes.data.status}`);

    return {
      serviceId: service.id,
      dashboardUrl: service.dashboardUrl,
      liveUrl: service.serviceDetails.url
    };
  } catch (error) {
    if (error.response) {
      console.error('Render API Error:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

deployService().catch(console.error);
