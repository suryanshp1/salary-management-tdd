# Design Decisions

## 1. Synchronous vs Asynchronous SQLAlchemy

**Decision**: Synchronous SQLAlchemy with `psycopg2`

**Why not async?**
- The bottleneck in this application is the database, not Python's event loop
- Sync code is simpler to test, debug, and reason about
- Async adds complexity with session management (`expire_on_commit`, context managers)
- For 10k employees with proper indexing, query times are <10ms — async overhead isn't justified

**Trade-off**: Under extreme concurrent load (1000+ simultaneous requests), async would perform better. For an HR tool used by a handful of HR managers, sync is the right choice.

## 2. UUID vs Auto-Increment Primary Keys

**Decision**: UUID v4 primary keys

**Why?**
- No sequential ID enumeration (security)
- Safe for distributed systems / sharding
- Client can generate IDs before server round-trip
- No information leakage about record count

**Trade-off**: UUIDs are 128-bit vs 32-bit integers — slightly larger indexes. At 10k records, this is negligible.

## 3. Soft Delete vs Hard Delete

**Decision**: Soft delete (`is_active = False`)

**Why?**
- HR compliance: employee records should not be permanently destroyed
- Audit trail preservation
- Easy undo/restore functionality
- Analytics remain accurate over time

**Trade-off**: Queries must filter `WHERE is_active = TRUE`. Handled at the repository layer.

## 4. shadcn/ui vs MUI vs Custom CSS

**Decision**: Custom CSS (vanilla) with modern design system

**Why?**
- Full control over aesthetics
- No dependency bloat
- Demonstrates CSS engineering skill
- Dark theme with glassmorphism effects wouldn't be easy to achieve with MUI's opinions

**Trade-off**: More CSS to write and maintain. Worth it for a polished, distinctive UI.

## 5. TanStack Query vs Redux / Zustand

**Decision**: TanStack Query for all server state

**Why?**
- Purpose-built for server state (caching, refetching, stale-while-revalidate)
- Eliminates boilerplate compared to Redux + thunks
- Automatic background refetching keeps UI fresh
- Optimistic updates for instant feel
- No separate store setup needed

**Trade-off**: Client-only state still uses React useState. For this app, that's sufficient.

## 6. Server-Side Pagination vs Client-Side

**Decision**: Server-side pagination

**Why?**
- 10,000 employees is too many for the client to hold in memory
- Network efficiency: transfer only 20-50 records per page
- Database does the heavy lifting (OFFSET/LIMIT with indexes)
- Consistent performance regardless of dataset size

## 7. Bulk Insert Strategy

**Decision**: SQLAlchemy Core `insert()` with pre-computed dictionaries

**Why?**
- ORM `session.add()` in a loop: ~15-25s for 10k (one round-trip per record)
- ORM `bulk_save_objects`: ~3-8s (skips state tracking)
- Core `insert()`: ~1-3s (auto-batched, minimal overhead)
- PostgreSQL `COPY`: ~0.5s (fastest, but bypasses SQLAlchemy entirely)

Core `insert()` is the sweet spot: fast enough (<5s target) while keeping SQLAlchemy's type safety.

## 8. Test Database: SQLite vs PostgreSQL

**Decision**: SQLite in-memory for unit tests, PostgreSQL for integration/CI

**Why?**
- Unit tests must run without Docker (`python -m pytest`)
- SQLite in-memory is instant — no startup, no cleanup
- CI uses PostgreSQL service for production parity
- Repository tests cover query logic; SQL dialect differences are minimal for this app

**Trade-off**: Some PostgreSQL-specific features (like `percentile_cont` for median) need fallbacks in SQLite tests.

## 9. Salary Storage: USD vs Multi-Currency

**Decision**: Store in original currency with `currency` field

**Why?**
- Salary data is most meaningful in local currency
- Currency conversion rates fluctuate — storing in USD loses accuracy
- Display can convert as needed
- Seeded data uses USD for simplicity; real app would need conversion API

## 10. Employee ID Format

**Decision**: Human-readable format `EMP-00001` alongside UUID

**Why?**
- HR managers need a quick reference ID for phone calls, emails, reports
- UUID is for API/system use
- Auto-incrementing numeric part is generated from MAX query
- Padded to 5 digits (supports up to 99,999 employees)
