# Book Barcode Scanning Feature

**Status**: Planned Enhancement  
**Target**: Laravel + Inertia + Vue 3 Rebuild

## Overview

Optional ISBN barcode scanning feature for the reading log entry flow. Allows parents, teachers, and students to scan book barcodes to auto-fill title, author, and cover image data while preserving existing manual entry workflows.

## Technical Constraints

- **Frontend**: Vue 3 with Inertia.js (existing stack)
- **Backend**: Laravel (existing stack)
- **Database**: MySQL/MariaDB (SiteGround compatible)
- **Payments**: Square (unchanged)

## Implementation Requirements

### A) Frontend Scanning (Vue 3)

#### Barcode Scanner Component
**File**: `resources/js/Components/BookScanner.vue`

**Dependencies**:
- Primary: `@zxing/browser` (ZXing library)
- Fallback: `quagga` (QuaggaJS) if ZXing incompatible

**Props**:
```javascript
{
  onBookFound: Function,     // Callback when book data retrieved
  onError: Function,         // Error handling callback
  disabled: Boolean          // Disable scanner
}
```

**Features**:
- Camera-based barcode scanning
- Manual ISBN input fallback
- Loading states and error handling
- Camera permission management

#### Integration Points
**Page**: `resources/js/Pages/ReadingLogs/Create.vue`

**UI Entry Points**:
1. **"Scan Barcode" Button** - Opens camera scanner
2. **"Search by ISBN" Input** - Manual ISBN entry
3. **Manual Entry Fields** - Existing title/author inputs (preserved)

**Workflow**:
1. User clicks "Scan Barcode" or enters ISBN
2. Component calls `GET /api/books/lookup?isbn={isbn}`
3. Display returned metadata with "Use this book" confirmation
4. Auto-fill form fields if user confirms

### B) Backend Lookup (Laravel)

#### API Endpoint
**Route**: `GET /api/books/lookup`

**Parameters**:
- `isbn` (required): ISBN-10 or ISBN-13 string

**Validation**:
- ISBN format validation (10-17 characters)
- Normalization to 13-digit format
- Remove hyphens and spaces

**External Service Integration**:
- **Primary**: Open Library ISBN API
  - Endpoint: `https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data`
  - Cover images: `https://covers.openlibrary.org/b/isbn/{isbn}-{size}.jpg`
- **Rate Limiting**: 30 requests per minute per IP
- **Caching**: 7 days via Laravel cache

**Response Format**:
```json
{
  "success": true,
  "data": {
    "isbn": "9780123456789",
    "title": "Example Book Title",
    "authors": "Author Name, Co-Author Name",
    "cover_url": "https://covers.openlibrary.org/b/isbn/9780123456789-M.jpg"
  }
}
```

#### Service Class
**File**: `app/Services/BookLookupService.php`

**Methods**:
- `lookupByISBN(string $isbn): array`
- `validateISBN(string $isbn): string`
- `normalizeISBN(string $isbn): string`
- `fetchFromOpenLibrary(string $isbn): array`

### C) Data Model Changes

#### ReadingLog Model Updates
**Database Migration**: Add optional fields to `reading_logs` table

**New Fields**:
- `book_isbn` (varchar(13), nullable) - Normalized ISBN-13
- `book_cover_url` (varchar(500), nullable) - External cover image URL

**Validation Rules**:
- ISBN: 13-digit numeric string
- Cover URL: Must be from approved domains (Open Library, etc.)
- All book fields remain optional

**Option 1: Denormalized Storage** (Recommended)
Store book data directly in `reading_logs` table:
- Preserves current functionality
- Minimal complexity
- No additional joins required

### D) Integration with Existing Flow

#### ReadingLog Controller Updates
**File**: `app/Http/Controllers/ReadingLogController.php`

**Enhanced Validation**:
```php
$request->validate([
    // Existing fields
    'enrollment_id' => 'required|exists:enrollments,id',
    'minutes_read' => 'required|integer|min:0|max:960',
    'reading_date' => 'required|date',
    
    // Enhanced book fields
    'book_title' => 'nullable|string|max:255',
    'book_author' => 'nullable|string|max:255',
    'book_isbn' => 'nullable|string|regex:/^\d{13}$/',
    'book_cover_url' => 'nullable|url|regex:/^https:\/\/(covers\.openlibrary\.org)\/.*/'
]);
```

**Preserved Functionality**:
- All existing manual entry still works
- Book fields remain optional
- No changes to required fields
- Existing validation rules maintained

### E) Testing Strategy

#### Backend Unit Tests
**File**: `tests/Unit/BookLookupServiceTest.php`

**Test Cases**:
- Valid ISBN-10 → normalized ISBN-13 and book data
- Valid ISBN-13 → book data returned
- Invalid ISBN → ValidationException
- Book not found → NotFoundException
- API rate limit → RateLimitException
- Cache hit → no external API call

#### Backend Feature Tests
**File**: `tests/Feature/BookLookupApiTest.php`

**Test Cases**:
- `GET /api/books/lookup?isbn=valid` → 200 with book data
- `GET /api/books/lookup?isbn=invalid` → 422 validation error
- `GET /api/books/lookup?isbn=notfound` → 404 not found
- Rate limiting behavior → 429 after limit

#### Reading Log Integration Tests
**File**: `tests/Feature/ReadingLogWithBooksTest.php`

**Test Cases**:
- Create reading log with book data → success
- Create reading log without book data → success (existing flow)
- Invalid ISBN in reading log → validation error
- Invalid cover URL → validation error

### F) Security & Compliance

#### Data Minimization (GDPR/COPPA)
- Store only minimal book metadata required
- No third-party payload storage
- Cover images remain external URLs (not uploaded)
- Book data linked only to reading activity

#### Security Measures
- Rate limiting on book lookup API
- URL validation for cover images
- No secret keys required (Open Library is public)
- Input validation and sanitization

#### Privacy Considerations
- No personal data in book lookups
- Camera permission handled by browser
- Optional feature - no impact on core functionality

## Component Architecture

### Vue Component Structure
```
resources/js/Components/
├── BookScanner.vue          # Main scanner component
├── ISBNInput.vue           # Manual ISBN entry
└── BookPreview.vue         # Display book metadata

resources/js/Pages/ReadingLogs/
├── Create.vue              # Enhanced with scanner
├── Edit.vue                # Enhanced with scanner
└── Components/
    └── BookScannerField.vue # Integration component
```

### Laravel Service Structure
```
app/Services/
└── BookLookupService.php   # External API integration

app/Http/Controllers/Api/
└── BookController.php      # API endpoint

app/Exceptions/
├── InvalidISBNException.php
├── BookNotFoundException.php
└── RateLimitException.php
```

## Implementation Priority

### Phase 1: Backend Foundation
1. Add database fields to ReadingLog
2. Implement BookLookupService
3. Create API endpoint with tests
4. Add caching and rate limiting

### Phase 2: Frontend Integration  
1. Create Vue scanner components
2. Integrate with existing Create/Edit pages
3. Add manual ISBN fallback
4. Implement error handling

### Phase 3: Testing & Polish
1. Complete test coverage
2. Error state handling
3. Loading states and UX polish
4. Documentation updates

## Deployment Considerations

### SiteGround Compatibility
- No additional server requirements
- Uses existing Laravel cache system
- External API calls via HTTP client
- No new dependencies requiring server config

### Fallback Strategy
- Manual entry always available
- Scanner failures don't break form
- Graceful degradation for unsupported browsers
- Clear error messages for users

## Future Enhancements

### Possible Extensions (Phase 2)
- Offline book database for popular children's books
- Reading level integration
- Book recommendation engine
- Reading goals by book count vs. time

### Alternative Scanner Libraries
If `@zxing/browser` proves incompatible:
- **QuaggaJS**: Established barcode scanning library
- **html5-qrcode**: Lightweight alternative
- **barcode-detector-polyfill**: Browser API polyfill

## Success Metrics

### Functional Requirements
- [ ] Existing manual logging flow preserved
- [ ] Optional scanning enhances but doesn't replace
- [ ] GDPR/COPPA compliance maintained
- [ ] No authentication changes required

### Technical Requirements  
- [ ] Vue 3 + Inertia integration working
- [ ] Laravel API endpoint functional
- [ ] MySQL schema changes applied
- [ ] Test coverage > 90%
- [ ] SiteGround deployment successful