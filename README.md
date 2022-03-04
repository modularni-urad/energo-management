# modularni-urad-energo-management

API pro energetický management.

## SETTINGS

Pouze pomocí ENVIRONMENT VARIABLES.

## DB

[DB model](./migrations/) is as simple as possible.
It reflects fact, that each sensor sends periodically a value of a type.
In TTN sensor is identified by app_id and dev_id,
so there is [devices table](./migrations/20190403_devices.js) with autogen int id.

The [data DB schema](./migrations/20191023_envirodata.js) is following:
- devid: integer (foreign key to devices.id)
- typ: string
- value: float
- time: timestamp
- counter: integer from senzor

## usage

Data can be queried via API that supports [loopback.io like where filter](https://loopback.io/doc/en/lb2/Where-filter).
The contition is a JSON specifying values for search, e.g. following sample:
```
FILTER='{"devid":1,"typ":"temp","time":{">":"2019-11-20T16:32:52.200Z"}}'
URL="http://data.mutabor.cz:2300/data?filter=$FILTER"
wget -qO - $URL | json_pp
```
Queries temperature (temp) data from device with id:1 that are older than 2019-11-20T16:32:52.200Z.

You can use fields param for specifying which fields you want to get.
E.g. only value,time:
```
URL="http://data.mutabor.cz/data?filter=$FILTER&fields=value,time"
wget -qO - $URL | json_pp
```

## Inserting

### automatically

Through integration from IOT platforms.

### manually

Through application scanning QR code on meters.
https://github.com/schmich/instascan