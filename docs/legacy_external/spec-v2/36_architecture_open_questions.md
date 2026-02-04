# Architecture Open Questions

**Source Documents**: open_questions.md, all legacy spec files

## ✅ RESOLVED DECISIONS

### 1. Event Lifecycle Management ✅

**Question**: How should multiple read-a-thon cycles be handled?

**RESOLVED**: Option A - One active event per school at a time, with archived events viewable but read-only.

### 2. Student Identifier Generation ✅

**Question**: What format should be used for student/child sponsor IDs?

**RESOLVED**: 10-character random alphanumeric codes, persistent across years for historical tracking.

**Implementation**:
```php
function generateChildSponsorId(): string {
    do {
        $code = strtoupper(Str::random(10)); // Updated to 10 chars
    } while (ChildProfile::where('sponsor_code', $code)->exists());
    
    return $code;
}
```

### 3. Reading Time Validation ✅

**Question**: What are the business rules for reading entry validation?

**RESOLVED**:
- Max 16 hours/day (960 minutes)
- >8 hours requires parent email approval before acceptance
- Parents can backdate entries indefinitely
- No future dates allowed
- Admin-configurable thresholds

### 4. Pledge Amount Limits ✅

**Question**: What are the acceptable ranges for pledge amounts?

**RESOLVED**:
- **Flat pledges**: $0.00 or ≥$1.00 (no amounts between)
- **Per-minute pledges**: ≥$0.01/minute
- **Collection**: Skip collecting final totals <$1.00 but show pledges
- **Review thresholds**: >$750 flat or >$5.00/minute flagged for admin review
- **All thresholds**: Admin-configurable in event settings

### 5. Student Authentication ✅

**Question**: Should students have login capability?

**RESOLVED**: Optional parent-controlled student login
- Parents enable/disable per child
- Students can log reading time if enabled
- No independent child authentication without parent permission

### 6. Sponsor Access Method ✅

**Question**: How should sponsors access children to make pledges?

**RESOLVED**: Hybrid approach
- **Email invitations**: Secure tokens sent to specific emails (grandparent-friendly)
- **Public share links**: Parent-generated memorable codes for social media
- **No random codes**: Eliminates confusion while maintaining security

### 7. Privacy Policy Acknowledgment ✅

**Question**: What does the privacy field control?

**RESOLVED**: Privacy field tracks parental acknowledgment of privacy policy, not child visibility settings.

## REMAINING OPEN QUESTIONS

### 8. Grade Level Progression

**Question**: How are students promoted between grades?

**Options**:
- A) Manual update by parents each year
- B) Automatic progression based on date
- C) Bulk update by administrators
- D) Template for new school year

**Recommended Default**: Option A with Option C - Parents update during re-enrollment, admins can bulk update.

### 9. Child Visibility Settings

**Question**: How should child visibility on leaderboards be controlled?

**Options**:
- All children visible by default
- Separate visibility setting per child
- Only first name + last initial shown
- No public leaderboards (family/class only)

**Recommended Default**: No public leaderboards (matches current requirement)

### 10. Teacher Account Creation

**Question**: How are teacher accounts provisioned?

**Options**:
- A) Self-registration with school code
- B) Admin creates and invites
- C) Bulk import from CSV
- D) SSO integration (future)

**Recommended Default**: Option B with Option C - Admin-managed with bulk import capability.

### 8. Payment Reconciliation

**Question**: How to handle payments made outside Square?

**Legacy Gap**: No clear process for cash/check payments.

**Recommended Implementation**:
- Manual payment entry form for admins
- Tracks payment method (cash/check/other)
- Creates payment record without Square IDs
- Updates pledge statuses
- Includes in financial reports

### 9. Email Communication Rules

**Question**: What controls email frequency and unsubscribe?

**Unknowns**:
- Reminder frequency limits?
- Unsubscribe granularity?
- Parent consent for child mentions?

**Recommended Defaults**:
- Max 1 payment reminder per week
- Unsubscribe by category (transactional/marketing/reminders)
- No child names in sponsor emails without consent

### 10. Data Retention Policy

**Question**: How long should different data types be retained?

**GDPR/COPPA Requirements**: Must have defined retention.

**Recommended Defaults**:
- Reading logs: 2 years
- Completed events: 3 years
- Payment records: 7 years (tax)
- Audit logs: 1 year
- Child profiles: 1 year after last event
- Deleted account data: 30 days (soft delete)

### 11. Session Timeout

**Question**: How long should user sessions last?

**Security vs Convenience Trade-off**:

**Recommended Defaults**:
- Session lifetime: 2 hours of activity
- Remember me: 30 days
- Payment pages: 20 minutes timeout
- Admin sessions: 1 hour

### 12. Concurrent Event Registrations

**Question**: Can a child be enrolled in multiple schools' events?

**Edge Cases**:
- Families with children in different schools
- School transfers mid-event

**Recommended Default**: Yes, but one enrollment per child per event.

### 13. Refund Processing

**Question**: What is the refund policy and process?

**Unknowns**:
- Who can initiate refunds?
- Time limits on refunds?
- Partial refunds allowed?

**Recommended Implementation**:
- Only super_admin can process
- Within 60 days of payment
- Full refunds only
- Updates pledge status to 'refunded'
- Maintains audit trail

### 14. Duplicate Family Detection

**Question**: How to prevent/handle duplicate family accounts?

**Recommended Implementation**:
- Check email uniqueness (existing)
- Warning if same child name exists
- Admin tool to merge accounts
- Prevent duplicate child names within family

### 15. School Timezone Handling

**Question**: How to handle schools in different timezones?

**Recommended Implementation**:
- Store school timezone in School model
- All dates displayed in school's timezone
- Reading entry dates in school timezone
- Payment processing in UTC

### 16. Mobile Responsiveness Requirements

**Question**: What devices must be supported?

**Recommended Minimums**:
- Desktop: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile: iOS Safari 14+, Chrome Mobile
- Tablet: iPad Safari, Android Chrome
- Minimum viewport: 320px wide

### 17. Bulk Operations

**Question**: What bulk operations should be supported?

**Recommended Features**:
- Bulk reading log import (CSV)
- Bulk student enrollment
- Bulk grade progression
- Bulk email sending (existing)
- Bulk payment reminders (existing)

### 18. Reporting Granularity

**Question**: What report types and filters are required?

**Recommended Reports**:
- Participation by grade/class
- Reading progress over time
- Payment status summary
- Top readers (respecting privacy)
- Financial reconciliation
- Sponsor engagement

### 8. Video Feature Scope ✅

**Question**: Is Pajama Jamboree video feature still needed?

**RESOLVED**: Defer to Phase 2, teacher-managed at class level if implemented (not school-wide)

## REMAINING OPEN QUESTIONS

**Recommended Decision**: Defer to Phase 2 unless explicitly required.

### 20. Test Environment

**Question**: How to handle testing with Square integration?

**Recommended Setup**:
- Separate Square sandbox account
- Test data seeding commands
- Webhook testing via ngrok locally
- Staging environment on SiteGround subdomain

## Implementation Priority

### Must Resolve Before Development
1. Reading time validation rules (#3)
2. Pledge amount limits (#4)
3. Privacy level implementation (#6)
4. Data retention policy (#10)
5. School timezone handling (#15)

### Can Decide During Development
- Grade progression (#5)
- Teacher provisioning (#7)
- Email rules (#9)
- Session timeout (#11)
- Duplicate detection (#14)

### Can Defer to Phase 2
- Video features (#19)
- SSO integration
- Advanced reporting
- Mobile app
- Multi-language support