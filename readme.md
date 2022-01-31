2022/01/30 17:30 ~ 18:42 => 01:12
2022/01/30 23:06 ~ 23:16 => 00:10
2022/01/30 23:38 ~ 23:56 => 00:18 (shellコマンド調べていたので時間がかかった)
2022/01/30 12:17 ~ 

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



GET /hello

GET /valid
valid example
```
curl localhost:3000/valid -H 'Content-Type: application/json' -H 'Authorization: uuid test-uuid' --verbose
```
invalid example
```
curl localhost:3000/valid -H 'Content-Type: application/json' -H 'Authorization: uuid hogehoge' --verbose
```