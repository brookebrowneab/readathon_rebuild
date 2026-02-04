# Permissions and Roles

**Source Documents**: 02_user_roles.md, 05_permissions_matrix.md

## Role Definitions

### parent
**Purpose**: Standard family account managing children
**Capabilities**:
- Manage own profile
- Add/edit/remove own children
- Log reading for own children
- View own family's pledges
- Make payments for received pledges
- Sponsor other children
- Export own data
- Delete own account

### sponsor
**Purpose**: Adult making pledges (variant of parent role)
**Note**: Sponsors are parents with active pledges
**Capabilities**:
- All parent capabilities
- Make pledges to any public child
- View sponsored children's progress
- Make payments for own pledges

### student
**Purpose**: Child with parent-enabled login capability
**Capabilities**:
- Log own reading time (if parent allows)
- View own reading progress
- View own sponsors and pledges
- Cannot make payments
- Cannot edit profile (parent managed)
- Cannot access other students' data

### teacher
**Purpose**: School staff managing classrooms
**Capabilities**:
- View class rosters
- View class reading statistics
- Log reading for class students
- Export class data (CSV)
- View grade-level reports
- Cannot make payments
- Cannot edit student profiles

### event_admin
**Purpose**: School-level administrator
**Capabilities**:
- Create/edit events
- Manage classrooms
- Manage teacher accounts (create/edit/deactivate)
- Update teacher lists annually
- View all school statistics
- Send bulk emails
- Export all school data
- Process manual payments
- View payment reports
- Cannot delete user accounts

### super_admin
**Purpose**: System administrator
**Capabilities**:
- All permissions
- Manage schools
- View system logs
- Process refunds
- Delete accounts
- Access audit trails
- Impersonate users (with audit)

## Permission Matrix

### User Management
| Action | parent | student | teacher | event_admin | super_admin |
|--------|--------|---------|---------|-------------|-------------|
| Register account | ✓ | - | ✓ | - | - |
| Update own profile | ✓ | - | ✓ | ✓ | ✓ |
| Delete own account | ✓ | - | - | - | ✓ |
| View any profile | - | - | - | ✓ | ✓ |
| Create teacher account | - | - | - | ✓ | ✓ |
| Edit teacher account | - | - | - | ✓ | ✓ |
| Deactivate teacher account | - | - | - | ✓ | ✓ |
| Bulk import teachers | - | - | - | ✓ | ✓ |
| Impersonate user | - | - | - | - | ✓ |

### Child Management
| Action | parent | student | teacher | event_admin | super_admin |
|--------|--------|---------|---------|-------------|-------------|
| Create child | ✓ (own) | - | - | - | ✓ |
| Update child | ✓ (own) | - | - | - | ✓ |
| Delete child | ✓ (own) | - | - | - | ✓ |
| View child details | ✓ (own) | ✓ (self) | ✓ (class) | ✓ | ✓ |
| Set privacy level | ✓ (own) | - | - | - | ✓ |
| Enable student login | ✓ (own) | - | - | - | ✓ |

### Reading Logs
| Action | parent | student | teacher | event_admin | super_admin |
|--------|--------|---------|---------|-------------|-------------|
| Create log | ✓ (own) | ✓ (self) | ✓ (class) | - | ✓ |
| Update log | ✓ (own) | - | ✓ (class) | - | ✓ |
| Delete log | ✓ (own) | - | - | - | ✓ |
| View logs | ✓ (own) | ✓ (self) | ✓ (class) | ✓ | ✓ |
| Approve logs | ✓ (own) | - | - | - | ✓ |
| Bulk import | - | - | ✓ | ✓ | ✓ |

### Pledges
| Action | parent | student | teacher | event_admin | super_admin |
|--------|--------|---------|---------|-------------|-------------|
| Create pledge | ✓ | - | - | - | ✓ |
| Update unpaid pledge | ✓ (own) | - | - | - | ✓ |
| Cancel pledge | ✓ (own) | - | - | - | ✓ |
| View received pledges | ✓ (own) | ✓ (self) | - | ✓ | ✓ |
| View all pledges | - | - | - | ✓ | ✓ |
| Send invitations | ✓ (own) | - | - | - | ✓ |
| Generate public links | ✓ (own) | - | - | - | ✓ |

### Payments
| Action | parent | student | teacher | event_admin | super_admin |
|--------|--------|---------|---------|-------------|-------------|
| Make payment | ✓ | - | - | - | ✓ |
| View own payments | ✓ | - | - | - | ✓ |
| View all payments | - | - | - | ✓ | ✓ |
| Process refund | - | - | - | - | ✓ |
| Manual payment entry | - | - | - | ✓ | ✓ |

### Events
| Action | parent | student | teacher | event_admin | super_admin |
|--------|--------|---------|---------|-------------|-------------|
| Create event | - | - | - | ✓ | ✓ |
| Update event | - | - | - | ✓ | ✓ |
| End event | - | - | - | ✓ | ✓ |
| View event details | ✓ | ✓ | ✓ | ✓ | ✓ |
| Archive event | - | - | - | ✓ | ✓ |

### Reporting
| Action | parent | student | teacher | event_admin | super_admin |
|--------|--------|---------|---------|-------------|-------------|
| View own stats | ✓ | ✓ (self) | - | - | ✓ |
| View class stats | - | - | ✓ | ✓ | ✓ |
| View school stats | - | - | ✓ | ✓ | ✓ |
| Export own data | ✓ | - | ✓ | - | ✓ |
| Export class data | - | - | ✓ | ✓ | ✓ |
| Export all data | - | - | - | ✓ | ✓ |
| View audit logs | - | - | - | - | ✓ |

### Email Templates
| Action | parent | student | teacher | event_admin | super_admin |
|--------|--------|---------|---------|-------------|-------------|
| View templates | - | - | - | ✓ | ✓ |
| Create custom template | - | - | - | ✓ | ✓ |
| Edit custom template | - | - | - | ✓ | ✓ |
| Delete custom template | - | - | - | ✓ | ✓ |
| Edit system template | - | - | - | - | ✓ |
| Preview template | - | - | - | ✓ | ✓ |
| Manage variables | - | - | - | ✓ | ✓ |

### Communication
| Action | parent | student | teacher | event_admin | super_admin |
|--------|--------|---------|---------|-------------|-------------|
| Send to own sponsors | ✓ | - | - | - | ✓ |
| Send to class | - | - | ✓ | - | ✓ |
| Send templated email | - | - | - | ✓ | ✓ |
| Schedule email | - | - | - | ✓ | ✓ |
| Send bulk email | - | - | - | ✓ | ✓ |
| View email queue | - | - | - | ✓ | ✓ |
| Cancel scheduled email | - | - | - | ✓ | ✓ |
| View email history | ✓ (own) | - | ✓ (class) | ✓ | ✓ |
| View delivery logs | - | - | - | ✓ | ✓ |

## Laravel Implementation

### Policies

```php
// app/Policies/ChildProfilePolicy.php
class ChildProfilePolicy
{
    public function view($user, ChildProfile $child): bool
    {
        // Student can view self
        if ($user instanceof ChildProfile && $user->id === $child->id) {
            return true;
        }
        
        // Parent can view own children
        if ($user instanceof User && $child->parent_profile_id === $user->parentProfile?->id) {
            return true;
        }
        
        // Teacher can view class children
        if ($user instanceof User && $user->hasRole('teacher') && $child->inClass($user->classroom_id)) {
            return true;
        }
        
        // Admins can view all
        return $user instanceof User && $user->hasAnyRole(['event_admin', 'super_admin']);
    }
    
    public function update($user, ChildProfile $child): bool
    {
        // Students cannot update their own profiles (parent-managed)
        if ($user instanceof ChildProfile) {
            return false;
        }
        
        // Only parent or super_admin
        return $user instanceof User && (
            $child->parent_profile_id === $user->parentProfile?->id
            || $user->hasRole('super_admin')
        );
    }
    
    public function delete($user, ChildProfile $child): bool
    {
        // Same as update - students cannot delete
        return $this->update($user, $child);
    }
}

// app/Policies/ReadingLogPolicy.php
class ReadingLogPolicy
{
    public function create($user, Enrollment $enrollment): bool
    {
        // Student can log for self if parent allows
        if ($user instanceof ChildProfile) {
            return $user->allow_self_login 
                && $user->id === $enrollment->child_profile_id;
        }
        
        // Parent can log for own children
        if ($user instanceof User) {
            $child = $enrollment->childProfile;
            return $child->parent_profile_id === $user->parentProfile?->id
                || $user->hasAnyRole(['teacher', 'super_admin']);
        }
        
        return false;
    }
}
```

### Gates

```php
// app/Providers/AuthServiceProvider.php
Gate::define('manage-events', function (User $user) {
    return $user->hasAnyRole(['event_admin', 'super_admin']);
});

Gate::define('view-all-payments', function (User $user) {
    return $user->hasAnyRole(['event_admin', 'super_admin']);
});

Gate::define('process-refunds', function (User $user) {
    return $user->hasRole('super_admin');
});

Gate::define('export-school-data', function (User $user) {
    return $user->hasAnyRole(['teacher', 'event_admin', 'super_admin']);
});

Gate::define('send-bulk-email', function (User $user) {
    return $user->hasAnyRole(['event_admin', 'super_admin']);
});

Gate::define('manage-email-templates', function (User $user) {
    return $user->hasAnyRole(['event_admin', 'super_admin']);
});

Gate::define('edit-system-templates', function (User $user) {
    return $user->hasRole('super_admin');
});

Gate::define('schedule-emails', function (User $user) {
    return $user->hasAnyRole(['event_admin', 'super_admin']);
});

Gate::define('impersonate', function (User $user) {
    return $user->hasRole('super_admin');
});
```

### Middleware

```php
// app/Http/Middleware/EnsureConsentGiven.php
class EnsureConsentGiven
{
    public function handle($request, Closure $next)
    {
        if (!$request->user()->hasConsent('coppa')) {
            return redirect()->route('consent.required');
        }
        
        return $next($request);
    }
}

// app/Http/Middleware/LogPiiAccess.php  
class LogPiiAccess
{
    public function handle($request, Closure $next)
    {
        if ($request->route()->hasParameter('child')) {
            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'view_child_profile',
                'entity_type' => 'ChildProfile',
                'entity_id' => $request->route('child'),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);
        }
        
        return $next($request);
    }
}
```

### Package Recommendations

#### Spatie Laravel Permission
**Purpose**: Role and permission management
**Usage**:
```php
composer require spatie/laravel-permission

// Usage
$user->assignRole('parent');
$user->hasRole('parent'); // true
$user->can('edit-child', $child); // policy check
```

#### Laravel Sanctum
**Purpose**: Session authentication (built-in)
**Usage**:
```php
// Already included in Laravel
// Configure for SPA authentication
```

#### Laravel Auditing
**Purpose**: Audit trail for models
**Usage**:
```php
composer require owen-it/laravel-auditing

// Model
class ChildProfile extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
}
```

## Authorization Best Practices

### Fail Closed
- Default deny for all operations
- Explicit allow required
- No assumptions about permissions

### Principle of Least Privilege
- Users get minimum required access
- Roles are additive, not subtractive
- Time-bound permissions where applicable

### Audit Everything
- Log all PII access
- Track permission changes
- Monitor failed authorization attempts

### Separate Concerns
- Authentication (who you are) → Sanctum
- Authorization (what you can do) → Policies/Gates
- Audit (what you did) → Audit package

### Child Data Special Handling
- Always verify parent relationship
- Extra consent checks for child operations
- Automatic privacy filters in queries
- No direct child access ever

## Permission Checks in Controllers

```php
// app/Http/Controllers/ChildProfileController.php
class ChildProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('consent:coppa')->only(['create', 'store']);
        $this->middleware('log.pii')->only(['show']);
    }
    
    public function show(ChildProfile $child)
    {
        $this->authorize('view', $child);
        
        return Inertia::render('Children/Show', [
            'child' => $child->only(['id', 'first_name', 'last_initial', 'grade_level'])
        ]);
    }
    
    public function update(Request $request, ChildProfile $child)
    {
        $this->authorize('update', $child);
        
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_initial' => 'required|string|size:1',
            'grade_level' => 'required|in:prek,k,1,2,3,4,5'
        ]);
        
        $child->update($validated);
        
        return redirect()->route('children.show', $child);
    }
}
```