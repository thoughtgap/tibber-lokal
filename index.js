const axios = require('axios');
const https = require('https');

// This agent will bypass SSL verification
const agent = new https.Agent({  
    rejectUnauthorized: false
});

// Constants
const TIBBER_ENDPOINT = process.env.TIBBER_HOST_URL;
const HA_ENDPOINT     = process.env.HA_ENDPOINT;
const HA_TOKEN        = process.env.HA_TOKEN;
const TIBBER_AUTH = {
  username: process.env.TIBBER_USERNAME,
  password: process.env.TIBBER_PASSWORD
};

function extractValues(data) {
  let kwhPattern = /1-0:1\.8\.0\*255\((\d+\.\d+)/;
  let wattPattern = /1-0:16\.7\.0\*255\((\d+\.\d+)/;

  let kwhMatch = data.match(kwhPattern);
  let wattMatch = data.match(wattPattern);

  return {
    kwh: kwhMatch ? parseFloat(kwhMatch[1]) : null,
    watt: wattMatch ? parseFloat(wattMatch[1]) : null
  };
}

async function sendToHA(entity_id, state) {
  const config = {
    headers: {
      'Authorization': `Bearer ${HA_TOKEN}`,
      'Content-Type': 'application/json'
    },
    httpsAgent: agent  // Use the agent to bypass SSL verification
  };

  const payload = {
    state: state,
    attributes: {
      unit_of_measurement: entity_id.includes('_w') ? 'W' : 'kWh',
      device_class: 'energy',
      friendly_name: entity_id.includes('_w') ? 'Tibber Lokal Leistung' : 'Tibber Lokal Zählerstand'
    }
  };

  if (entity_id.includes('_kwh')) {
    payload.attributes.state_class = 'total_increasing';
    payload.attributes.status = 'collecting';
    payload.attributes.icon = 'mdi:counter';
  }


  await axios.post(`${HA_ENDPOINT}${entity_id}`, payload, config);

let lastRequestFailed = false;

async function pollAndSend() {
  try {
    const response = await axios.get(TIBBER_ENDPOINT, {
      auth: TIBBER_AUTH,
      httpsAgent: agent  // Use the agent to bypass SSL verification for Tibber
    });

    const values = extractValues(response.data);

    // Logging the extracted values
    console.log("Polled Tibber:");
    if (values.kwh) {
      console.log(`kWh Value: ${values.kwh}`);
    } else {
      console.log(`kWh Value not found.`);
    }
    if (values.watt) {
      console.log(`Watt Value: ${values.watt}`);
    } else {
      console.log(`Watt Value not found.`);
    }

    if (values.kwh) {
      await sendToHA('sensor.tibber_lokal_kwh', values.kwh);
    }

    if (values.watt) {
      await sendToHA('sensor.tibber_lokal_w', values.watt);
    }
    lastRequestFailed = false; // Reset the flag on a successful request

  } catch (error) {
    console.error('Error occurred:', error.message);
    lastRequestFailed = true;
  }

  if (lastRequestFailed) {
    console.log('Waiting 10sec longer due to a failed request...');
    setTimeout(pollAndSend, 10000); // Wait for 10 seconds if the request failed
  } else {
    setTimeout(pollAndSend, 2000); // Otherwise, wait for 2 seconds
  }
}

// Poll Tibber every 2 seconds
pollAndSend();
