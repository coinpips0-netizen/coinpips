# Security Specification for COINPIPS

## Data Invariants
1. A user profile document `/users/{userId}` can only be read and written by the authenticated owner (`request.auth.uid == userId`) or an admin.
2. Watchlist items `/users/{userId}/watchlist/{symbol}` are strictly scoped to the owner (`request.auth.uid == userId`).
3. Market signals `/signals/{signalId}` are readable by authenticated users; modifications are restricted to admins or backend service.
4. Support tickets `/supportTickets/{ticketId}` can be created by authenticated users where `incoming().userId == request.auth.uid`. Users can only view their own tickets; admins can view and update all tickets.
5. All document writes must satisfy strict type, size, and allowed key constraints to prevent shadow fields and resource injection attacks.

## The Dirty Dozen Payloads (Targeting Rejection)
1. Shadow update with ghost fields on UserProfile (`{ isSuperUser: true }`).
2. Spoofed owner UID on UserProfile create (`uid: "other_user"`).
3. Oversized string payload (1MB string in `displayName`).
4. Watchlist write by unauthenticated client.
5. Watchlist item created in another user's subcollection path.
6. Regular user attempting to update or delete a market signal.
7. Support ticket created with mismatched `userId`.
8. Support ticket with oversized message (> 1000 characters).
9. Signal document created with illegal direction enum (`"MOON"`).
10. Malformed document ID with invalid characters.
11. Privilege escalation attempting to set arbitrary admin flag.
12. Blanket query listing all users from client without proper authorization.
