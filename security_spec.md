# Security Specification for Digital Masjid System

This document outlines the security architecture, data invariants, and access control policies for the Digital Masjid System's Firestore database, conforming to Zero-Trust and Least-Privilege access.

## 1. Core Data Invariants

- **Masjid Resource Identity**: All sub-resources (Donations, Madad Requests, Hadiths, Notifications, and Live Azan Signals) MUST be bound to a existing, valid `masjidId` parameter.
- **Role-Based Privilege Boundaries**: Ordinary members or guest users MUST NOT escalate their role to `admin` or approve themselves. All modifications to user records that touch roles or approvals MUST be gated strictly to authorized mosque managers (admins) or system processes.
- **Ledger Immutability**: Critical transaction structures like `donations` are read-only write-once records; they can never be modified or deleted after execution.
- **PII Isolation**: Financial madad requests containing Aadhar cards, bank account details, and full family credentials MUST NOT be accessible to standard members or guest users. Access to view them is bounded to verified `admin` profiles affiliated with that specific `masjidId`.
- **Temporal Veracity**: Creation and modification times MUST match the server's time (`request.time`) precisely to prevent timing attacks.

---

## 2. The "Dirty Dozen" Hack Payloads

These 12 scenarios highlight attempts to bypass validation, privilege boundaries, or inject corrupted content. Our rules will reject all of these with `PERMISSION_DENIED`.

### P1: Role Escalation Attack
A standard user attempts to register or modify their profile with `role: "admin"`.
```json
{
  "uid": "victim_uid",
  "name": "Attacker User",
  "role": "admin",
  "masjidId": "m1",
  "approved": true
}
```

### P2: Self-Approval Bypass
An unapproved user attempts to mark themselves as `approved: true`.
```json
{
  "uid": "attacker_uid",
  "name": "Unapproved Attacker",
  "role": "member",
  "masjidId": "m1",
  "approved": true
}
```

### P3: Anonymous Write Injection
An unauthenticated guest (where `request.auth == null`) tries to write a Hadith.
```json
{
  "id": "hadith_999",
  "text": "Fake Hadith Text",
  "reference": "Unknown Reference",
  "date": "2026-05-28",
  "masjidId": "m1"
}
```

### P4: Ledger Tampering (Donation Modification)
An authorized user tries to modify an existing donation amount downwards.
```json
{
  "id": "d_seed1",
  "donorName": "Anas Qureshi",
  "amount": 10,
  "category": "imam_salary",
  "date": "2026-05-10T10:30:00Z",
  "masjidId": "m1"
}
```

### P5: Ledger Erasure (Donation Deletion)
An admin or member tries to delete an existing donation document to clear ledger logs.
```action
DELETE /donations/d_seed1
```

### P6: PII Leak Scavenging (Massive Read on Madad Requests)
A standard member tries to query and fetch all madad requests from other poor village residents.
```action
LIST /madadRequests WHERE masjidId == "m1"
```

### P7: Status Hijack on Madad Requests
A petitioner tries to update their pending help request to `approved` dynamically.
```json
{
  "id": "mr_seed1",
  "name": "Bashir Ahmad",
  "fatherName": "Karamat Ahmad",
  "aadhar": "7890 1234 5678",
  "bankAccount": "98765432101",
  "ifsc": "SBIN0004561",
  "reason": "Marriage Help",
  "amountNeeded": 12000,
  "status": "approved",
  "masjidId": "m1",
  "returnedAmount": 0
}
```

### P8: Path Injection (Denial of Wallet / Long ID Attacks)
An attacker injects a 2KB junk string as a document ID to bloat indexed resources or costs.
```action
CREATE /masjids/LONG_JUNK_ID_STRING_REPEATED_200_TIMES...
```

### P9: Fake Azan Broadcast Overlap
A general user attempts to post or overwrite the `liveAzanSignals` indicating that an Azan is live.
```json
{
  "id": "m1",
  "isLive": true,
  "startedAt": "2026-05-28T19:12:00Z",
  "audioData": "fake_audio_stream"
}
```

### P10: Non-Existent Masjid Relation
An attacker attempts to create a donation relating to a fake masjid ID `m_fake_999` which does not exist in the database.
```json
{
  "id": "donation_xyz",
  "donorName": "Attacker",
  "amount": 200,
  "category": "electricity",
  "date": "2026-05-28",
  "masjidId": "m_fake_999"
}
```

### P11: Timestamp Forgery (Backdating)
An admin attempts to create an announcement backdated to 2010.
```json
{
  "id": "notif_101",
  "title": "Fake Old Announcement",
  "body": "This happened in the past",
  "timestamp": "2010-01-01T00:00:00Z",
  "masjidId": "m1"
}
```

### P12: Massive String Overflow (Denial of Service)
A user tries to set their name field to a 10MB string.
```json
{
  "uid": "user_123",
  "name": "A_VERY_LONG_STRING_OF_10_MILLION_CHARACTERS...",
  "role": "member",
  "masjidId": "m1"
}
```

---

## 3. The Test Runner Reference

These conditions are statically and dynamically verified. Let's build our `firestore.rules` file next, implementing these restrictions safely.
