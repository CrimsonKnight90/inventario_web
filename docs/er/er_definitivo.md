erDiagram
    PRODUCT {
      uuid id PK
      text name
      text sku UNIQUE
      uuid category_id FK
      uuid unit_id FK
      boolean is_serialized
      boolean is_perishable
      timestamp created_at
      timestamp updated_at
      timestamp deleted_at
    }

    CATEGORY {
      uuid id PK
      text name UNIQUE
      uuid parent_id FK
      timestamp created_at
      timestamp updated_at
      timestamp deleted_at
    }

    UNIT {
      uuid id PK
      text code UNIQUE
      text description
      numeric precision
      timestamp created_at
      timestamp updated_at
      timestamp deleted_at
    }

    BATCH {
      uuid id PK
      uuid product_id FK
      text code
      date expiration_date
      text origin_type  // supplier|donor|internal
      uuid origin_id    // FK to SUPPLIER or DONOR via PARTY
      boolean quarantined
      timestamp created_at
      timestamp updated_at
      timestamp deleted_at
    }

    PARTY {
      uuid id PK
      text type // supplier|donor
      text name
      text tax_id
      text contact
      timestamp created_at
      timestamp updated_at
      timestamp deleted_at
    }

    SUPPLIER {
      uuid id PK
      uuid party_id UNIQUE FK
    }

    DONOR {
      uuid id PK
      uuid party_id UNIQUE FK
      text project_code
    }

    WAREHOUSE {
      uuid id PK
      text code UNIQUE
      text name
      text address
      boolean is_cold_chain
      timestamp created_at
      timestamp updated_at
      timestamp deleted_at
    }

    LOCATION {
      uuid id PK
      uuid warehouse_id FK
      text code
      text type // shelf|bin|cold_room|dry_area|chem_area
      text path // hierarchical locator
      boolean active
      timestamp created_at
      timestamp updated_at
      timestamp deleted_at
    }

    INVENTORY {
      uuid id PK
      uuid product_id FK
      uuid batch_id FK
      uuid location_id FK
      numeric quantity
      timestamp created_at
      timestamp updated_at
      timestamp deleted_at
    }

    MOVEMENT {
      uuid id PK
      text code UNIQUE
      uuid movement_type_id FK
      uuid product_id FK
      uuid batch_id FK
      uuid from_location_id FK
      uuid to_location_id FK
      uuid cost_center_id FK
      uuid event_id FK
      uuid reason_id FK
      uuid requested_by_user_id FK
      uuid executed_by_user_id FK
      numeric quantity
      text unit_price_currency
      numeric unit_price_amount
      timestamp occurred_at
      timestamp created_at
      timestamp updated_at
      timestamp deleted_at
    }

    MOVEMENT_TYPE {
      uuid id PK
      text code UNIQUE // inbound|outbound|transfer|adjustment
      text description
    }

    MOVEMENT_REASON {
      uuid id PK
      text code UNIQUE // purchase|donation|kitchen|events|hr|office|it|cleaning|external_donation|adjustment
      text description
      boolean requires_approval
    }

    COST_CENTER {
      uuid id PK
      text code UNIQUE
      text name
      timestamp created_at
      timestamp updated_at
      timestamp deleted_at
    }

    EVENT {
      uuid id PK
      text code UNIQUE
      text name
      timestamp start_at
      timestamp end_at
      timestamp created_at
      timestamp updated_at
      timestamp deleted_at
    }

    SERIAL {
      uuid id PK
      uuid product_id FK
      uuid batch_id FK
      text serial_number UNIQUE
      uuid location_id FK
      text status // available|reserved|issued|retired
      timestamp created_at
      timestamp updated_at
      timestamp deleted_at
    }

    RESERVATION {
      uuid id PK
      uuid product_id FK
      uuid batch_id FK
      uuid location_id FK
      uuid event_id FK
      uuid cost_center_id FK
      numeric quantity
      timestamp reserved_from
      timestamp reserved_until
      text status // active|released|fulfilled|expired
      timestamp created_at
      timestamp updated_at
      timestamp deleted_at
    }

    USER {
      uuid id PK
      text username UNIQUE
      text email UNIQUE
      text password_hash
      boolean active
      timestamp created_at
      timestamp updated_at
      timestamp deleted_at
    }

    ROLE {
      uuid id PK
      text code UNIQUE // admin|warehouse|purchasing|kitchen|hr|auditor
      text description
    }

    USER_ROLE {
      uuid user_id FK
      uuid role_id FK
      timestamp assigned_at
      PK "user_id, role_id"
    }

    AUDIT_LOG {
      uuid id PK
      text entity_name
      uuid entity_id
      text action // insert|update|delete|restore
      jsonb changes
      uuid performed_by_user_id FK
      text reason
      timestamp occurred_at
    }

    // Relationships
    PRODUCT ||--o{ BATCH : has
    PRODUCT ||--o{ INVENTORY : stock
    PRODUCT ||--o{ MOVEMENT : involved
    PRODUCT ||--o{ SERIAL : has
    PRODUCT ||--o{ RESERVATION : reserves

    CATEGORY ||--o{ PRODUCT : classifies
    UNIT ||--o{ PRODUCT : measures

    PARTY ||--o| SUPPLIER : is
    PARTY ||--o| DONOR : is
    PARTY ||--o{ BATCH : origin

    WAREHOUSE ||--o{ LOCATION : contains
    LOCATION ||--o{ INVENTORY : holds
    LOCATION ||--o{ SERIAL : holds
    LOCATION ||--o{ RESERVATION : reserves
    LOCATION ||--o{ MOVEMENT : from
    LOCATION ||--o{ MOVEMENT : to

    INVENTORY }o--|| BATCH : by_batch
    MOVEMENT }o--|| BATCH : uses
    SERIAL }o--|| BATCH : from

    MOVEMENT_TYPE ||--o{ MOVEMENT : categorizes
    MOVEMENT_REASON ||--o{ MOVEMENT : explains

    COST_CENTER ||--o{ MOVEMENT : charges
    EVENT ||--o{ MOVEMENT : linked
    COST_CENTER ||--o{ RESERVATION : linked
    EVENT ||--o{ RESERVATION : linked

    USER ||--o{ MOVEMENT : requested_by
    USER ||--o{ MOVEMENT : executed_by
    USER ||--o{ AUDIT_LOG : performed

    ROLE ||--o{ USER_ROLE : grants
    USER ||--o{ USER_ROLE : has

    AUDIT_LOG }o--o{ PRODUCT : audits
    AUDIT_LOG }o--o{ BATCH : audits
    AUDIT_LOG }o--o{ INVENTORY : audits
    AUDIT_LOG }o--o{ MOVEMENT : audits
    AUDIT_LOG }o--o{ LOCATION : audits
    AUDIT_LOG }o--o{ EVENT : audits
    AUDIT_LOG }o--o{ COST_CENTER : audits
    AUDIT_LOG }o--o{ SERIAL : audits
    AUDIT_LOG }o--o{ RESERVATION : audits
