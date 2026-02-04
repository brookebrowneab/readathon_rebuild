# Inertia Pages and Routes

**Source Documents**: 03_user_flows.md, 02_user_roles.md

## Route Naming Conventions

- RESTful resources: `{resource}.{action}` (e.g., `children.show`)
- Nested resources: `{parent}.{child}.{action}` (e.g., `events.enrollments.create`)
- Actions: `{resource}.{verb}` (e.g., `pledges.calculate`)
- API routes: `/api/{resource}` (for AJAX/async operations)

## Public Routes (No Auth)

### Marketing & Information
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/` | GET | HomeController@index | Home/Index |
| `/about` | GET | HomeController@about | Home/About |
| `/privacy` | GET | LegalController@privacy | Legal/Privacy |
| `/terms` | GET | LegalController@terms | Legal/Terms |

### Authentication
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/register` | GET | Auth\RegisterController@create | Auth/Register |
| `/register` | POST | Auth\RegisterController@store | - |
| `/login` | GET | Auth\LoginController@create | Auth/Login |
| `/login` | POST | Auth\LoginController@store | - |
| `/student-login` | GET | Auth\StudentLoginController@create | Auth/StudentLogin |
| `/student-login` | POST | Auth\StudentLoginController@store | - |
| `/logout` | POST | Auth\LoginController@destroy | - |
| `/forgot-password` | GET | Auth\PasswordResetController@create | Auth/ForgotPassword |
| `/forgot-password` | POST | Auth\PasswordResetController@store | - |
| `/reset-password/{token}` | GET | Auth\PasswordResetController@edit | Auth/ResetPassword |
| `/reset-password` | POST | Auth\PasswordResetController@update | - |
| `/verify-email/{id}/{hash}` | GET | Auth\VerificationController@verify | - |

### Sponsor Direct Access
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/invite/{token}` | GET | SponsorInviteController@show | Sponsor/InviteLogin |
| `/sponsor/child/{public_code}` | GET | SponsorController@publicLanding | Sponsor/PublicLanding |
| `/sponsor/{child_id}` | GET | SponsorController@landing | Sponsor/Landing |
| `/sponsor/{child_id}/pledge` | GET | PledgeController@create | Pledges/Create |
| `/sponsor/{child_id}/pledge` | POST | PledgeController@store | - |
| `/sponsor/{child_id}/pledge/immediate` | POST | PledgeController@storeWithPayment | Pledges/ImmediatePayment |

## Authenticated Parent Routes

### Dashboard & Profile
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/dashboard` | GET | DashboardController@index | Dashboard/Parent |
| `/profile` | GET | ProfileController@edit | Profile/Edit |
| `/profile` | PUT | ProfileController@update | - |
| `/profile/password` | PUT | ProfileController@updatePassword | - |

### Children Management
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/children` | GET | ChildProfileController@index | Children/Index |
| `/children/create` | GET | ChildProfileController@create | Children/Create |
| `/children` | POST | ChildProfileController@store | - |
| `/children/{child}` | GET | ChildProfileController@show | Children/Show |
| `/children/{child}/edit` | GET | ChildProfileController@edit | Children/Edit |
| `/children/{child}` | PUT | ChildProfileController@update | - |
| `/children/{child}` | DELETE | ChildProfileController@destroy | - |

### Event Enrollment
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/events` | GET | EventController@index | Events/Index |
| `/events/{event}` | GET | EventController@show | Events/Show |
| `/events/{event}/enroll` | GET | EnrollmentController@create | Enrollments/Create |
| `/events/{event}/enroll` | POST | EnrollmentController@store | - |
| `/enrollments` | GET | EnrollmentController@index | Enrollments/Index |
| `/enrollments/{enrollment}` | DELETE | EnrollmentController@destroy | - |

### Reading Logs
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/reading-logs` | GET | ReadingLogController@index | ReadingLogs/Index |
| `/reading-logs/create` | GET | ReadingLogController@create | ReadingLogs/Create |
| `/reading-logs` | POST | ReadingLogController@store | - |
| `/reading-logs/{log}/edit` | GET | ReadingLogController@edit | ReadingLogs/Edit |
| `/reading-logs/{log}` | PUT | ReadingLogController@update | - |
| `/reading-logs/{log}` | DELETE | ReadingLogController@destroy | - |
| `/reading-logs/pending-approval` | GET | ReadingLogController@pendingApproval | ReadingLogs/PendingApproval |
| `/reading-logs/{log}/approve` | PUT | ReadingLogController@approve | - |
| `/reading-logs/{log}/reject` | PUT | ReadingLogController@reject | - |
| `/reading-logs/bulk` | GET | ReadingLogController@bulk | ReadingLogs/Bulk |
| `/reading-logs/bulk` | POST | ReadingLogController@bulkStore | - |

### Pledges (Received)
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/pledges/received` | GET | PledgeController@received | Pledges/Received |
| `/pledges/received/{pledge}` | GET | PledgeController@showReceived | Pledges/ShowReceived |

### Sponsor Invitations
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/children/{child}/invitations` | GET | SponsorInvitationController@index | Invitations/Index |
| `/children/{child}/invitations/create` | GET | SponsorInvitationController@create | Invitations/Create |
| `/children/{child}/invitations` | POST | SponsorInvitationController@store | - |
| `/children/{child}/public-link` | GET | SponsorInvitationController@publicLink | Invitations/PublicLink |
| `/children/{child}/public-link` | PUT | SponsorInvitationController@updatePublicLink | - |
| `/children/{child}/public-link` | DELETE | SponsorInvitationController@disablePublicLink | - |
| `/invitations/{invitation}` | DELETE | SponsorInvitationController@revoke | - |

### Sponsorships (Made)
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/sponsorships` | GET | SponsorshipController@index | Sponsorships/Index |
| `/sponsorships/create` | GET | SponsorshipController@create | Sponsorships/Create |
| `/sponsorships` | POST | SponsorshipController@store | - |
| `/sponsorships/{pledge}` | GET | SponsorshipController@show | Sponsorships/Show |
| `/sponsorships/{pledge}/edit` | GET | SponsorshipController@edit | Sponsorships/Edit |
| `/sponsorships/{pledge}` | PUT | SponsorshipController@update | - |
| `/sponsorships/{pledge}` | DELETE | SponsorshipController@destroy | - |

### Payments
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/payments` | GET | PaymentController@index | Payments/Index |
| `/payments/create` | GET | PaymentController@create | Payments/Create |
| `/payments/process` | POST | PaymentController@process | - |
| `/payments/{payment}` | GET | PaymentController@show | Payments/Show |
| `/payments/{payment}/receipt` | GET | PaymentController@receipt | Payments/Receipt |

### Privacy & Data
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/privacy/consent` | GET | PrivacyController@consent | Privacy/Consent |
| `/privacy/consent` | POST | PrivacyController@storeConsent | - |
| `/privacy/export` | GET | PrivacyController@exportForm | Privacy/Export |
| `/privacy/export` | POST | PrivacyController@requestExport | - |
| `/privacy/delete` | GET | PrivacyController@deleteForm | Privacy/Delete |
| `/privacy/delete` | POST | PrivacyController@requestDelete | - |

## Student Routes (Optional Login)

### Student Dashboard
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/student/dashboard` | GET | Student\DashboardController@index | Student/Dashboard |
| `/student/reading` | GET | Student\ReadingController@index | Student/Reading |
| `/student/progress` | GET | Student\ProgressController@index | Student/Progress |
| `/student/sponsors` | GET | Student\SponsorController@index | Student/Sponsors |

### Student Reading Logs
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/student/reading-logs` | GET | Student\ReadingLogController@index | Student/ReadingLogs |
| `/student/reading-logs/create` | GET | Student\ReadingLogController@create | Student/LogReading |
| `/student/reading-logs` | POST | Student\ReadingLogController@store | - |

## Teacher Routes

### Teacher Dashboard
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/teacher/dashboard` | GET | Teacher\DashboardController@index | Teacher/Dashboard |
| `/teacher/classroom` | GET | Teacher\ClassroomController@show | Teacher/Classroom |
| `/teacher/students` | GET | Teacher\StudentController@index | Teacher/Students |
| `/teacher/students/{child}` | GET | Teacher\StudentController@show | Teacher/StudentDetail |

### Teacher Actions
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/teacher/reading-logs` | GET | Teacher\ReadingLogController@index | Teacher/ReadingLogs |
| `/teacher/reading-logs/create` | GET | Teacher\ReadingLogController@create | Teacher/LogReading |
| `/teacher/reading-logs` | POST | Teacher\ReadingLogController@store | - |
| `/teacher/reports` | GET | Teacher\ReportController@index | Teacher/Reports |
| `/teacher/reports/export` | POST | Teacher\ReportController@export | - |

## Admin Routes (Event Admin)

### Admin Dashboard
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/admin` | GET | Admin\DashboardController@index | Admin/Dashboard |
| `/admin/events` | GET | Admin\EventController@index | Admin/Events/Index |
| `/admin/events/create` | GET | Admin\EventController@create | Admin/Events/Create |
| `/admin/events` | POST | Admin\EventController@store | - |
| `/admin/events/{event}` | GET | Admin\EventController@show | Admin/Events/Show |
| `/admin/events/{event}/edit` | GET | Admin\EventController@edit | Admin/Events/Edit |
| `/admin/events/{event}` | PUT | Admin\EventController@update | - |
| `/admin/events/{event}/end` | POST | Admin\EventController@end | - |

### School Management
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/admin/classrooms` | GET | Admin\ClassroomController@index | Admin/Classrooms/Index |
| `/admin/classrooms/create` | GET | Admin\ClassroomController@create | Admin/Classrooms/Create |
| `/admin/classrooms` | POST | Admin\ClassroomController@store | - |
| `/admin/classrooms/{classroom}` | GET | Admin\ClassroomController@show | Admin/Classrooms/Show |
| `/admin/classrooms/{classroom}/edit` | GET | Admin\ClassroomController@edit | Admin/Classrooms/Edit |
| `/admin/classrooms/{classroom}` | PUT | Admin\ClassroomController@update | - |

### Teacher Management
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/admin/teachers` | GET | Admin\TeacherController@index | Admin/Teachers/Index |
| `/admin/teachers/create` | GET | Admin\TeacherController@create | Admin/Teachers/Create |
| `/admin/teachers` | POST | Admin\TeacherController@store | - |
| `/admin/teachers/{teacher}` | GET | Admin\TeacherController@show | Admin/Teachers/Show |
| `/admin/teachers/{teacher}/edit` | GET | Admin\TeacherController@edit | Admin/Teachers/Edit |
| `/admin/teachers/{teacher}` | PUT | Admin\TeacherController@update | - |
| `/admin/teachers/{teacher}/deactivate` | PUT | Admin\TeacherController@deactivate | - |
| `/admin/teachers/bulk-import` | GET | Admin\TeacherController@bulkImport | Admin/Teachers/BulkImport |
| `/admin/teachers/bulk-import` | POST | Admin\TeacherController@processBulkImport | - |

### Financial Management
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/admin/payments` | GET | Admin\PaymentController@index | Admin/Payments/Index |
| `/admin/payments/{payment}` | GET | Admin\PaymentController@show | Admin/Payments/Show |
| `/admin/payments/manual` | GET | Admin\PaymentController@manual | Admin/Payments/Manual |
| `/admin/payments/manual` | POST | Admin\PaymentController@storeManual | - |
| `/admin/reports/financial` | GET | Admin\ReportController@financial | Admin/Reports/Financial |

### Email Templates
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/admin/email-templates` | GET | Admin\EmailTemplateController@index | Admin/EmailTemplates/Index |
| `/admin/email-templates/create` | GET | Admin\EmailTemplateController@create | Admin/EmailTemplates/Create |
| `/admin/email-templates` | POST | Admin\EmailTemplateController@store | - |
| `/admin/email-templates/{template}` | GET | Admin\EmailTemplateController@show | Admin/EmailTemplates/Show |
| `/admin/email-templates/{template}/edit` | GET | Admin\EmailTemplateController@edit | Admin/EmailTemplates/Edit |
| `/admin/email-templates/{template}` | PUT | Admin\EmailTemplateController@update | - |
| `/admin/email-templates/{template}` | DELETE | Admin\EmailTemplateController@destroy | - |
| `/admin/email-templates/{template}/preview` | POST | Admin\EmailTemplateController@preview | Admin/EmailTemplates/Preview |
| `/admin/email-templates/{template}/variables` | GET | Admin\EmailTemplateController@variables | Admin/EmailTemplates/Variables |

### Communications
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/admin/emails` | GET | Admin\EmailController@index | Admin/Emails/Index |
| `/admin/emails/compose` | GET | Admin\EmailController@compose | Admin/Emails/Compose |
| `/admin/emails/send` | POST | Admin\EmailController@send | - |
| `/admin/emails/schedule` | GET | Admin\EmailController@schedule | Admin/Emails/Schedule |
| `/admin/emails/schedule` | POST | Admin\EmailController@storeScheduled | - |
| `/admin/emails/scheduled` | GET | Admin\EmailController@scheduledIndex | Admin/Emails/Scheduled |
| `/admin/emails/scheduled/{email}` | DELETE | Admin\EmailController@cancelScheduled | - |
| `/admin/emails/queue` | GET | Admin\EmailController@queue | Admin/Emails/Queue |
| `/admin/emails/delivery-logs` | GET | Admin\EmailController@deliveryLogs | Admin/Emails/DeliveryLogs |
| `/admin/emails/reminders` | GET | Admin\EmailController@reminders | Admin/Emails/Reminders |
| `/admin/emails/reminders/send` | POST | Admin\EmailController@sendReminders | - |

### Reports & Export
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/admin/reports` | GET | Admin\ReportController@index | Admin/Reports/Index |
| `/admin/reports/participation` | GET | Admin\ReportController@participation | Admin/Reports/Participation |
| `/admin/reports/reading` | GET | Admin\ReportController@reading | Admin/Reports/Reading |
| `/admin/reports/export` | POST | Admin\ReportController@export | - |

## Super Admin Routes

### System Management
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/system/users` | GET | System\UserController@index | System/Users/Index |
| `/system/users/{user}` | GET | System\UserController@show | System/Users/Show |
| `/system/users/{user}/impersonate` | POST | System\UserController@impersonate | - |
| `/system/audit-logs` | GET | System\AuditLogController@index | System/AuditLogs |
| `/system/webhooks` | GET | System\WebhookController@index | System/Webhooks |
| `/system/jobs` | GET | System\JobController@index | System/Jobs |

### School Management
| Route | Method | Controller@Action | Inertia Page |
|-------|--------|------------------|--------------|
| `/system/schools` | GET | System\SchoolController@index | System/Schools/Index |
| `/system/schools/create` | GET | System\SchoolController@create | System/Schools/Create |
| `/system/schools` | POST | System\SchoolController@store | - |
| `/system/schools/{school}` | GET | System\SchoolController@show | System/Schools/Show |
| `/system/schools/{school}/edit` | GET | System\SchoolController@edit | System/Schools/Edit |
| `/system/schools/{school}` | PUT | System\SchoolController@update | - |

## API Routes (JSON Responses)

### Async Operations
| Route | Method | Controller@Action | Purpose |
|-------|--------|------------------|---------|
| `/api/children/{child}/sponsors` | GET | Api\ChildController@sponsors | Load sponsors list |
| `/api/events/{event}/leaderboard` | GET | Api\EventController@leaderboard | Get current rankings |
| `/api/pledges/calculate` | POST | Api\PledgeController@calculate | Calculate pledge totals |
| `/api/square/tokenize` | POST | Api\SquareController@tokenize | Get payment nonce |
| `/api/reading-logs/validate` | POST | Api\ReadingLogController@validate | Validate entry |
| `/api/books/lookup` | GET | Api\BookController@lookup | ISBN book lookup via Open Library |

## Webhook Routes

### External Service Webhooks
| Route | Method | Controller@Action | Purpose |
|-------|--------|------------------|---------|
| `/webhooks/square` | POST | Webhook\SquareController@handle | Square payment webhooks |

## Route Protection

### Middleware Groups

```php
// routes/web.php

Route::middleware(['auth', 'verified'])->group(function () {
    // Parent routes
    Route::prefix('children')->group(function () {
        Route::middleware(['consent:coppa'])->group(function () {
            // Child management routes
        });
    });
    
    // Teacher routes
    Route::middleware(['role:teacher'])->prefix('teacher')->group(function () {
        // Teacher-specific routes
    });
    
    // Admin routes
    Route::middleware(['role:event_admin'])->prefix('admin')->group(function () {
        // Admin-specific routes
    });
    
    // System routes
    Route::middleware(['role:super_admin'])->prefix('system')->group(function () {
        // Super admin routes
    });
});
```

## Inertia Page Components

### Shared Data (HandleInertiaRequests)

```php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user() ? [
                'id' => $request->user()->id,
                'email' => $request->user()->email,
                'roles' => $request->user()->roles->pluck('name'),
                'profile' => $request->user()->parentProfile,
            ] : null,
        ],
        'active_event' => Event::active()->first(),
        'flash' => [
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'),
        ],
        'consent' => [
            'coppa' => $request->user()?->hasConsent('coppa'),
            'marketing' => $request->user()?->hasConsent('marketing'),
        ],
    ]);
}
```