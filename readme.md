2022/01/30 17:30 ~ 18:42 => 01:12
2022/01/30 23:06 ~ 23:16 => 00:10
2022/01/30 23:38 ~ 23:56 => 00:18 shellコマンド調べていたので時間がかかった
2022/01/30 12:17 ~ 12:34 => 00:17
2022/01/31 22:34 ~ 23:14 => 00:40 jest導入に少し時間がかかった
2022/01/31 23:40 ~ 23:50 => 00:10 
2022/02/03 22:52 ~ 22:59 => 00:07
2022/02/07 21:49 ~ 22:00 => 00:11

total 03:05

Run
```
yarn serve
```

Test
```
yarn test
```


POST /players
```
curl -X POST localhost:3000/players -d '{ "name": "sasaki" }' -H 'Content-Type: application/json' --verbose
```

POST /init
```
curl -X POST localhost:3000/players -d '{ "name": "sasaki" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "sawada" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "sakai" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "saeki" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/init -H 'Content-Type: application/json' --verbose
```

GET /game
```
uuid=$(curl -sb -X POST localhost:3000/players -d '{ "name": "sasaki" }' -H 'Content-Type: application/json' --verbose | jq '.uuid' | sed 's/"//g' | awk '{print $1}') &&
curl -X POST localhost:3000/players -d '{ "name": "sawada" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "sakai" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "saeki" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/init -H 'Content-Type: application/json' --verbose
curl localhost:3000/game -H 'Content-Type: application/json' -H "Authorization: uuid $uuid" --verbose
```

POST /declare
```
uuid=$(curl -sb -X POST localhost:3000/players -d '{ "name": "sasaki" }' -H 'Content-Type: application/json' --verbose | jq '.uuid' | sed 's/"//g' | awk '{print $1}') &&
curl -X POST localhost:3000/players -d '{ "name": "sawada" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "sakai" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "saeki" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/init -H 'Content-Type: application/json' --verbose
curl -X POST localhost:3000/declare -d \
'{ "cards": [{ "number": 1, "color": "red" }, { "number": 2, "color": "red" }, { "number": 3, "color": "red" }, { "number": 4, "color": "red" }]}' \
-H 'Content-Type: application/json' -H "Authorization: uuid $uuid" --verbose
```

GET /result
```
uuid=$(curl -sb -X POST localhost:3000/players -d '{ "name": "sasaki" }' -H 'Content-Type: application/json' --verbose | jq '.uuid' | sed 's/"//g' | awk '{print $1}') &&
curl -X POST localhost:3000/players -d '{ "name": "sawada" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "sakai" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "saeki" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/init -H 'Content-Type: application/json' --verbose
curl -X POST localhost:3000/declare -d \
'{ "cards": [{ "number": 1, "color": "red" }, { "number": 2, "color": "red" }, { "number": 3, "color": "red" }, { "number": 4, "color": "red" }]}' \
-H 'Content-Type: application/json' -H "Authorization: uuid $uuid" --verbose
curl localhost:3000/result \
-H 'Content-Type: application/json' --verbose
```

GET /valid
valid example
```
curl localhost:3000/valid -H 'Content-Type: application/json' -H 'Authorization: uuid test-uuid' --verbose
```
invalid example
```
curl localhost:3000/valid -H 'Content-Type: application/json' -H 'Authorization: uuid hogehoge' --verbose
```