CREATE TABLE orders (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id  UUID          NOT NULL,
    status       VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    total        NUMERIC(12,2) NOT NULL,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    paid_at      TIMESTAMPTZ,
    CONSTRAINT ck_orders_status CHECK (status IN ('PENDING', 'PAID', 'SHIPPED', 'CANCELLED')),
    CONSTRAINT ck_orders_total  CHECK (total >= 0)
);

CREATE TABLE order_items (
    id        SERIAL        PRIMARY KEY,
    order_id  UUID          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product   VARCHAR(100)  NOT NULL,
    quantity  INT           NOT NULL CHECK (quantity > 0),
    price     NUMERIC(12,2) NOT NULL CHECK (price >= 0)
);

CREATE INDEX ix_orders_created_at ON orders (created_at);
CREATE INDEX ix_orders_paid_at ON orders (paid_at) WHERE paid_at IS NOT NULL;
CREATE INDEX ix_order_items_order ON order_items (order_id);
