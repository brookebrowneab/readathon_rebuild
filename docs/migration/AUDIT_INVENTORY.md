# Migration Audit Inventory (Claude Reference)

Source scanned: `claude_reference/` (no code changes).

## A) Backend Endpoints Implemented
Source: `claude_reference/config/routes.php` and controller files in `claude_reference/api/Controllers/`.

| Method | Path | Handler (Controller::method) | File |
|---|---|---|---|
| GET | `/api/health` | `HealthController::check` | `claude_reference/api/Controllers/HealthController.php` |
| GET | `/api/auth/csrf-token` | `AuthController::csrfToken` | `claude_reference/api/Controllers/AuthController.php` |
| POST | `/api/auth/register` | `AuthController::register` | `claude_reference/api/Controllers/AuthController.php` |
| POST | `/api/auth/login` | `AuthController::login` | `claude_reference/api/Controllers/AuthController.php` |
| POST | `/api/auth/logout` | `AuthController::logout` | `claude_reference/api/Controllers/AuthController.php` |
| GET | `/api/auth/me` | `AuthController::me` | `claude_reference/api/Controllers/AuthController.php` |
| POST | `/api/auth/forgot-password` | `AuthController::forgotPassword` | `claude_reference/api/Controllers/AuthController.php` |
| POST | `/api/auth/reset-password` | `AuthController::resetPassword` | `claude_reference/api/Controllers/AuthController.php` |
| POST | `/api/auth/student-login` | `AuthController::studentLogin` | `claude_reference/api/Controllers/AuthController.php` |
| POST | `/api/auth/magic-link` | `AuthController::sendMagicLink` | `claude_reference/api/Controllers/AuthController.php` |
| POST | `/api/auth/magic-verify` | `AuthController::verifyMagicLink` | `claude_reference/api/Controllers/AuthController.php` |
| GET | `/api/campaign/active` | `CampaignController::active` | `claude_reference/api/Controllers/CampaignController.php` |
| GET | `/api/admin/campaigns` | `CampaignController::list` | `claude_reference/api/Controllers/CampaignController.php` |
| POST | `/api/admin/campaigns` | `CampaignController::create` | `claude_reference/api/Controllers/CampaignController.php` |
| PUT | `/api/admin/campaigns/{id}` | `CampaignController::update` | `claude_reference/api/Controllers/CampaignController.php` |
| POST | `/api/admin/campaigns/{id}/activate` | `CampaignController::activate` | `claude_reference/api/Controllers/CampaignController.php` |
| GET | `/api/teachers/homerooms` | `TeacherController::homerooms` | `claude_reference/api/Controllers/TeacherController.php` |
| GET | `/api/admin/teachers` | `TeacherController::list` | `claude_reference/api/Controllers/TeacherController.php` |
| POST | `/api/admin/teachers` | `TeacherController::create` | `claude_reference/api/Controllers/TeacherController.php` |
| PUT | `/api/admin/teachers/{id}` | `TeacherController::update` | `claude_reference/api/Controllers/TeacherController.php` |
| GET | `/api/teacher/roster` | `TeacherController::roster` | `claude_reference/api/Controllers/TeacherController.php` |
| POST | `/api/parent/students` | `StudentController::create` | `claude_reference/api/Controllers/StudentController.php` |
| GET | `/api/parent/students` | `StudentController::list` | `claude_reference/api/Controllers/StudentController.php` |
| GET | `/api/parent/students/{id}` | `StudentController::show` | `claude_reference/api/Controllers/StudentController.php` |
| PUT | `/api/parent/students/{id}` | `StudentController::update` | `claude_reference/api/Controllers/StudentController.php` |
| POST | `/api/parent/students/{id}/re-enroll` | `StudentController::reEnroll` | `claude_reference/api/Controllers/StudentController.php` |
| POST | `/api/parent/students/{id}/enable-login` | `StudentController::enableLogin` | `claude_reference/api/Controllers/StudentController.php` |
| POST | `/api/parent/students/{id}/disable-login` | `StudentController::disableLogin` | `claude_reference/api/Controllers/StudentController.php` |
| POST | `/api/parent/students/{id}/reset-password` | `StudentController::resetStudentPassword` | `claude_reference/api/Controllers/StudentController.php` |
| DELETE | `/api/parent/students/{id}` | `StudentController::delete` | `claude_reference/api/Controllers/StudentController.php` |
| GET | `/api/admin/students` | `StudentController::adminList` | `claude_reference/api/Controllers/StudentController.php` |
| POST | `/api/students/{studentId}/reading-logs` | `ReadingLogController::create` | `claude_reference/api/Controllers/ReadingLogController.php` |
| GET | `/api/students/{studentId}/reading-logs` | `ReadingLogController::list` | `claude_reference/api/Controllers/ReadingLogController.php` |
| PATCH | `/api/reading-logs/{logId}` | `ReadingLogController::update` | `claude_reference/api/Controllers/ReadingLogController.php` |
| DELETE | `/api/reading-logs/{logId}` | `ReadingLogController::delete` | `claude_reference/api/Controllers/ReadingLogController.php` |
| PATCH | `/api/reading-logs/{logId}/validate` | `ReadingLogController::validate` | `claude_reference/api/Controllers/ReadingLogController.php` |
| PATCH | `/api/reading-logs/{logId}/lock` | `ReadingLogController::lock` | `claude_reference/api/Controllers/ReadingLogController.php` |
| GET | `/api/students/{studentId}/reading-summary` | `ReadingLogController::summary` | `claude_reference/api/Controllers/ReadingLogController.php` |
| GET | `/api/books/search` | `BookController::search` | `claude_reference/api/Controllers/BookController.php` |
| GET | `/api/books/isbn/{isbn}` | `BookController::lookupIsbn` | `claude_reference/api/Controllers/BookController.php` |
| POST | `/api/public/students/{token}/pledges` | `PledgeController::create` | `claude_reference/api/Controllers/PledgeController.php` |
| GET | `/api/public/students/{token}/pledges` | `PledgeController::listByToken` | `claude_reference/api/Controllers/PledgeController.php` |
| PATCH | `/api/public/pledges/{id}` | `PledgeController::update` | `claude_reference/api/Controllers/PledgeController.php` |
| DELETE | `/api/public/pledges/{id}` | `PledgeController::delete` | `claude_reference/api/Controllers/PledgeController.php` |
| GET | `/api/parent/students/{id}/pledges` | `PledgeController::listForParent` | `claude_reference/api/Controllers/PledgeController.php` |
| GET | `/api/admin/pledges` | `PledgeController::adminList` | `claude_reference/api/Controllers/PledgeController.php` |
| PATCH | `/api/admin/pledges/{id}/mark-paid` | `PledgeController::markPaid` | `claude_reference/api/Controllers/PledgeController.php` |
| GET | `/api/admin/payments` | `PaymentController::list` | `claude_reference/api/Controllers/PaymentController.php` |
| POST | `/api/admin/payments/check` | `PaymentController::recordCheck` | `claude_reference/api/Controllers/PaymentController.php` |
| GET | `/api/admin/finance/export` | `PaymentController::exportCsv` | `claude_reference/api/Controllers/PaymentController.php` |
| POST | `/api/checkout` | `PaymentController::checkout` | `claude_reference/api/Controllers/PaymentController.php` |
| POST | `/api/webhooks/square` | `PaymentController::squareWebhook` | `claude_reference/api/Controllers/PaymentController.php` |
| POST | `/api/parent/students/{id}/invite` | `InvitationController::invite` | `claude_reference/api/Controllers/InvitationController.php` |
| GET | `/api/parent/students/{id}/invitations` | `InvitationController::listInvitations` | `claude_reference/api/Controllers/InvitationController.php` |
| GET | `/api/parent/students/{id}/previous-sponsors` | `InvitationController::previousSponsors` | `claude_reference/api/Controllers/InvitationController.php` |
| GET | `/api/invite/{token}` | `InvitationController::resolveInvitation` | `claude_reference/api/Controllers/InvitationController.php` |
| GET | `/api/sponsor/dashboard` | `SponsorController::dashboard` | `claude_reference/api/Controllers/SponsorController.php` |
| GET | `/api/sponsor/unpaid-pledges` | `SponsorController::unpaidPledges` | `claude_reference/api/Controllers/SponsorController.php` |
| GET | `/api/public/returning/{code}` | `SponsorController::returning` | `claude_reference/api/Controllers/SponsorController.php` |
| GET | `/api/admin/sponsors` | `SponsorController::adminList` | `claude_reference/api/Controllers/SponsorController.php` |

## B) Frontend Pages / Routes Implemented
Source: `claude_reference/frontend/src/App.tsx` and `claude_reference/frontend/src/pages/**`.

| Route | Page Component | File |
|---|---|---|
| `/` | `HomePage` | `claude_reference/frontend/src/pages/HomePage.tsx` |
| `/about` | `AboutPage` | `claude_reference/frontend/src/pages/AboutPage.tsx` |
| `/how-it-works` | `HowItWorksPage` | `claude_reference/frontend/src/pages/HowItWorksPage.tsx` |
| `/faq` | `FAQPage` | `claude_reference/frontend/src/pages/FAQPage.tsx` |
| `/privacy` | `PrivacyPage` | `claude_reference/frontend/src/pages/PrivacyPage.tsx` |
| `/login` | `LoginPage` | `claude_reference/frontend/src/pages/auth/LoginPage.tsx` |
| `/register` | `RegisterPage` | `claude_reference/frontend/src/pages/auth/RegisterPage.tsx` |
| `/forgot-password` | `ForgotPasswordPage` | `claude_reference/frontend/src/pages/auth/ForgotPasswordPage.tsx` |
| `/admin/login` | `AdminLoginPage` | `claude_reference/frontend/src/pages/auth/AdminLoginPage.tsx` |
| `/sponsor` | `SponsorGatewayPage` | `claude_reference/frontend/src/pages/sponsor/SponsorGatewayPage.tsx` |
| `/sponsor/auth` | `SponsorAuthPage` | `claude_reference/frontend/src/pages/sponsor/SponsorAuthPage.tsx` |
| `/sponsor/login` | `SponsorLoginPage` | `claude_reference/frontend/src/pages/sponsor/SponsorLoginPage.tsx` |
| `/sponsor/check-email` | `SponsorCheckEmailPage` | `claude_reference/frontend/src/pages/sponsor/SponsorCheckEmailPage.tsx` |
| `/sponsor/magic-verify` | `MagicVerifyPage` | `claude_reference/frontend/src/pages/sponsor/MagicVerifyPage.tsx` |
| `/sponsor/thank-you` | `SponsorThankYouPage` | `claude_reference/frontend/src/pages/sponsor/SponsorThankYouPage.tsx` |
| `/sponsor/pledged` | `SponsorPledgedPage` | `claude_reference/frontend/src/pages/sponsor/SponsorPledgedPage.tsx` |
| `/sponsor/check-instructions` | `SponsorCheckInstructionsPage` | `claude_reference/frontend/src/pages/sponsor/SponsorCheckInstructionsPage.tsx` |
| `/sponsor/class` | `SponsorClassPage` | `claude_reference/frontend/src/pages/sponsor/SponsorClassPage.tsx` |
| `/sponsor/guest-pay` | `GuestPaymentPage` | `claude_reference/frontend/src/pages/sponsor/GuestPaymentPage.tsx` |
| `/sponsor/:token` | `SponsorLandingPage` | `claude_reference/frontend/src/pages/sponsor/SponsorLandingPage.tsx` |
| `/f/:userId` | `FamilySponsorPage` | `claude_reference/frontend/src/pages/sponsor/FamilySponsorPage.tsx` |
| `/s/:code` | `ChildToFamilyRedirect` | `claude_reference/frontend/src/components/ChildToFamilyRedirect.tsx` |
| `/invite/:token` | `ChildToFamilyRedirect` | `claude_reference/frontend/src/components/ChildToFamilyRedirect.tsx` |
| `/returning/:code` | `ReturningSponsorPage` | `claude_reference/frontend/src/pages/sponsor/ReturningSponsorPage.tsx` |
| `/student/login` | `StudentLoginPage` (legacy) | `claude_reference/frontend/src/pages/auth/StudentLoginPage.tsx` |
| `/teacher/login` | `TeacherLoginPage` | `claude_reference/frontend/src/pages/teacher/TeacherLoginPage.tsx` |
| `/teacher/register` | `TeacherRegisterPage` | `claude_reference/frontend/src/pages/teacher/TeacherRegisterPage.tsx` |
| `/teacher/set-password` | `TeacherSetPasswordPage` | `claude_reference/frontend/src/pages/teacher/TeacherSetPasswordPage.tsx` |
| `/student-login` | redirect → `/student/login` | `claude_reference/frontend/src/App.tsx` |
| `/parent/add-child` | redirect → `/onboarding/add-child` | `claude_reference/frontend/src/App.tsx` |
| `/onboarding/add-child` | `AddChildPage` | `claude_reference/frontend/src/pages/parent/AddChildPage.tsx` |
| `/onboarding/pledge` | `OnboardingPledgePage` | `claude_reference/frontend/src/pages/parent/OnboardingPledgePage.tsx` |
| `/onboarding/complete` | `OnboardingCompletePage` | `claude_reference/frontend/src/pages/parent/OnboardingCompletePage.tsx` |
| `/onboarding/re-enroll` | `ReEnrollmentPage` | `claude_reference/frontend/src/pages/onboarding/ReEnrollmentPage.tsx` |
| `/dashboard` | `DashboardPage` | `claude_reference/frontend/src/pages/parent/DashboardPage.tsx` |
| `/log-reading` | `LogReadingPage` | `claude_reference/frontend/src/pages/parent/LogReadingPage.tsx` |
| `/my-pledges` | `ViewPledgesPage` | `claude_reference/frontend/src/pages/parent/ViewPledgesPage.tsx` |
| `/invite` | `InviteSponsorsPage` | `claude_reference/frontend/src/pages/parent/InviteSponsorsPage.tsx` |
| `/children/:id/invite` | `InviteSponsorsPage` | `claude_reference/frontend/src/pages/parent/InviteSponsorsPage.tsx` |
| `/children/:id/add-sponsor` | `AddSponsorPage` | `claude_reference/frontend/src/pages/AddSponsorPage.tsx` |
| `/account` | `AccountSettingsPage` | `claude_reference/frontend/src/pages/AccountSettingsPage.tsx` |
| `/reading-logs/approve` | `VerifyLogsPage` | `claude_reference/frontend/src/pages/reading-logs/VerifyLogsPage.tsx` |
| `/children` | `ManageChildrenPage` | `claude_reference/frontend/src/pages/family/ManageChildrenPage.tsx` |
| `/children/:id` | `ChildDetailsPage` | `claude_reference/frontend/src/pages/family/ChildDetailsPage.tsx` |
| `/family/manage` | `ManageChildrenPage` | `claude_reference/frontend/src/pages/family/ManageChildrenPage.tsx` |
| `/family/children/:id/settings` | `ChildDetailsPage` | `claude_reference/frontend/src/pages/family/ChildDetailsPage.tsx` |
| `/family/sponsor-requests` | `SponsorRequestsPage` | `claude_reference/frontend/src/pages/family/SponsorRequestsPage.tsx` |
| `/family/sponsor-my-child` | `SponsorMyChildPage` | `claude_reference/frontend/src/pages/family/SponsorMyChildPage.tsx` |
| `/sponsor/dashboard` | `SponsorDashboardPage` | `claude_reference/frontend/src/pages/sponsor/SponsorDashboardPage.tsx` |
| `/sponsor/pay` | `SponsorPaymentPage` | `claude_reference/frontend/src/pages/sponsor/SponsorPaymentPage.tsx` |
| `/student` | `StudentDashboard` | `claude_reference/frontend/src/pages/student/StudentDashboard.tsx` |
| `/student/dashboard` | `StudentPinDashboardPage` | `claude_reference/frontend/src/pages/student/StudentPinDashboardPage.tsx` |
| `/student/log` | `StudentLogReadingPage` | `claude_reference/frontend/src/pages/student/StudentLogReadingPage.tsx` |
| `/student/books` | `StudentBooksPage` | `claude_reference/frontend/src/pages/student/StudentBooksPage.tsx` |
| `/teacher` | `TeacherDashboard` | `claude_reference/frontend/src/pages/teacher/TeacherDashboard.tsx` |
| `/teacher/log` | `TeacherLogReading` | `claude_reference/frontend/src/pages/teacher/TeacherLogReading.tsx` |
| `/parent/log-reading/:studentId` | redirect → `/log-reading` | `claude_reference/frontend/src/App.tsx` |
| `/parent/students/:studentId/invite` | redirect → `/invite` | `claude_reference/frontend/src/App.tsx` |
| `/parent/students/:studentId/pledges` | redirect → `/my-pledges` | `claude_reference/frontend/src/App.tsx` |
| `/parent/onboarding/pledge/:studentId` | redirect → `/onboarding/pledge` | `claude_reference/frontend/src/App.tsx` |
| `/parent/onboarding/complete/:studentId` | redirect → `/onboarding/complete` | `claude_reference/frontend/src/App.tsx` |
| `/admin` | `AdminDashboard` | `claude_reference/frontend/src/pages/admin/AdminDashboard.tsx` |
| `/admin/reading` | `AdminReadingLogsPage` | `claude_reference/frontend/src/pages/admin/AdminReadingLogsPage.tsx` |
| `/admin/outstanding` | `AdminOutstandingPage` | `claude_reference/frontend/src/pages/admin/AdminOutstandingPage.tsx` |
| `/admin/checks` | `AdminChecksPage` | `claude_reference/frontend/src/pages/admin/AdminChecksPage.tsx` |
| `/admin/emails` | `AdminEmailPage` | `claude_reference/frontend/src/pages/admin/AdminEmailPage.tsx` |
| `/admin/content` | `AdminSiteContentPage` | `claude_reference/frontend/src/pages/admin/AdminSiteContentPage.tsx` |
| `/admin/settings` | `AdminSettingsPage` | `claude_reference/frontend/src/pages/admin/AdminSettingsPage.tsx` |
| `/admin-users` | `AdminUsersPage` | `claude_reference/frontend/src/pages/AdminUsersPage.tsx` |
| `/admin-finance` | `AdminFinancePage` | `claude_reference/frontend/src/pages/AdminFinancePage.tsx` |
| `/admin/students` | `AdminStudentsPage` | `claude_reference/frontend/src/pages/admin/AdminStudentsPage.tsx` |
| `/admin/teachers` | `AdminTeachersPage` | `claude_reference/frontend/src/pages/admin/AdminTeachersPage.tsx` |
| `/admin/campaigns` | `AdminCampaignsPage` | `claude_reference/frontend/src/pages/admin/AdminCampaignsPage.tsx` |
| `/admin/pledges` | `AdminPledgesPage` | `claude_reference/frontend/src/pages/admin/AdminPledgesPage.tsx` |
| `/admin/payments` | `AdminPaymentsPage` | `claude_reference/frontend/src/pages/admin/AdminPaymentsPage.tsx` |
| `/admin/invite-links` | `AdminInviteLinksPage` | `claude_reference/frontend/src/pages/admin/AdminInviteLinksPage.tsx` |
| `/admin/sponsors` | `AdminSponsorsPage` | `claude_reference/frontend/src/pages/admin/AdminSponsorsPage.tsx` |
| `*` | `NotFound` | `claude_reference/frontend/src/pages/NotFound.tsx` |

## C) Shared UI Components Implemented
Source: `claude_reference/frontend/src/components/**`.

| Component | File |
|---|---|
| AlertDialog | `claude_reference/frontend/src/components/ui/alert-dialog.tsx` |
| FormField | `claude_reference/frontend/src/components/ui/form-field.tsx` |
| Tabs | `claude_reference/frontend/src/components/ui/tabs.tsx` |
| Card | `claude_reference/frontend/src/components/ui/card.tsx` |
| Slider | `claude_reference/frontend/src/components/ui/slider.tsx` |
| Popover | `claude_reference/frontend/src/components/ui/popover.tsx` |
| Progress | `claude_reference/frontend/src/components/ui/progress.tsx` |
| Sheet | `claude_reference/frontend/src/components/ui/sheet.tsx` |
| ScrollArea | `claude_reference/frontend/src/components/ui/scroll-area.tsx` |
| Label | `claude_reference/frontend/src/components/ui/label.tsx` |
| Sonner | `claude_reference/frontend/src/components/ui/sonner.tsx` |
| Accordion | `claude_reference/frontend/src/components/ui/accordion.tsx` |
| Tooltip | `claude_reference/frontend/src/components/ui/tooltip.tsx` |
| Alert | `claude_reference/frontend/src/components/ui/alert.tsx` |
| Switch | `claude_reference/frontend/src/components/ui/switch.tsx` |
| RadioGroup | `claude_reference/frontend/src/components/ui/radio-group.tsx` |
| Avatar | `claude_reference/frontend/src/components/ui/avatar.tsx` |
| Dialog | `claude_reference/frontend/src/components/ui/dialog.tsx` |
| Badge | `claude_reference/frontend/src/components/ui/badge.tsx` |
| Table | `claude_reference/frontend/src/components/ui/table.tsx` |
| Separator | `claude_reference/frontend/src/components/ui/separator.tsx` |
| Button | `claude_reference/frontend/src/components/ui/button.tsx` |
| Checkbox | `claude_reference/frontend/src/components/ui/checkbox.tsx` |
| Collapsible | `claude_reference/frontend/src/components/ui/collapsible.tsx` |
| DropdownMenu | `claude_reference/frontend/src/components/ui/dropdown-menu.tsx` |
| Select | `claude_reference/frontend/src/components/ui/select.tsx` |
| Textarea | `claude_reference/frontend/src/components/ui/textarea.tsx` |
| Input | `claude_reference/frontend/src/components/ui/input.tsx` |
| Skeleton | `claude_reference/frontend/src/components/ui/skeleton.tsx` |
| Form | `claude_reference/frontend/src/components/ui/form.tsx` |
| ProtectedRoute | `claude_reference/frontend/src/components/ProtectedRoute.tsx` |
| RequireAdmin | `claude_reference/frontend/src/components/auth/RequireAdmin.tsx` |
| RequireTeacher | `claude_reference/frontend/src/components/auth/RequireTeacher.tsx` |
| PublicLayout | `claude_reference/frontend/src/components/layout/PublicLayout.tsx` |
| PageHeader | `claude_reference/frontend/src/components/layout/PageHeader.tsx` |
| AdminSidebar | `claude_reference/frontend/src/components/layout/AdminSidebar.tsx` |
| BottomTabBar | `claude_reference/frontend/src/components/layout/BottomTabBar.tsx` |
| MobileNavDrawer | `claude_reference/frontend/src/components/layout/MobileNavDrawer.tsx` |
| Footer | `claude_reference/frontend/src/components/layout/Footer.tsx` |
| AppLayout | `claude_reference/frontend/src/components/layout/AppLayout.tsx` |
| MainNav | `claude_reference/frontend/src/components/layout/MainNav.tsx` |
| AdminLayout | `claude_reference/frontend/src/components/layout/AdminLayout.tsx` |
| BookContainer | `claude_reference/frontend/src/components/legacy/BookContainer.tsx` |
| BookIcon | `claude_reference/frontend/src/components/legacy/BookIcon.tsx` |
| ReadingGoalRing | `claude_reference/frontend/src/components/legacy/ReadingGoalRing.tsx` |
| Logo | `claude_reference/frontend/src/components/legacy/Logo.tsx` |
| ChildToFamilyRedirect | `claude_reference/frontend/src/components/ChildToFamilyRedirect.tsx` |
| BookSelector | `claude_reference/frontend/src/components/books/BookSelector.tsx` |
| ChildBooksSection | `claude_reference/frontend/src/components/dashboard/ChildBooksSection.tsx` |
| PledgesSection | `claude_reference/frontend/src/components/dashboard/PledgesSection.tsx` |
| ClassFundraisingShelf | `claude_reference/frontend/src/components/dashboard/ClassFundraisingShelf.tsx` |
| Layout (legacy wrapper) | `claude_reference/frontend/src/components/Layout.tsx` |

## D) DB Access Layer Patterns + Legacy Tables Touched
Source: `claude_reference/api/Repositories/*.php` and `claude_reference/api/Infrastructure/Database.php`.

- **Database access pattern:** PDO via `Readathon\Infrastructure\Database`, prepared statements used in repositories, PDO configured with `ATTR_EMULATE_PREPARES=false`.
- **Repositories and tables referenced:**

| Repository | Tables Touched | Notes |
|---|---|---|
| `AuditRepository` | `audit_log` | Writes audit events. |
| `CampaignRepository` | `campaigns` | Reads/writes campaign data. |
| `InvitationRepository` | `sponsor_invitations` | Sponsor invite records. |
| `InviteLinkRepository` | `invite_links` | Public invite link tokens. |
| `PaymentRepository` | `payments`, `payment_pledges`, `pledges` | Payment + pledge linkage. |
| `PledgeRepository` | `pledges`, `users` | Also uses expanded columns on `pledges`. |
| `ReadingLogRepository` | `readingLog` | Student reading log entries. |
| `SessionRepository` | `sessions` | Session persistence. |
| `StudentRepository` | `students`, `readingLog` | Student profile + total minutes aggregation. |
| `TeacherRepository` | `teachers` | Teacher profiles. |
| `UserRepository` | `users`, `admin` | Auth + admin lookup. |

