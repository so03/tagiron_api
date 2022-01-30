17:30 ~ 

POST /players
```
curl -X POST localhost:3000/players -d '{ "name": "sasaki" }' -H 'Content-Type: application/json' --verbose
```

POST /start
```
```

GET /game
```
curl localhost:3000/game -H 'Content-Type: application/json' -H 'Authorization: uuid test-uuid' --verbose
```


POST /players/1/declare



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