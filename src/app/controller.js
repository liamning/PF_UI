/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */
const host = window.host;

const getCheckDigitNumber = function (letter) {
    var result = letter.charCodeAt(0) - 55;
    return result;
}

const hkIDCheckDigit = function (hkID) {
    var firstLetter;
    var sixNumber;
    var checkDigit;
    var checkDigitCal;
    if (hkID.length == 9) {
        firstLetter = hkID.substring(0, 2);
        sixNumber = hkID.substring(2, 8);
        checkDigit = hkID.substring(8, 9);

        checkDigitCal = 0;
        var i = 0;
        for (var letter; letter = firstLetter.charAt(i); i++) {
            checkDigitCal += parseInt(getCheckDigitNumber(letter)) * (9 - i);
        }
        for (var letter; letter = sixNumber.charAt(i - 2); i++) {
            checkDigitCal += parseInt(letter) * (9 - i);
        }

    } else if (hkID.length == 8) {
        firstLetter = hkID.substring(0, 1);
        sixNumber = hkID.substring(1, 7);
        checkDigit = hkID.substring(7, 8);


        checkDigitCal = 36 * 9;
        var i = 0;
        for (var letter; letter = firstLetter.charAt(i); i++) {
            checkDigitCal += parseInt(getCheckDigitNumber(letter)) * (8 - i);
        }
        for (var letter; letter = sixNumber.charAt(i - 1); i++) {
            checkDigitCal += parseInt(letter) * (8 - i);
        }
    } else {
        alert("HKID invalid");
        return false;
    }

    checkDigitCal = 11 - checkDigitCal % 11;

    if (checkDigitCal != checkDigit) {
        alert("HKID invalid");
        return false;
    }

    console.log(`${checkDigitCal} = ${checkDigit}`);

    return true;

}


export function MainCtrl($scope, $state, $http, $rootScope) {
    console.log("MainCtrl");
    //$scope.loginID = "Administrator";

    //$scope.main={name:'123123'};

    $scope.refresh_ui_select_list = {};
    $scope.refresh_ui_select = function (table, input, limit, includeInput, callback) {
        if (limit && (!input || input.length < limit)) return;
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "refreshList", Table: table, Input: input }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            console.log('refresh_ui_select [' + table + '] [Done].');

            if (response) {
                $scope.refresh_ui_select_list[table] = response;
                if (response && input && includeInput)
                    response.unshift({
                        'Code': input,
                        'Desc': input,
                    });
            }
            if (callback)
                callback(response);
        });

    }
    $scope.ui_select_change = function (table) {
        $scope.refresh_ui_select_list[table].length = 0;
    }


    $scope.generalMaster = {};
    $scope.getGeneralMasterList = function (categories, callback) {
        var index;
        for (var pro in $scope.generalMaster) {
            index = categories.indexOf(pro);
            if (index >= 0) {
                categories.splice(index, 1);
            }
        }

        if (categories.length == 0) return;

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "getGeneralMasterList", categories: JSON.stringify(categories) }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {

                for (pro in response) {
                    if ($scope.generalMaster[pro]) $scope.generalMaster[pro].length = 0;
                    $scope.generalMaster[pro] = response[pro];
                }
                //console.log($scope.generalMaster);
            }

            if (callback)
                callback(response);
        });
    }

    $scope.postToServer = function (input) {

        $http({
            method: 'POST', withCredentials: true,
            url: input.url ? input.url : host + '/HttpHandler/BatchHandler.ashx',
            data: $.param({ params: JSON.stringify(input.data) }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response.error) {
                alert(response.error);
                return;
            }
            for (var pro in response) {
                if (response[pro])
                    response[pro] = JSON.parse(response[pro]);
            }

            if (input.callback)
                input.callback(response);
        });

    }

    $rootScope.loginInfo = { ...$rootScope.loginInfo, ...window.LoginInfo };
    // $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    //     //console.log(fromState.name);
    //     $scope.main.stateName = toState.name;
    //     if (fromState.name == "login") return;

    //     if (!$rootScope.LoginInfo.UserID && toState.name != "login") {
    //         event.preventDefault();
    //         return $state.go('login');
    //     }
    //     return;
    // });
};

export function LoginCtrl($scope, $http, $state, $rootScope) {

    var vm = this;

    //object initialization
    (function () {
        $scope.loginObj = {
            UserID: 'Administrator',
            Password: 2,
        };


    })();

    $scope.login = function () {

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/LoginHandler.ashx',
            data: $.param({
                action: "login",
                UserID: $scope.loginObj.UserID,
                Password: $scope.loginObj.Password
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {

            response = response.data;

            //console.log("success");

            if (response.result == "1") {
                $rootScope.loginInfo.UserID = $scope.loginObj.UserID;
                $state.go("index.main");
            }

            else {
                alert('Invalid User ID or Password');
            }
        });

    };


}

// export function TimeSlotCtrl($scope, $http, $document, $timeout, $rootScope) {

//     var vm = this;

//     //object initialization
//     (function () {
//         $scope.timeSlotObj = {
//         };
//         $scope.editMode = [];

//         $scope.templateURL = {
//             name: "Timeslot",
//             url: '',
//             pageNo: 0
//         };

//         $scope.viewsList = [];
//         $scope.viewsList[$scope.templateURL.pageNo] = {
//             name: $scope.templateURL.name,
//             url: $scope.templateURL.url
//         };

//         $scope.getGeneralMasterList(["TimeSlotType"]);

//     })();

//     $scope.timeSlotIDChange = function () {


//         $scope.postToServer({
//             data: [{
//                 action: "getTimeSlot",
//                 TimeSlotCode: $scope.timeSlotObj.TimeSlotCode
//             }],
//             callback: function (response) {
//                 response = response["getTimeSlot"];

//                 if (response)
//                     $scope.timeSlotObj = response;
//                 else {
//                     confirm("Confirm to Create a new record?")
//                     $scope.timeSlotObj = {
//                         TimeSlotCode: $scope.timeSlotObj.TimeSlotCode,
//                     };
//                 }

//                 ////console.log($scope.timeSlotObj);
//             }
//         });


//     }

//     $scope.save = function () {
//         $scope.submitted = true;
//         if ($scope.userForm.$invalid) return;

//         $scope.postToServer({
//             data: [{
//                 action: "saveTimeSlot",
//                 TimeSlotInfo: JSON.stringify($scope.timeSlotObj)
//             }],
//             callback: function (response) {
//                 ////console.log(response);
//                 alert(response["saveTimeSlot"].message);
//             }
//         });
//     };

//     $scope.delete = function () {

//         if (!$scope.timeSlotObj.TimeSlotCode) return;

//         $scope.postToServer({
//             data: [{
//                 action: "deleteTimeSlot",
//                 TimeSlotCode: $scope.timeSlotObj.TimeSlotCode
//             }],
//             callback: function (response) {
//                 ////console.log(response);
//                 alert(response["deleteTimeSlot"].message);
//             }
//         });
//     };

// }

export function ClientCtrl($scope, $http, $document, $timeout, $rootScope, $state) {

    var vm = this;

    //object initialization
    (function () {
        $scope.clientObj = {
        };
        $scope.editMode = [];

        $scope.templateURL = {
            name: "Client",
            url: '',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };

        $scope.getGeneralMasterList(["Gender", "TimeSlot", "Type", "Interval", "ClientType", "PositionGrade"]);

    })();

    $scope.clientIDChange = function () {


        $scope.postToServer({
            data: [{
                action: "getClient",
                ClientCode: $scope.clientObj.ClientCode
            }],
            callback: function (response) {
                response = response["getClient"];

                if (response)
                    $scope.clientObj = response;
                else {
                    confirm("Confirm to Create a new record?")
                    $scope.clientObj = {
                        ClientCode: $scope.clientObj.ClientCode,
                    };
                }

            }
        });


    }

    $scope.save = function () {
        $scope.submitted = true;
        if ($scope.userForm.$invalid) return;

        $scope.postToServer({
            data: [{
                action: "saveClient",
                ClientInfo: JSON.stringify($scope.clientObj)
            }],
            callback: function (response) {
                ////console.log(response);
                alert(response["saveClient"].message);
            }
        });
    };

    $scope.delete = function () {

        if (!$scope.clientObj.ClientCode) return;

        $scope.postToServer({
            data: [{
                action: "deleteClient",
                ClientCode: $scope.clientObj.ClientCode
            }],
            callback: function (response) {
                ////console.log(response);
                alert(response["deleteClient"].message);
            }
        });
    };

    $scope.import = function () {

        if (!$scope.clientObj.ClientCode) return;
        $rootScope.clientObj = $scope.clientObj;
        $state.go("import.Attendance");
    };

    $scope.addBU = function () {

        if (!$scope.clientObj.BUList) $scope.clientObj.BUList = [];
        var rowNo = $scope.clientObj.BUList.length + 1;
        $scope.clientObj.BUList.push({
            RowNo: rowNo
        });
    }

    $scope.deleteBU = function ($index) {
        $scope.clientObj.BUList.splice($index, 1);
    }


    $scope.saveRate = function () {

        //console.log($scope.hourlyRateMapping);

        if ($scope.clientObj.ClientCode && $scope.clientObj.CurrentBU && $scope.clientObj.PositionGrade)
            $scope.postToServer({
                data: [{
                    action: "saveClientHourlyRateMapping",
                    ClientCode: $scope.clientObj.ClientCode,
                    BUCode: $scope.clientObj.CurrentBU,
                    PositionGrade: $scope.clientObj.PositionGrade,
                    HourlyRateMapping: $scope.hourlyRateMapping,
                }],
                callback: function (response) {
                    var result = response['saveClientHourlyRateMapping'];
                    alert(result.message);


                }
            });

    }



    $scope.getRate = function () {
        if ($scope.clientObj.ClientCode && $scope.clientObj.CurrentBU && $scope.clientObj.PositionGrade)
            $scope.postToServer({
                data: [{
                    action: "getClientHourlyRateMapping",
                    ClientCode: $scope.clientObj.ClientCode,
                    BUCode: $scope.clientObj.CurrentBU,
                    PositionGrade: $scope.clientObj.PositionGrade,
                }],
                callback: function (response) {
                    //console.log(response['getHourlyRateMapping']);

                    var result = response['getClientHourlyRateMapping'];
                    $scope.hourlyRateMapping = result;

                }
            });


    }

    //event 
    $scope.addRate = function () {
        if ($scope.clientObj.ClientCode && $scope.clientObj.CurrentBU && $scope.clientObj.PositionGrade)
            if (!$scope.hourlyRateMapping)
                $scope.hourlyRateMapping = [];
        $scope.hourlyRateMapping.push({
        });

    }

    $scope.removeRate = function (child, $index) {
        if ($scope.clientObj.ClientCode && $scope.clientObj.CurrentBU && $scope.clientObj.PositionGrade)
            $scope.hourlyRateMapping.splice($index, 1);
    }

    $scope.getRate();

}

export function IntroducerCtrl($scope, $http, $document, $timeout, $rootScope) {

    var vm = this;

    //object initialization
    (function () {
        $scope.introducerObj = {
        };
        $scope.editMode = [];

        $scope.templateURL = {
            name: "Introducer",
            url: '',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };


        $scope.getGeneralMasterList(["Gender", "TimeSlot", "Type", "Interval"]);
        //$scope.getGeneralMasterList(["TimeSlotType"]);

    })();

    $scope.introducerIDChange = function () {

        $scope.postToServer({
            data: [{
                action: "getIntroducer",
                IntroducerCode: $scope.introducerObj.IntroducerCode
            }],
            callback: function (response) {
                response = response["getIntroducer"];

                if (response) {
                    $scope.introducerObj = response;
                    $scope.refresh_ui_select('Worker', $scope.introducerObj.WorkerID, 0);
                }
                else {
                    confirm("Confirm to Create a new record?")
                    $scope.introducerObj = {
                        IntroducerCode: $scope.introducerObj.IntroducerCode,
                    };
                }

                ////console.log($scope.introducerObj);
            }
        });

    }

    $scope.save = function () {
        $scope.submitted = true;
        if ($scope.userForm.$invalid) return;

        $scope.postToServer({
            data: [{
                action: "saveIntroducer",
                IntroducerInfo: JSON.stringify($scope.introducerObj)
            }],
            callback: function (response) {
                ////console.log(response);
                alert(response["saveIntroducer"].message);
            }
        });
    };

    $scope.delete = function () {

        if (!$scope.introducerObj.IntroducerCode) return;

        $scope.postToServer({
            data: [{
                action: "deleteIntroducer",
                IntroducerCode: $scope.introducerObj.IntroducerCode
            }],
            callback: function (response) {
                ////console.log(response);
                alert(response["deleteIntroducer"].message);
            }
        });
    };

}

export function WorkerCtrl($scope, $http, $document, $timeout, $rootScope, $state) {

    //console.log($state.params.workerID);
    var vm = this;

    //object initialization
    (function () {
        $scope.workerObj = {
            WorkerID: $rootScope.loginInfo.WorkerID,
        };
        $rootScope.loginInfo.WorkerID = '';
        $scope.editMode = [];
        $scope.btn1Class = 'active';
        $scope.templateURL = {
            name: "Worker",
            url: '',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };
        $scope.tabURL = 'Info';

        $scope.getGeneralMasterList(["WorkerType", "PositionGrade", "WorkerStatus", "AppraisalGrade", "CardStatus", "District", "PayrollMethod"]);

    })();


    $scope.refresh_ui_select = function (table, input, limit, includeInput, callback, clientCode) {
        if (limit && (!input || input.length < limit)) return;
        var action = "refreshList";
        if (clientCode) action = "refreshBUList";
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: action, Table: table, Input: input, ClientCode: clientCode }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            console.log('refresh_ui_select [' + table + '] [Done].');

            if (response) {
                if (clientCode)
                    $scope.refresh_ui_select_list[table + clientCode] = response;
                else
                    $scope.refresh_ui_select_list[table] = response;
                if (response && input && includeInput)
                    response.unshift({
                        'Code': input,
                        'Desc': input,
                    });
            }
            if (callback)
                callback(response);
        });

    }

    $scope.workerIDChange = function () {

        $scope.postToServer({
            data: [{
                action: "getWorker",
                WorkerID: $scope.workerObj.WorkerID
            }],
            callback: function (response) {
                response = response["getWorker"];

                if (response) {
                    $scope.workerObj = response;
                    $scope.refresh_ui_select('Introducer', $scope.workerObj.Introducer, 0);
                    $scope.refresh_ui_select('PayrollGroup', $scope.workerObj.PayrollGroup, 0);
                    $scope.beneficialNameExists();
                }
                else {
                    confirm("Confirm to Create a new record?")
                    $scope.workerObj = {
                        WorkerID: $scope.workerObj.WorkerID,
                    };
                }

            }
        });

    }
    $scope.beneficialNameExists = function () {

        $scope.postToServer({
            data: [{
                action: "beneficialNameExists",
                WorkerID: $scope.workerObj.WorkerID,
                BeneficialName: $scope.workerObj.BeneficialName
            }],
            callback: function (response) {
                response = response["beneficialNameExists"];

                if (response.result == "True") {
                    $scope.beneficialClass = "text-danger";
                } else {
                    $scope.beneficialClass = '';
                }

            }
        });

    }

    $scope.save = function () {
        $scope.submitted = true;
        if ($scope.userForm.$invalid) return;

        var hkid = $scope.workerObj.HKID1 + $scope.workerObj.HKID2 + $scope.workerObj.HKID3;
        if (!hkIDCheckDigit(hkid)) return;

        $scope.postToServer({
            data: [{
                action: "saveWorker",
                WorkerInfo: JSON.stringify($scope.workerObj)
            }],
            callback: function (response) {
                ////console.log(response);
                alert(response["saveWorker"].message);
            }
        });
    };

    $scope.delete = function () {

        if (!$scope.workerObj.WorkerID) return;

        $scope.postToServer({
            data: [{
                action: "deleteWorker",
                WorkerID: $scope.workerObj.WorkerID
            }],
            callback: function (response) {
                ////console.log(response);
                alert(response["deleteWorker"].message);
            }
        });
    };

    $scope.addSkill = function () {

        if (!$scope.workerObj.SkillList) $scope.workerObj.SkillList = [];
        var rowNo = $scope.workerObj.SkillList.length + 1;
        $scope.workerObj.SkillList.push({
            RowNo: rowNo
        });
    }
    $scope.removeSkill = function ($index) {
        $scope.workerObj.SkillList.splice($index, 1);
    }
    //event 
    $scope.addChild = function () {
        if (!$scope.workerObj.ClientList)
            $scope.workerObj.ClientList = [];

        $scope.workerObj.ClientList.push({
            WorkerID: $scope.workerObj.WorkerID
        });

    }

    $scope.removeChild = function (child, $index) {
        $scope.workerObj.ClientList.splice($index, 1);
    }

    $scope.$watch('workerObj.DOB', function (newval, oldval) {
        if (!$scope.workerObj.DOB) return;
        var dateOfBirth = moment($scope.workerObj.DOB, 'DD/MM/YYYY HH:mm:ss').toDate();
        $scope.workerObj.Age = parseInt(moment().diff(dateOfBirth, 'years', true)) + 1;
    }, true);

    if ($scope.workerObj.WorkerID) {
        $scope.workerIDChange();
    }
}

export function PayrollGroupCtrl($scope, $http, $document, $timeout, $rootScope) {

    var vm = this;

    //object initialization
    (function () {
        $scope.payrollGroupObj = {
        };
        $scope.editMode = [];

        $scope.templateURL = {
            name: "PayrollGroup",
            url: '',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };

        //$scope.getGeneralMasterList(["TimeSlotType"]);

    })();

    $scope.payrollGroupIDChange = function () {

        $scope.postToServer({
            data: [{
                action: "getPayrollGroup",
                PayrollGroupID: $scope.payrollGroupObj.PayrollGroupID
            }],
            callback: function (response) {
                response = response["getPayrollGroup"];

                if (response)
                    $scope.payrollGroupObj = response;
                else {
                    confirm("Confirm to Create a new record?")
                    $scope.payrollGroupObj = {
                        PayrollGroupID: $scope.payrollGroupObj.PayrollGroupID,
                    };
                }

                ////console.log($scope.payrollGroupObj);
            }
        });

    }

    $scope.save = function () {
        $scope.submitted = true;
        if ($scope.userForm.$invalid) return;

        $scope.postToServer({
            data: [{
                action: "savePayrollGroup",
                PayrollGroupInfo: JSON.stringify($scope.payrollGroupObj)
            }],
            callback: function (response) {
                ////console.log(response);
                alert(response["savePayrollGroup"].message);
            }
        });
    };

    $scope.delete = function () {

        if (!$scope.payrollGroupObj.PayrollGroupID) return;

        $scope.postToServer({
            data: [{
                action: "deletePayrollGroup",
                PayrollGroupID: $scope.payrollGroupObj.PayrollGroupID
            }],
            callback: function (response) {
                ////console.log(response);
                alert(response["deletePayrollGroup"].message);
            }
        });
    };

}

export function AttendanceImportCtrl($scope, $http, $document, $timeout, $rootScope, $state) {

    var vm = this;

    //object initialization
    (function () {
        if ($rootScope.clientObj) {
            $scope.clientObj = $rootScope.clientObj;
            $rootScope.clientObj = undefined;
        } else {
            //$state.go("master.Client");
            $scope.clientObj = {};
        }
        $scope.editMode = [];

        $scope.templateURL = {
            name: "Attendance Import",
            url: '',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };

    })();

    $scope.refresh_ui_select = function (table, input, limit, includeInput, callback, clientCode) {
        if (limit && (!input || input.length < limit)) return;
        var action = "refreshList";
        if (clientCode) action = "refreshBUList";
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: action, Table: table, Input: input, ClientCode: clientCode }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            console.log('refresh_ui_select [' + table + '] [Done].');

            if (response) {
                if (clientCode)
                    $scope.refresh_ui_select_list[table + clientCode] = response;
                else
                    $scope.refresh_ui_select_list[table] = response;
                if (response && input && includeInput)
                    response.unshift({
                        'Code': input,
                        'Desc': input,
                    });
            }
            if (callback)
                callback(response);
        });

    }

    $scope.import = function () {
        var f = document.getElementById('attendanceFile').files[0];
        var formData = new FormData();
        formData.append("action", "attendanceImport");
        formData.append("ClientCode", $scope.clientObj.ClientCode);
        formData.append("BU", $scope.clientObj.BU);
        formData.append("file", f);

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/FileUpload.ashx',
            data: formData,
            headers: { 'Content-Type': undefined }
        }).then(function (response) {
            response = response.data;
            $scope.result = response;
        });
    };

}

export function AttendanceEntryCtrl($scope, $http, $document, $timeout, $rootScope, $state) {

    var vm = this;

    //object initialization
    (function () {
        $scope.result = [];
        if ($rootScope.clientObj) {
            $scope.clientObj = $rootScope.clientObj;
            $rootScope.clientObj = undefined;
        } else {
            //$state.go("master.Client");
            $scope.clientObj = {};
        }
        $scope.editMode = [];

        $scope.templateURL = {
            name: "Attendance Entry",
            url: '',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };

        $scope.getGeneralMasterList(["TimeSlot"]);

    })();

    $scope.refresh_ui_select = function (table, input, limit, includeInput, callback, clientCode) {
        if (limit && (!input || input.length < limit)) return;
        var action = "refreshList";
        if (table == "BU") action = "refreshBUList";
        if (table == "WorkerHKIDName") action = "refreshWorkerList";
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: action,
                Table: table,
                Input: input,
                ClientCode: $scope.clientObj.ClientCode,
                BU: $scope.clientObj.BU
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            console.log('refresh_ui_select [' + table + '] [Done].');

            if (response) {
                if (clientCode)
                    $scope.refresh_ui_select_list[table + clientCode] = response;
                else
                    $scope.refresh_ui_select_list[table] = response;
                if (response && input && includeInput)
                    response.unshift({
                        'Code': input,
                        'Desc': input,
                    });
            }
            if (callback)
                callback(response);
        });

    }

    $scope.save = function () {
        // console.log($scope.result);
        // return;
        $scope.postToServer({
            data: [{
                action: "saveAttendanceEntries",
                ClientCode: $scope.clientObj.ClientCode,
                BU: $scope.clientObj.BU,
                AttendanceList: JSON.stringify($scope.result)
            }],
            callback: function (response) {
                console.log(response["saveAttendanceEntries"]);
                var result = response["saveAttendanceEntries"];
                if (result.message)
                    alert(result.message);
            }
        });
    };

    $scope.addAttendance = function () {
        $scope.result.push(
            {

            }
        );
    }
    $scope.removeAttendance = function ($index) {

        $scope.result.splice($index, 1);
    }

}

export function UserProfileCtrl($scope, $http, $document, $timeout, $rootScope) {

    var vm = this;

    //object initialization
    (function () {
        $scope.userProfileObj = {
        };
        $scope.editMode = [];

        $scope.templateURL = {
            name: "User Profile",
            url: '',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };

        //$scope.getGeneralMasterList(["TimeSlotType"]);

    })();

    $scope.userProfileIDChange = function () {

        $scope.postToServer({
            data: [{
                action: "getUserProfile",
                UserID: $scope.userProfileObj.UserID
            }],
            callback: function (response) {
                response = response["getUserProfile"];

                if (response)
                    $scope.userProfileObj = response;
                else {
                    confirm("Confirm to Create a new record?")
                    $scope.userProfileObj = {
                        UserID: $scope.userProfileObj.UserID,
                    };
                }

                ////console.log($scope.userProfileObj);
            }
        });

    }

    $scope.save = function () {
        $scope.submitted = true;
        if ($scope.userForm.$invalid) return;

        $scope.postToServer({
            data: [{
                action: "saveUserProfile",
                UserProfileInfo: JSON.stringify($scope.userProfileObj)
            }],
            callback: function (response) {
                ////console.log(response);
                alert(response["saveUserProfile"].message);
            }
        });
    };

    $scope.delete = function () {

        if (!$scope.userProfileObj.UserID) return;

        $scope.postToServer({
            data: [{
                action: "deleteUserProfile",
                UserID: $scope.userProfileObj.UserID
            }],
            callback: function (response) {
                ////console.log(response);
                alert(response["deleteUserProfile"].message);
            }
        });
    };

}

export function ChangePasswordCtrl($scope, $http, $document, $timeout, $rootScope) {

    var vm = this;

    //object initialization
    (function () {
        $scope.changePasswordObj = {
        };
        $scope.editMode = [];

        $scope.templateURL = {
            name: "Change Password",
            url: '',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };


    })();


    $scope.change = function () {
        $scope.submitted = true;
        if ($scope.userForm.$invalid) return;
        if ($scope.changePasswordObj.NewPassword != $scope.changePasswordObj.ConfirmPassword) {
            alert("New password not equal to confirm password.");
            return;
        }

        $scope.postToServer({
            data: [{
                action: "changePassword",
                CurrentPassword: $scope.changePasswordObj.CurrentPassword,
                NewPassword: $scope.changePasswordObj.NewPassword,
            }],
            callback: function (response) {
                alert(response["changePassword"].message);
            }
        });
    };

}

export function InquiryCtrl($scope, $http, $document, $timeout, $rootScope, $state) {

    var vm = this;

    //object initialization
    (function () {
        $scope.inquiryObj = {
        };

        $scope.templateURL = {
            name: "Worker Inquiry",
            url: 'views/inquiry/Inquiry_Criteria.html',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };
        $scope.header = ["Worker ID", "Chinese Name", "English Name", "Phone No", "HK ID", "Gender", "Introducer", "Work Area", "Address"];
        $scope.criterias = [{
            displayName: "WorkerID",
            field: 'WorkerID.Value',
            value: '',
            type: 'select',
            table: 'Worker',
        }, {
            displayName: "Client",
            field: 'ClientCode.Value',
            value: '',
            type: 'select',
            table: 'Client',
        }, {
            displayName: "English Name",
            field: 'EnglishName.Like',
            value: '',
        }, {
            displayName: "Chinese Name",
            field: 'ChineseName.Like',
            value: '',
        }, {
            displayName: "HK ID",
            field: 'HKID.Like',
            value: '',
        }, {
            displayName: "Phone No.",
            field: 'PhoneNo.Like',
            value: '',
        }, {
            displayName: "Work Area",
            field: 'WorkArea.Like',
            value: '',
        },
        
        {
            displayName: "PayrollGroup",
            field: 'PayrollGroup.Value',
            value: '',
            type: 'select',
            table: 'PayrollGroup',
        },
        {
            displayName: "District",
            field: 'District.Value',
            value: '',
            type: 'master',
            table: 'District',
        },
        {
            displayName: "Position Grade",
            field: 'PositionGrade.Value',
            value: '',
            type: 'master',
            table: 'PositionGrade',
        },
        {
            displayName: "Worker Status",
            field: 'WorkerStatus.Value',
            value: '',
            type: 'master',
            table: 'WorkerStatus',
        },
        {
            displayName: "Appraisal Grade",
            field: 'AppraisalGrade.Value',
            value: '',
            type: 'master',
            table: 'AppraisalGrade',
        },
        {
            displayName: "Payroll Method",
            field: 'PayrollMethod.Value',
            value: '',
            type: 'master',
            table: 'PayrollMethod',
        },
        {
            displayName: "Card Status",
            field: 'CardStatus.Value',
            value: '',
            type: 'master',
            table: 'CardStatus',
        },
        {
            displayName: "Skill",
            field: 'Skill.Like',
            value: '', 
        },];

        $scope.view = "V_Worker";

        $scope.getGeneralMasterList(["WorkerType", "PositionGrade", "WorkerStatus", "AppraisalGrade", "CardStatus", "District", "PayrollMethod"]);

    })();

    $scope.refresh = function () {

        for (var i = 0, item; item = $scope.criterias[i]; i++) {
            if (item.table && item.value)
                $scope.refresh_ui_select(item.table, item.value, 0);
        }
    };

    $scope.reset = function () {

        for (var i = 0, item; item = $scope.criterias[i]; i++) {
            item.value = '';
        }
    }
    $scope.search = function () {
        var filters = [];
        var tmp;
        for (var i = 0, item; item = $scope.criterias[i]; i++) {
            if (item.value) {
                tmp = {};
                tmp[item.field] = item.value;
                filters.push(tmp);
            }
        }

        $scope.postToServer({
            data: [{
                action: "inquiry",
                Filters: JSON.stringify(filters),
                Fields: JSON.stringify(["WorkerID", "ChineseName", "EnglishName", "PhoneNo", "HKID", "Gender", "Introducer", "WorkArea", "Address"]),
                View: $scope.view,
            }],
            callback: function (response) {
                //alert(response["inquiry"].message);
                //console.log(response['inquiry']);

                $scope.result = response['inquiry'];
                if ($scope.result.length) {
                    // $scope.header = $scope.result[0];
                }


                //$scope.templateURL.name = 'Result';
                //$scope.templateURL.url = 'views/inquiry/Inquiry_Result.html';

                //$scope.templateURL.pageNo++;
                //$scope.viewsList[$scope.templateURL.pageNo] = {
                //    name: $scope.templateURL.name,
                //    url: $scope.templateURL.url
                //};
            }
        });


    }
    $scope.create = function () {

        //$state.go('index.master.Worker');
        window.location = "#!/index/master/Worker";
    }
    $scope.viewWorker = function (child) {
        $rootScope.loginInfo.WorkerID = child.WorkerID;
        //$state.go('index.master.Worker');
        window.location = "#!/index/master/Worker";
    }
}

export function AttendanceExportCtrl($scope, $http, $document, $timeout, $rootScope, $state) {

    var vm = this;

    //object initialization
    (function () {
        $scope.inquiryObj = {
        };

        $scope.templateURL = {
            name: "Attendance Export",
            url: 'views/report/attendance.html',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };
        //$scope.header = ["Worker ID", "Chinese Name", "English Name", "Phone No", "HK ID", "Gender", "Introducer", "Work Area", "Address"];
        $scope.criterias = [
            {
                displayName: "員工編號",
                field: 'WorkerID.Value',
                value: '',
                type: 'select',
                table: 'Worker',
            },
            {
                displayName: "Client",
                field: 'Client.Value',
                value: '',
                type: 'select',
                table: 'Client',
            },
            {
                displayName: "Attendance Date From",
                field: 'AttendanceDate.StartDate',
                value: moment().format("DD/MM/YYYY HH:mm:ss"),
                type: 'date',
            },
            {
                displayName: "Attendance Date To",
                field: 'AttendanceDate.EndDate',
                value: moment().format("DD/MM/YYYY HH:mm:ss"),
                type: 'date',
            }
        ];

        $scope.view = "V_Attendance";


    })();


    $scope.reset = function () {

        for (var i = 0, item; item = $scope.criterias[i]; i++) {
            item.value = '';
        }
    }

    $scope.search = function () {
        var filters = [];
        var tmp;
        for (var i = 0, item; item = $scope.criterias[i]; i++) {
            if (item.value) {
                tmp = {};
                tmp[item.field] = item.value;
                filters.push(tmp);
            }
        }
        if (!filters.length) return;

        window.location = host + "/HttpHandler/FileDownloadHandler.ashx?action=attendance&View=" + $scope.view + "&Filters=" + JSON.stringify(filters); return;
        // if ($scope.workerObj.attendance && $scope.workerObj.attendance.length) return;
        $scope.postToServer({
            data: [{
                action: "attendance",
                Filters: JSON.stringify(filters),
                View: $scope.view,
            }],
            callback: function (response) {
                //console.log(response['inquiry']);

            }
        });


    }

}

export function AttendanceInquiryCtrl($scope, $http, $document, $timeout, $rootScope) {

    var vm = this;

    //object initialization
    (function () {
        $scope.inquiryObj = {
        };

        $scope.templateURL = {
            name: "Inquiry",
            url: 'views/inquiry/Inquiry_Criteria.html',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };


        if (!$scope.workerObj.criterias)
            $scope.workerObj.criterias = [
                {
                    displayName: "員工編號",
                    field: 'WorkerID.Value',
                    value: $scope.workerObj.WorkerID,
                    disable: true,
                },
                {
                    displayName: "Client",
                    field: 'Client.Value',
                    value: $scope.workerObj.ClientList[0].ClientCode,
                    type: 'select',
                    table: 'Client',
                },
                {
                    displayName: "Attendance Date From",
                    field: 'AttendanceDate.StartDate',
                    value: moment().format("DD/MM/YYYY HH:mm:ss"),
                    type: 'date',
                },
                {
                    displayName: "Attendance Date To",
                    field: 'AttendanceDate.EndDate',
                    value: moment().format("DD/MM/YYYY HH:mm:ss"),
                    type: 'date',
                }
            ];

        $scope.view = "V_Attendance";


    })();

    $scope.refresh = function () {

        for (var i = 0, item; item = $scope.workerObj.criterias[i]; i++) {
            if (item.table && item.value)
                $scope.refresh_ui_select(item.table, item.value, 0);
        }
    };

    $scope.reset = function () {

        for (var i = 0, item; item = $scope.workerObj.criterias[i]; i++) {
            item.value = '';
        }
    }
    $scope.search = function () {
        var filters = [];
        var tmp;
        for (var i = 0, item; item = $scope.workerObj.criterias[i]; i++) {
            if (item.value) {
                tmp = {};
                tmp[item.field] = item.value;
                filters.push(tmp);
            }
        }
        if (!filters.length) return;
        // if ($scope.workerObj.attendance && $scope.workerObj.attendance.length) return;
        $scope.postToServer({
            data: [{
                action: "inquiry",
                Filters: JSON.stringify(filters),
                View: $scope.view,
            }],
            callback: function (response) {
                //console.log(response['inquiry']);

                $scope.workerObj.attendance = response['inquiry'];
                if ($scope.workerObj.attendance.length) {
                    $scope.workerObj.header = $scope.workerObj.attendance[0];
                }
            }
        });


    }
    $scope.search();
}

export function PayrollCtrl($scope, $http, $document, $timeout, $rootScope) {

    var vm = this;

    //object initialization
    (function () {
        if (!$scope.workerObj.criteria)
            $scope.workerObj.criteria = {
            };


        $scope.editMode = [];

        $scope.templateURL = {
            name: "Payroll Generation",
            url: '',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };


    })();

    $scope.getPayroll = function () {
        $scope.postToServer({
            data: [{
                action: "getPayroll",
                SalaryDate: $scope.workerObj.criteria.SalaryDate,
                WorkerID: $scope.workerObj.WorkerID,
            }],
            callback: function (response) {

                $scope.payrollObj = response['getPayroll'];

            }
        });
    }

    $scope.savePayroll = function () {
        $scope.postToServer({
            data: [{
                action: "savePayroll",
                SalaryDate: $scope.workerObj.criteria.SalaryDate,
                WorkerID: $scope.workerObj.WorkerID,
                Payroll: JSON.stringify($scope.payrollObj[0]),
            }],
            callback: function (response) {

                response = response['savePayroll'];
                if (response.message)
                    alert(response.message);

            }
        });
    }

    $scope.removeItem = function ($index) {
        if (confirm("confirm to remove the payroll item?")) {
            $scope.payrollObj[0].PayrollItemList.splice($index, 1);
            $scope.calSummary();
        }

    }

    $scope.addItem = function ($index) {
        var rowNo = $scope.payrollObj[0].PayrollItemList.length + 1;
        $scope.payrollObj[0].PayrollItemList.push({ RowNo: rowNo });
    }
    $scope.calSummary = function () {
        $scope.payrollObj[0].Amount = 0;
        $.each($scope.payrollObj[0].PayrollItemList, function (index, value) {
            $scope.payrollObj[0].Amount += parseFloat(value.Amount);
        });

    }

    if ($scope.workerObj.criteria.SalaryDate) {
        $scope.getPayroll();
    }
}


export function PayrollGenerationCtrl($scope, $http, $document, $timeout, $rootScope) {

    var vm = this;

    //object initialization
    (function () {
        $scope.payrollObj = {
        };


        $scope.editMode = [];

        $scope.templateURL = {
            name: "Payroll Generation",
            url: '',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };


    })();

    $scope.generatePayroll = function () {

        $scope.postToServer({
            data: [{
                action: "generatePayroll",
                AsAt: $scope.payrollObj.AsAt,
                SalaryDate: $scope.payrollObj.SalaryDate,
                Remarks: ($scope.payrollObj.Remarks || ''),
                PayrollGroup: $scope.payrollObj.PayrollGroup,
                //WorkerID: $scope.workerObj.WorkerID,
            }],
            callback: function (response) {

                var result = response['generatePayroll'];
                if (result.message || result.error) {
                    alert(result.message || result.error);
                }

            }
        });

    }

    $scope.getPayroll = function () {
        $scope.postToServer({
            data: [{
                action: "getPayroll",
                SalaryDate: $scope.SalaryDate,
                WorkerID: $scope.workerObj.WorkerID,
            }],
            callback: function (response) {

                $scope.payrollObj = response['getPayroll'];

            }
        });
    }
}

export function HourlyRateMappingCtrl($scope, $http, $document, $timeout, $rootScope) {

    var vm = this;

    //object initialization
    (function () {
        $scope.hourlyRateMapping = [];

        $scope.editMode = [];

        $scope.templateURL = {
            name: "Hourly Rate Mapping",
            url: '',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };


        $scope.getGeneralMasterList(["Gender", "TimeSlot", "Type", "Interval"]);
    })();

    $scope.refresh = function () {

        for (var i = 0, item; item = $scope.criterias[i]; i++) {
            if (item.table && item.value)
                $scope.refresh_ui_select(item.table, item.value, 0);
        }
    };

    $scope.save = function () {

        //console.log($scope.hourlyRateMapping);

        $scope.postToServer({
            data: [{
                action: "saveHourlyRateMapping",
                HourlyRateMapping: $scope.hourlyRateMapping,
            }],
            callback: function (response) {
                var result = response['saveHourlyRateMapping'];
                alert(result.message);


            }
        });

    }
    $scope.get = function () {

        $scope.postToServer({
            data: [{
                action: "getHourlyRateMapping",
            }],
            callback: function (response) {
                //console.log(response['getHourlyRateMapping']);

                var result = response['getHourlyRateMapping'];
                if (result && result.length) {
                    $scope.hourlyRateMapping = result;
                }

            }
        });


    }

    //event 
    $scope.addChild = function () {
        if (!$scope.hourlyRateMapping)
            $scope.hourlyRateMapping = [];
        $scope.hourlyRateMapping.push({
            StoreCode: ' ',
            Gender: 'Male'
        });

    }

    $scope.removeChild = function (child, $index) {
        $scope.hourlyRateMapping.splice($index, 1);
    }

    $scope.get();
}

export function TimeslotMappingCtrl($scope, $http, $document, $timeout, $rootScope) {

    var vm = this;

    //object initialization
    (function () {
        $scope.timeslotMapping = [];

        $scope.editMode = [];

        $scope.templateURL = {
            name: "Timeslot Mapping",
            url: '',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };


        $scope.getGeneralMasterList(["Gender", "TimeSlot", "Type", "Interval"]);
    })();


    $scope.save = function () {

        //console.log($scope.timeslotMapping);

        $scope.postToServer({
            data: [{
                action: "saveTimeslotMapping",
                TimeslotMappingList: $scope.timeslotMapping,
            }],
            callback: function (response) {
                var result = response['saveTimeslotMapping'];
                alert(result.message);


            }
        });

    }
    $scope.get = function () {

        $scope.postToServer({
            data: [{
                action: "getTimeslotMapping",
            }],
            callback: function (response) {
                //console.log(response['getTimeslotMapping']);

                var result = response['getTimeslotMapping'];
                if (result && result.length) {
                    $scope.timeslotMapping = result;
                }

            }
        });


    }

    //event 
    $scope.addChild = function () {
        if (!$scope.timeslotMapping)
            $scope.timeslotMapping = [];

        var rowNo = $scope.timeslotMapping.length + 1;
        $scope.timeslotMapping.push({
            RowNo: rowNo
        });

    }

    $scope.removeChild = function ($index) {
        $scope.timeslotMapping.splice($index, 1);
    }

    $scope.get();
}

export function GeneralMasterCtrl($scope, $http, $document, $timeout, $rootScope) {

    var vm = this;

    //object initialization
    (function () {
        $scope.generalMasterList = [];
        $scope.generalMasterObj = {};
        $scope.editMode = [];

        $scope.templateURL = {
            name: "General Master",
            url: '',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };


        $scope.getGeneralMasterList(["GeneralCategory"]);
    })();


    $scope.save = function () {

        //console.log($scope.generalMasterList);
        if (!confirm('Confirm to save?')) return;
        if (!$scope.generalMasterList.length) alert('Please add one item in the table.');

        $scope.postToServer({
            data: [{
                action: "saveGeneralMaster",
                GeneralMasterList: $scope.generalMasterList,
            }],
            callback: function (response) {
                var result = response['saveGeneralMaster'];
                alert(result.message);


            }
        });


    }

    $scope.get = function () {


        $scope.postToServer({
            data: [{
                action: "getGeneralMaster",
                Category: $scope.generalMasterObj.Category || ''
            }],
            callback: function (response) {
                //console.log(response['getTimeslotMapping']);

                var result = response['getGeneralMaster'];
                if (result && result.length) {
                    $scope.generalMasterList = result;
                    $scope.template = { ...result[0] };
                }

            }
        });


    }

    //event 
    $scope.addChild = function () {
        if (!$scope.generalMasterList)
            $scope.generalMasterList = [];

        var rowNo = $scope.generalMasterList.length + 1;
        $scope.generalMasterList.push({
            ...$scope.template,
            Seq: rowNo,
            Code: '',
            "EngDesc": "", "ChiDesc": ""
        });

    }

    $scope.removeChild = function ($index) {
        $scope.generalMasterList.splice($index, 1);
    }

    $scope.get();
}

export function HolidayCtrl($scope, $http, $document, $timeout, $rootScope) {

    var vm = this;

    //object initialization
    (function () {
        $scope.holidayList = [];
        $scope.holidayObj = {};
        $scope.editMode = [];

        $scope.templateURL = {
            name: "Holiday Master",
            url: '',
            pageNo: 0
        };

        $scope.viewsList = [];
        $scope.viewsList[$scope.templateURL.pageNo] = {
            name: $scope.templateURL.name,
            url: $scope.templateURL.url
        };


        // $scope.getGeneralMasterList(["GeneralCategory"]);
    })();


    $scope.save = function () {

        //console.log($scope.holidayList);
        if (!confirm('Confirm to save?')) return;
        if (!$scope.holidayList.length) alert('Please add one item in the table.');

        $scope.postToServer({
            data: [{
                action: "saveHoliday",
                HolidayList: $scope.holidayList,
                Year: $scope.holidayObj.Year
            }],
            callback: function (response) {
                var result = response['saveHoliday'];
                alert(result.message);


            }
        });


    }

    $scope.get = function () {
        if (!$scope.holidayObj.Year) return;

        $scope.postToServer({
            data: [{
                action: "getHoliday",
                Year: $scope.holidayObj.Year
            }],
            callback: function (response) {

                var result = response['getHoliday'];
                if (result && result.length) {
                    $scope.holidayList = result;
                    // $scope.template = { ...result[0] };
                } else {
                    $scope.holidayList = [];
                }

            }
        });


    }

    //event 
    $scope.addChild = function () {
        if (!$scope.holidayList)
            $scope.holidayList = [];

        var rowNo = $scope.holidayList.length + 1;
        $scope.holidayList.push({
            ...$scope.template,
            Seq: rowNo,
            Code: '',
            "EngDesc": "", "ChiDesc": ""
        });

    }

    $scope.removeChild = function ($index) {
        $scope.holidayList.splice($index, 1);
    }

    $scope.get();
}


