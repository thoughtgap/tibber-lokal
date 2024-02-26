# :warning: Repository Inactive
This repository is no longer active. Use this instead: [ha-tibber-pulse-local repository](https://github.com/marq24/ha-tibber-pulse-local)
---

# tibber-lokal
Fetches Tibber Data (Meter, Power) locally from Tibber Pulse IR and posts to Home Assistant

## Prerequisites
Pulse Bridge Webserver needs to be enabled.

## Pulse SML Data
Mine look like this:

````
/EBZ5DD32R06ETA_107
1-0:0.0.0*255(1EBZXXXXXXXXXX)
1-0:96.1.0*255(1EBZXXXXXXXXXX)
1-0:1.8.0*255(001000.08053368*kWh)
1-0:2.8.0*255(000001.17000000*kWh)
1-0:16.7.0*255(000372.53*W)
1-0:36.7.0*255(000246.15*W)
1-0:56.7.0*255(000053.04*W)
1-0:76.7.0*255(000073.34*W)
1-0:32.7.0*255(227.5*V)
1-0:52.7.0*255(232.2*V)
1-0:72.7.0*255(228.2*V)
1-0:96.5.0*255(XXXXXXXX)
0-0:96.8.0*255(XXXXXXXX)
!
````

## Environment Variables
```
TIBBER_USERNAME=admin
TIBBER_PASSWORD=QR Code from Pulse Bridge
HA_TOKEN=Long Lived Home Assistant Token
HA_ENDPOINT=http://<home assistant url>:8123/api/states/
TIBBER_HOST_URL=http://tibber-host/data.json?node_id=<your node ID, usually 1 or 2>
````
