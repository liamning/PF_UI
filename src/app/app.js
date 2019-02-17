
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import './css/animate.css';
import './css/style.css';
import './css/plugins/datapicker/bootstrap-datetimepicker.min.css';
import 'ui-select/dist/select.min.css';
import './css/plugins/iCheck/custom.css'
import './css/app.css';
import "./css/plugins/dataTables/datatables.min.css";

import 'bootstrap';
import 'metisMenu';
import 'jquery-slimscroll';
import './js/plugins/datapicker/bootstrap-datetimepicker.min.js'
import 'icheck'
import "./js/plugins/dataTables/jquery.dataTables.min.js";

// import 'pace-js';
import angular from 'angular';
import uirouter from 'angular-ui-router';
import uibootstrap from 'angular-ui-bootstrap';

import datatables from "./js/plugins/dataTables/angular-datatables.min.js"

import angularsanitize from 'angular-sanitize';
import uiselect from 'ui-select';

import routing from './config';
import * as directive from './directive';
import * as controller from './controller';

// Minimalize menu when screen is less than 768px
$(window).bind("load resize", function () {
    if ($(document).width() < 769) {
        $('body').addClass('body-small')
    } else {
        $('body').removeClass('body-small')
    }
});



console.log(angular.version.full);
angular.module('app', [uirouter, uibootstrap, angularsanitize, uiselect, datatables])
    //config    
    .config(["$stateProvider", "$urlRouterProvider", routing])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('responseObserver');
    }])
    .factory('responseObserver', ["$q", "$window", function responseObserver($q, $window) {
        return {
            'responseError': function (errorResponse) {
                switch (errorResponse.status) {
                    case 403:
                        $window.location = '/';
                        break;
                    case 500:
                        $window.location = '/';
                        break;
                }
                return $q.reject(errorResponse);
            }
        };
    }])
    //directive
    .directive('topnavbar', directive.topnavbar)
    .directive('navigation', directive.navigation)
    .directive('footer', directive.footer)
    .directive('sideNavigation', ["$timeout", directive.sideNavigation])
    .directive('minimalizaSidebar', ["$timeout", directive.minimalizaSidebar])
    .directive('icheck', ["$timeout", directive.icheck])
    .directive('yearPicker', directive.yearPicker)
    .directive('dateTime', directive.dateTime)
    .directive('datePicker', directive.datePicker)
    .directive('timePicker', directive.timePicker)
    .directive('fileread', directive.fileread)
    .directive('workerInfo', directive.workerInfo)
    .directive('workerAttn', directive.workerAttn)
    .directive('workerPayroll', directive.workerPayroll)
    .directive('uiNumberMask',  ["$filter",directive.uiNumberMask])
    .directive('uiIntMask',  ["$filter",directive.uiIntMask])
    .directive('mySelect', ["$compile",directive.mySelect])
    .directive('myAsyncSelect', ["$compile",directive.myAsyncSelect])
    //component
    .directive('myTextbox',  ["$compile",directive.myTextbox])
    .directive('myNumber',  ["$compile",directive.myNumber])
    .directive('myInt',  ["$compile",directive.myInt])
    //contoller
    .controller("MainCtrl", ["$scope", "$state", "$http", "$rootScope", controller.MainCtrl])
    .controller("LoginCtrl", ["$scope", "$http", "$state", "$rootScope", controller.LoginCtrl])
    // .controller("SampleCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", controller.SampleCtrl])
    // .controller("SampleChildCtrl", ["$scope", "$http", "$window", controller.SampleChildCtrl])
    //.controller("TimeSlotCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", controller.TimeSlotCtrl])
    .controller("ClientCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", "$state", controller.ClientCtrl])
    .controller("IntroducerCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", controller.IntroducerCtrl])
    .controller("WorkerCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", "$state", controller.WorkerCtrl])
    .controller("PayrollGroupCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", controller.PayrollGroupCtrl])
    .controller("AttendanceImportCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", "$state", controller.AttendanceImportCtrl])
    .controller("AttendanceEntryCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", "$state", controller.AttendanceEntryCtrl])
    .controller("UserProfileCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", controller.UserProfileCtrl])
    .controller("ChangePasswordCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", controller.ChangePasswordCtrl])
    .controller("InquiryCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", "$state", controller.InquiryCtrl])
    .controller("AttendanceExportCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", "$state", controller.AttendanceExportCtrl])
    .controller("AttendanceInquiryCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", controller.AttendanceInquiryCtrl])
    .controller("PayrollCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", controller.PayrollCtrl])
    .controller("PayrollGenerationCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", controller.PayrollGenerationCtrl])
    .controller("TimeslotMappingCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", controller.TimeslotMappingCtrl])
    .controller("GeneralMasterCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", controller.GeneralMasterCtrl])
    .controller("HolidayCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", controller.HolidayCtrl])
    .controller("PayrollExportCtrl", ["$scope", "$http", "$document", "$timeout", "$rootScope", "$state", controller.PayrollExportCtrl])
    //application begin
    .run(["$transitions", "$rootScope", function ($transitions, $rootScope) {

        $rootScope.loginInfo = {};

        $transitions.onStart({ to: 'index.**' }, function (trans) {
            

            var stateTo = trans.$to();
            if(!$rootScope.loginInfo.UserID)
            return trans.router.stateService.target('login');

            $rootScope.loginInfo.includeMaster = stateTo.includes["index.master"];
            $rootScope.loginInfo.includeImport = stateTo.includes["index.import"];
            $rootScope.loginInfo.includeInquiry = stateTo.includes["index.inquiry"];
            $rootScope.loginInfo.includeReport = stateTo.includes["index.report"];
            $rootScope.loginInfo.includeSystem = stateTo.includes["index.system"];

        });
    }])
