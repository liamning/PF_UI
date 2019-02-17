/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
// export default function routing($urlRouterProvider, $locationProvider) {
//   $locationProvider.html5Mode(true);
//   $urlRouterProvider.otherwise('/');
// }


export default function config($stateProvider, $urlRouterProvider) {

    //$urlRouterProvider.otherwise("/index/main");
    $urlRouterProvider.otherwise("/login");

    // $urlRouterProvider.otherwise("/login");


    $stateProvider
        
        .state('login', {
            url: "/login",
            template: require("./views/login.html"),
        })

        .state('index', {
            abstract: true,
            url: "/index",
            template: require("./views/common/content.html"),
        })
        .state('index.master', {
            abstract: true,
            url: "/master",
        })
        .state('index.import', {
            abstract: true,
            url: "/import", 
        })
        .state('index.entry', {
            abstract: true,
            url: "/entry", 
        })
        .state('index.system', {
            abstract: true,
            url: "/system", 
        })
        .state('index.inquiry', {
            abstract: true,
            url: "/inquiry", 
        })
        .state('index.report', {
            abstract: true,
            url: "/report", 
        })

        .state('index.main', {
            url: "/main",
            template: require("./views/inquiry/Inquiry.html"),
        }) 
        // .state('index.inquiry.Inquiry', {
        //     url: "/Inquiry",
        //     template: require("./views/inquiry/Inquiry.html"),
        // })
        .state('index.report.attendance', {
            url: "/attendance",
            template: require("./views/report/attendance.html"),
        })
        .state('index.report.payroll', {
            url: "/payroll",
            template: require("./views/report/payroll.html"),
        })
        .state('index.report.payrollSummary', {
            url: "/payrollSummary",
            template: require("./views/report/payrollSummary.html"),
        })
        .state('index.import.TimeslotMapping', {
            url: "/TimeslotMapping",
            template: require("./views/import/TimeslotMapping.html"),
        })
        .state('index.master.PayrollGroup', {
            url: "/PayrollGroup",
            template: require("./views/master/PayrollGroup.html"),
        })
        .state('index.master.AttendanceEntry', {
            url: "/AttendanceEntry",
            template: require("./views/master/AttendanceEntry.html"),
        })
        .state('index.master.Introducer', {
            url: "/Introducer",
            template: require("./views/master/Introducer.html"),
            module: "master",
        })
        .state('index.master.Holiday', {
            url: "/Holiday",
            template: require("./views/master/Holiday.html"),
            module: "master",
        })
        .state('index.master.GeneralMaster', {
            url: "/GeneralMaster",
            template: require("./views/master/GeneralMaster.html"),
            module: "master",
        })
        .state('index.master.Client', {
            url: "/Client",
            template: require("./views/master/Client.html"),
        })
        .state('index.master.Worker', {
            url: "/Worker",
            //url: "/Worker",
            template: require("./views/master/Worker.html"),
        })
        .state('index.import.PayrollGeneration', {
            url: "/PayrollGeneration",
            //url: "/Worker",
            template: require("./views/import/PayrollGeneration.html"),
        })
        .state('index.import.Attendance', {
            url: "/Attendance",
            template: require("./views/import/Attendance.html"),
        })
        .state('index.system.UserProfile', {
            url: "/UserProfile",
            template: require("./views/system/UserProfile.html"),
        })
        .state('index.system.ChangePassword', {
            url: "/ChangePassword",
            template: require("./views/system/ChangePassword.html"),
        })
}
