<?php

require_once __DIR__ . '/../src/Support/Response.php';
require_once __DIR__ . '/../src/Support/Database.php';
require_once __DIR__ . '/../src/Support/Ids.php';
require_once __DIR__ . '/../src/Support/Auth.php';
require_once __DIR__ . '/../src/Support/AppException.php';
require_once __DIR__ . '/../src/Support/Session.php';
require_once __DIR__ . '/../src/Http/Request.php';

use App\Controller\ChildrenController;
use App\Controller\ChildrenPublicController;
use App\Controller\AuthController;
use App\Controller\PledgeController;
use App\Controller\PaymentController;
use App\Controller\GuestPayController;
use App\Controller\AdminGuestPayTokensController;
use App\Controller\ReadingLogsController;
use App\Controller\TeacherController;
use App\Controller\StudentAuthController;
use App\Controller\StudentReadingLogsController;
use App\Controller\ParentChildrenController;
use App\Controller\AdminAuthController;
use App\Controller\AdminMetricsController;
use App\Controller\AdminAlertsController;
use App\Controller\AdminReportsController;
use App\Controller\EventsController;
use App\Controller\SiteContentController;
use App\Controller\TeachersAdminController;
use App\Controller\PaymentsAdminController;
use App\Http\Request;
use App\Repository\ReadingLogRepository;
use App\Repository\StudentRepository;
use App\Repository\TeacherRepository;
use App\Repository\AdminRepository;
use App\Repository\AdminMetricsRepository;
use App\Repository\AdminReportsRepository;
use App\Repository\CampaignRepository;
use App\Repository\PledgeRepository;
use App\Repository\PaymentRepository;
use App\Repository\UserRepository;
use App\Repository\GuestPayTokenRepository;
use App\Service\ParentReadingLogService;
use App\Service\StudentAuthService;
use App\Service\StudentReadingLogService;
use App\Service\TeacherReadingLogService;
use App\Service\TeacherRosterService;
use App\Service\AdminAuthService;
use App\Service\AdminMetricsService;
use App\Service\AdminReportsService;
use App\Service\AuthService;
use App\Service\PledgeService;
use App\Service\PaymentService;
use App\Support\Response;
use App\Support\Session;

Session::start();

$request = Request::fromGlobals();
$path = rtrim($request->path, '/');
if ($path === '') {
    $path = '/';
}

$headers = array_change_key_case($request->headers, CASE_LOWER);

$require = static function (string $relativePath): void {
    require_once __DIR__ . '/../src/' . $relativePath;
};

$instances = [];
$make = static function (string $key, callable $factory) use (&$instances) {
    if (!array_key_exists($key, $instances)) {
        $instances[$key] = $factory();
    }

    return $instances[$key];
};

$getStudentRepository = static function () use ($make, $require) {
    return $make('studentRepository', function () use ($require) {
        $require('Repository/StudentRepository.php');
        return new StudentRepository();
    });
};

$getReadingLogRepository = static function () use ($make, $require) {
    return $make('readingLogRepository', function () use ($require) {
        $require('Repository/ReadingLogRepository.php');
        return new ReadingLogRepository();
    });
};

$getStudentAuthService = static function () use ($make, $require, $getStudentRepository) {
    return $make('studentAuthService', function () use ($require, $getStudentRepository) {
        $require('Service/StudentAuthService.php');
        $require('Repository/UserRepository.php');
        return new StudentAuthService($getStudentRepository(), new UserRepository());
    });
};

$getStudentReadingLogService = static function () use ($make, $require, $getReadingLogRepository) {
    return $make('studentReadingLogService', function () use ($require, $getReadingLogRepository) {
        $require('Service/StudentReadingLogService.php');
        return new StudentReadingLogService($getReadingLogRepository());
    });
};

$getStudentAuthController = static function () use ($make, $require, $getStudentAuthService) {
    return $make('studentAuthController', function () use ($require, $getStudentAuthService) {
        $require('Controller/StudentAuthController.php');
        return new StudentAuthController($getStudentAuthService());
    });
};

$getStudentLogsController = static function () use ($make, $require, $getStudentReadingLogService) {
    return $make('studentLogsController', function () use ($require, $getStudentReadingLogService) {
        $require('Controller/StudentReadingLogsController.php');
        return new StudentReadingLogsController($getStudentReadingLogService());
    });
};

$getReadingLogsController = static function () use ($make, $require, $getStudentRepository, $getReadingLogRepository, $getStudentReadingLogService) {
    return $make('readingLogsController', function () use ($require, $getStudentRepository, $getReadingLogRepository, $getStudentReadingLogService) {
        $require('Service/ParentReadingLogService.php');
        $require('Service/TeacherRosterService.php');
        $require('Service/TeacherReadingLogService.php');
        $require('Controller/ReadingLogsController.php');

        $parentLogService = new ParentReadingLogService($getReadingLogRepository(), $getStudentRepository());
        $teacherLogService = new TeacherReadingLogService($getReadingLogRepository());
        $rosterService = new TeacherRosterService($getStudentRepository());

        return new ReadingLogsController($parentLogService, $getStudentReadingLogService(), $teacherLogService, $rosterService);
    });
};

$getChildrenController = static function () use ($make, $require, $getStudentRepository) {
    return $make('childrenController', function () use ($require, $getStudentRepository) {
        $require('Service/TeacherRosterService.php');
        $require('Controller/ChildrenController.php');

        $rosterService = new TeacherRosterService($getStudentRepository());
        return new ChildrenController($rosterService, $getStudentRepository());
    });
};

$getParentChildrenController = static function () use ($make, $require, $getStudentRepository) {
    return $make('parentChildrenController', function () use ($require, $getStudentRepository) {
        $require('Controller/ParentChildrenController.php');
        return new ParentChildrenController($getStudentRepository());
    });
};

$getTeacherController = static function () use ($make, $require) {
    return $make('teacherController', function () use ($require) {
        $require('Repository/TeacherRepository.php');
        $require('Controller/TeacherController.php');

        $teacherRepository = new TeacherRepository();
        return new TeacherController($teacherRepository);
    });
};

$getAdminAuthController = static function () use ($make, $require) {
    return $make('adminAuthController', function () use ($require) {
        $require('Repository/AdminRepository.php');
        $require('Service/AdminAuthService.php');
        $require('Controller/AdminAuthController.php');

        $adminRepository = new AdminRepository();
        $adminAuthService = new AdminAuthService($adminRepository);
        return new AdminAuthController($adminAuthService);
    });
};

$getAdminMetricsController = static function () use ($make, $require) {
    return $make('adminMetricsController', function () use ($require) {
        $require('Repository/AdminMetricsRepository.php');
        $require('Service/AdminMetricsService.php');
        $require('Controller/AdminMetricsController.php');

        $adminMetricsRepository = new AdminMetricsRepository();
        $adminMetricsService = new AdminMetricsService($adminMetricsRepository);
        return new AdminMetricsController($adminMetricsService);
    });
};

$getAdminAlertsController = static function () use ($make, $require) {
    return $make('adminAlertsController', function () use ($require) {
        $require('Repository/AdminReportsRepository.php');
        $require('Controller/AdminAlertsController.php');

        $adminReportsRepository = new AdminReportsRepository();
        return new AdminAlertsController($adminReportsRepository);
    });
};

$getAdminReportsController = static function () use ($make, $require) {
    return $make('adminReportsController', function () use ($require) {
        $require('Repository/AdminReportsRepository.php');
        $require('Service/AdminReportsService.php');
        $require('Controller/AdminReportsController.php');

        $adminReportsRepository = new AdminReportsRepository();
        $adminReportsService = new AdminReportsService($adminReportsRepository);
        return new AdminReportsController($adminReportsService);
    });
};

$getEventsController = static function () use ($make, $require) {
    return $make('eventsController', function () use ($require) {
        $require('Repository/CampaignRepository.php');
        $require('Controller/EventsController.php');

        $campaignRepository = new CampaignRepository();
        return new EventsController($campaignRepository);
    });
};

$getSiteContentController = static function () use ($make, $require) {
    return $make('siteContentController', function () use ($require) {
        $require('Controller/SiteContentController.php');
        return new SiteContentController(__DIR__ . '/../storage/site_content.json');
    });
};

$getTeachersAdminController = static function () use ($make, $require) {
    return $make('teachersAdminController', function () use ($require) {
        $require('Repository/TeacherRepository.php');
        $require('Controller/TeachersAdminController.php');

        $teacherRepository = new TeacherRepository();
        return new TeachersAdminController($teacherRepository);
    });
};

$getPaymentsAdminController = static function () use ($make, $require) {
    return $make('paymentsAdminController', function () use ($require) {
        $require('Repository/PaymentRepository.php');
        $require('Repository/PledgeRepository.php');
        $require('Controller/PaymentsAdminController.php');

        $paymentRepository = new PaymentRepository();
        $pledgeRepository = new PledgeRepository();
        return new PaymentsAdminController($paymentRepository, $pledgeRepository);
    });
};

$getAuthController = static function () use ($make, $require) {
    return $make('authController', function () use ($require) {
        $require('Repository/UserRepository.php');
        $require('Service/AuthService.php');
        $require('Controller/AuthController.php');

        $userRepository = new UserRepository();
        $loginService = new AuthService($userRepository);
        return new AuthController($loginService);
    });
};

$getPledgeController = static function () use ($make, $require, $getStudentRepository) {
    return $make('pledgeController', function () use ($require, $getStudentRepository) {
        $require('Repository/PledgeRepository.php');
        $require('Service/PledgeService.php');
        $require('Controller/PledgeController.php');

        $pledgeRepository = new PledgeRepository();
        $pledgeService = new PledgeService($pledgeRepository, $getStudentRepository());
        return new PledgeController($pledgeService, $pledgeRepository, $getStudentRepository());
    });
};

$getPaymentController = static function () use ($make, $require) {
    return $make('paymentController', function () use ($require) {
        $require('Repository/PaymentRepository.php');
        $require('Repository/PledgeRepository.php');
        $require('Service/PaymentService.php');
        $require('Controller/PaymentController.php');

        $paymentRepository = new PaymentRepository();
        $pledgeRepository = new PledgeRepository();
        $paymentService = new PaymentService($paymentRepository, $pledgeRepository);
        return new PaymentController($paymentService);
    });
};

$getChildrenPublicController = static function () use ($make, $require, $getStudentRepository) {
    return $make('childrenPublicController', function () use ($require, $getStudentRepository) {
        $require('Controller/ChildrenPublicController.php');
        return new ChildrenPublicController($getStudentRepository());
    });
};

$getGuestPayController = static function () use ($make, $require, $getStudentRepository) {
    return $make('guestPayController', function () use ($require, $getStudentRepository) {
        $require('Repository/PledgeRepository.php');
        $require('Repository/GuestPayTokenRepository.php');
        $require('Repository/PaymentRepository.php');
        $require('Service/PaymentService.php');
        $require('Controller/GuestPayController.php');

        $pledgeRepository = new PledgeRepository();
        $guestPayTokenRepository = new GuestPayTokenRepository();
        $paymentRepository = new PaymentRepository();
        $paymentService = new PaymentService($paymentRepository, $pledgeRepository);

        return new GuestPayController($pledgeRepository, $getStudentRepository(), $guestPayTokenRepository, $paymentService);
    });
};

$getAdminGuestPayTokensController = static function () use ($make, $require) {
    return $make('adminGuestPayTokensController', function () use ($require) {
        $require('Repository/GuestPayTokenRepository.php');
        $require('Repository/PledgeRepository.php');
        $require('Controller/AdminGuestPayTokensController.php');

        $guestPayTokenRepository = new GuestPayTokenRepository();
        $pledgeRepository = new PledgeRepository();

        return new AdminGuestPayTokensController($guestPayTokenRepository, $pledgeRepository);
    });
};

if (isset($headers['x-test-user'])) {
    if (getenv('ALLOW_TEST_AUTH') !== '1') {
        Response::error('UNAUTHORIZED', 'Test auth disabled.', null, 401);
        return;
    }

    $testUser = trim((string) $headers['x-test-user']);
    if ($testUser === '') {
        Response::error('VALIDATION_ERROR', 'Invalid test user header.', null, 422);
        return;
    }

    $userRepositoryPath = __DIR__ . '/../src/Repository/UserRepository.php';
    if (!file_exists($userRepositoryPath)) {
        Response::error('NOT_IMPLEMENTED', 'User repository unavailable.', null, 501);
        return;
    }

    require_once $userRepositoryPath;
    $userRepo = new UserRepository();
    $user = $userRepo->findByUsername($testUser);
    if (!$user) {
        Response::error('UNAUTHORIZED', 'Test user not found.', null, 401);
        return;
    }

    \App\Support\Session::setParent([
        'user_id' => (int) $user['id'],
        'username' => $user['username'],
    ]);
}

if (!str_starts_with($path, '/api')) {
    Response::error('NOT_FOUND', 'Route not found.', null, 404);
    return;
}

if (!Session::teacher()) {
    $allowTestAuth = (getenv('ALLOW_TEST_AUTH') === '1') || (getenv('APP_ENV') === 'local');
    $teacherHeader = $request->headers['X-Teacher-Username'] ?? $request->headers['x-teacher-username'] ?? null;
    if ($allowTestAuth && $teacherHeader) {
        $teacherRepositoryPath = __DIR__ . '/../src/Repository/TeacherRepository.php';
        if (file_exists($teacherRepositoryPath)) {
            require_once $teacherRepositoryPath;
            $teacherRepository = new TeacherRepository();
            $teacher = $teacherRepository->findByUsername(trim((string) $teacherHeader));
            if ($teacher) {
                Session::setTeacher([
                    'teacher_username' => $teacher['teacherUserName'],
                ]);
            }
        }
    }
}

switch ([$request->method, $path]) {
    case ['POST', '/api/functions/student-login']:
        $getStudentAuthController()->login($request);
        break;
    case ['GET', '/api/student/me']:
        $getStudentAuthController()->me($request);
        break;
    case ['GET', '/api/student/reading-logs']:
        $getStudentLogsController()->list($request);
        break;
    case ['POST', '/api/student/reading-logs']:
        $studentSession = Session::student();
        if (!$studentSession || empty($studentSession['stSponsorId'])) {
            Response::error('UNAUTHORIZED', 'Student session required.', null, 401);
            break;
        }

        try {
            $created = $getStudentReadingLogService()->create($studentSession['stSponsorId'], $request->body);
        } catch (\InvalidArgumentException $e) {
            Response::error('VALIDATION_ERROR', $e->getMessage(), null, 422);
            break;
        }

        Response::ok([
            'id' => $created['logId'],
            'minutes' => (int) $created['minutes'],
            'book_title' => $created['book_title'],
            'logged_at' => $created['dateRead'],
            'status' => $created['status'],
        ], 201);
        break;
    case ['POST', '/api/me/reading-logs']:
        $getReadingLogsController()->createParent($request);
        break;
    case ['GET', '/api/me/reading-logs']:
        $getReadingLogsController()->list($request);
        break;
    case ['POST', '/api/reading_logs']:
        if (Session::teacher()) {
            $getReadingLogsController()->create($request);
            break;
        }
        Response::error('FORBIDDEN', 'Teacher access required.', null, 403);
        break;
    case ['POST', '/api/admin/auth/login']:
        $getAdminAuthController()->login($request);
        break;
    case ['GET', '/api/admin/metrics']:
        $getAdminMetricsController()->show();
        break;
    case ['GET', '/api/admin/alerts']:
        $getAdminAlertsController()->list();
        break;
    case ['GET', '/api/admin/activity']:
        $getAdminReportsController()->activity($request);
        break;
    case ['GET', '/api/admin/reports/outstanding']:
        $getAdminReportsController()->outstanding($request);
        break;
    case ['GET', '/api/admin/reports/students']:
        $getAdminReportsController()->exportStudents($request);
        break;
    case ['GET', '/api/admin/reports/pledges']:
        $getAdminReportsController()->exportPledges($request);
        break;
    case ['GET', '/api/admin/reports/payments']:
        $getAdminReportsController()->exportPayments($request);
        break;
    case ['POST', '/api/admin/guest-pay-tokens']:
        $getAdminGuestPayTokensController()->create($request);
        break;
    case ['GET', '/api/admin/reports/finance']:
        $getAdminReportsController()->exportFinance($request);
        break;
    case ['GET', '/api/admin/reports/checks']:
        $getAdminReportsController()->exportChecks($request);
        break;
    case ['GET', '/api/teachers']:
        if (Session::admin()) {
            $getTeachersAdminController()->list();
            break;
        }
        $getTeacherController()->list($request);
        break;
    case ['POST', '/api/teachers']:
        $getTeachersAdminController()->create($request);
        break;
    case ['GET', '/api/payments']:
        $getPaymentsAdminController()->list($request);
        break;
    case ['POST', '/api/payments']:
        $getPaymentsAdminController()->create($request);
        break;
    case ['GET', '/api/events']:
        if (($request->query['is_active'] ?? '') === 'true') {
            $getEventsController()->active();
            break;
        }
        Response::error('NOT_FOUND', 'Route not found.', null, 404);
        break;
    case ['GET', '/api/site-content']:
        $getSiteContentController()->list();
        break;
    case ['GET', '/api/site_content']:
        $getSiteContentController()->list();
        break;
    case ['GET', '/api/children']:
        $getChildrenController()->list($request);
        break;
    case ['GET', '/api/me/children']:
        $getParentChildrenController()->list($request);
        break;
    case ['GET', '/api/reading_logs']:
        if (Session::teacher()) {
            $getReadingLogsController()->list($request);
            break;
        }
        Response::error('FORBIDDEN', 'Teacher access required.', null, 403);
        break;
    case ['POST', '/api/auth/token']:
        $getAuthController()->login($request);
        break;
    case ['POST', '/api/auth/login']:
        $getAuthController()->parentLogin($request);
        break;
    case ['POST', '/api/auth/logout']:
        $getAuthController()->logout();
        break;
    case ['GET', '/api/children_public_safe']:
        $getChildrenPublicController()->list($request);
        break;
    case ['POST', '/api/pledges']:
        $getPledgeController()->create($request);
        break;
    case ['GET', '/api/pledges']:
        $getPledgeController()->list($request);
        break;
    case ['POST', '/api/functions/process-square-payment']:
        $getPaymentController()->processSquarePayment($request);
        break;
    case ['POST', '/api/functions/notify-check-payment']:
        $getPaymentController()->notifyCheckPayment($request);
        break;
    default:
        if (preg_match('#^/api/guest/pay/([^/]+)$#', $path, $matches)) {
            $token = $matches[1];
            if ($request->method === 'GET') {
                $getGuestPayController()->show($request, $token);
                break;
            }
        }

        if (preg_match('#^/api/guest/pay/([^/]+)/checkout$#', $path, $matches)) {
            $token = $matches[1];
            if ($request->method === 'POST') {
                $getGuestPayController()->checkout($request, $token);
                break;
            }
        }

        if (preg_match('#^/api/pledges/([^/]+)$#', $path, $matches)) {
            $pledgeId = $matches[1];
            if ($request->method === 'PATCH') {
                $getPledgeController()->update($request, $pledgeId);
                break;
            }
            if ($request->method === 'DELETE') {
                $getPledgeController()->delete($request, $pledgeId);
                break;
            }
        }

        if (preg_match('#^/api/me/reading-logs/([^/]+)$#', $path, $matches)) {
            $logId = $matches[1];
            if ($request->method === 'PATCH') {
                $getReadingLogsController()->updateParent($request, $logId);
                break;
            }
            if ($request->method === 'DELETE') {
                $getReadingLogsController()->deleteParent($request, $logId);
                break;
            }
        }

        if (preg_match('#^/api/student/reading-logs/([^/]+)$#', $path, $matches)) {
            $logId = $matches[1];
            if ($request->method === 'PATCH') {
                $studentSession = Session::student();
                if (!$studentSession || empty($studentSession['stSponsorId'])) {
                    Response::error('UNAUTHORIZED', 'Student session required.', null, 401);
                    break;
                }

                try {
                    $updated = $getStudentReadingLogService()->update($studentSession['stSponsorId'], $logId, $request->body);
                } catch (\App\Support\AppException $e) {
                    Response::error($e->codeName, $e->getMessage(), null, $e->status);
                    break;
                }

                Response::ok([
                    'id' => $updated['logId'],
                    'minutes' => (int) $updated['minutes'],
                    'book_title' => $updated['book_title'],
                    'logged_at' => $updated['dateRead'],
                    'status' => $updated['status'],
                ]);
                break;
            }
            if ($request->method === 'DELETE') {
                $studentSession = Session::student();
                if (!$studentSession || empty($studentSession['stSponsorId'])) {
                    Response::error('UNAUTHORIZED', 'Student session required.', null, 401);
                    break;
                }

                try {
                    $getStudentReadingLogService()->delete($studentSession['stSponsorId'], $logId);
                } catch (\App\Support\AppException $e) {
                    Response::error($e->codeName, $e->getMessage(), null, $e->status);
                    break;
                }

                Response::ok(['success' => true]);
                break;
            }
        }

        if (preg_match('#^/api/teachers/(\\d+)$#', $path, $matches)) {
            $teacherId = (int) $matches[1];
            if ($request->method === 'PATCH') {
                $getTeachersAdminController()->update($request, $teacherId);
                break;
            }
            if ($request->method === 'DELETE') {
                $getTeachersAdminController()->delete($teacherId);
                break;
            }
        }

        Response::error('NOT_FOUND', 'Route not found.', null, 404);
        break;
}
