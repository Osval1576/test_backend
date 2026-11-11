# orders-service

Microservicio de órdenes hecho con NestJS, PostgreSQL y NATS.

Permite crear órdenes y cambiar su estatus. Cuando se crea una orden publica `order.created` en NATS, y cuando se marca como pagada publica `order.paid`.

Las respuestas de las otras partes del examen están en `RESPUESTAS.md`.

## Levantar el proyecto

```
docker compose up --build
```

Levanta el servicio en el puerto 3000, PostgreSQL y NATS. Las tablas se crean con `db/init.sql`.

## Endpoints

- `POST /orders` crea una orden
- `GET /orders/:id` consulta una orden
- `PATCH /orders/:id/status` cambia el estatus (PAID, SHIPPED, CANCELLED)

Ejemplo:

```
curl -X POST http://localhost:3000/orders -H "Content-Type: application/json" -d '{"customerId":"6f1c2a4e-8a3b-4c1d-9e2f-0a1b2c3d4e5f","items":[{"product":"Caja","quantity":2,"price":100}]}'

curl -X PATCH http://localhost:3000/orders/<id>/status -H "Content-Type: application/json" -d '{"status":"PAID"}'
```
