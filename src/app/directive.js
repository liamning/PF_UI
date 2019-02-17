import 'bootstrap-datetimepicker-npm/build/js/bootstrap-datetimepicker.min.js'

export const navigation = () => {
    return {
        template: require('./views/common/navigation.html'),
    }
};

export const topnavbar = () => {
    return {
        template: require('./views/common/topnavbar.html'),
    }
};

export const footer = () => {
    return {
        template: require('./views/common/footer.html'),
    }
};
export const workerInfo = () => {
    return {
        template: require('./views/master/Worker_PersonalInfo.html')
    };
}
export const workerAttn = () => {
    return {
        template: require('./views/master/Worker_Attendance.html')
    };
}
export const workerPayroll = () => {
    return {
        template: require('./views/master/Worker_Payroll.html')
    };
}
export const myTextbox2 = {
    bindings: {
        ngModel: '=',
    },
    edit: false,
    template: ["$element", "$attrs", function ($element, $attrs) {
        return ` 
        <div class="form-control" ng-click="$ctrl.click($event)" ng-if="!$ctrl.edit">{{$ctrl.ngModel}}</div>
        <input class="form-control" ng-model="$ctrl.ngModel" ng-if="$ctrl.edit" ng-blur="$ctrl.click()" />
    `;
    }],
    controller: ["$element", "$attrs", "$timeout", function ($element, $attrs, $timeout) {
        var self = this;
        self.click = function ($event) {
            // console.log($event);
            self.edit = !self.edit;
            // console.log(self); 
            if (self.edit) {
                $timeout(function () {
                    $element.find("input").focus();
                }, 0.1);

            }
        }
    }]
    // template: '<button ng-click="$ctrl.myOtherClick()">From Component</button>',
    // controller: function () {
    //     var self = this;

    //     self.myOtherClick = function () {
    //         alert('test');
    //     }
    // }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
export function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function () {
                element.metisMenu();

                console.log(element);

                // element.children('li').on('click', function (e) {
                //     console.log('li click');
                //     const $this = $(this);
                //     if ($this.hasClass("nav-first-level") && !$this.hasClass("active"))
                //         element.find('ul.in').removeClass("in");

                //         element.find('ul.unfold').removeClass("unfold");
                // });
            });

            //Colapse menu in mobile mode after click on element
            var menuElement = $('#side-menu a:not([href$="\\#"])');
            menuElement.click(function () {
                if ($(window).width() < 769) {
                    $("body").toggleClass("mini-navbar");
                }
            });

            // Enable initial fixed sidebar
            if ($("body").hasClass('fixed-sidebar')) {
                var sidebar = element.parent();
                sidebar.slimScroll({
                    height: '100%',
                    railOpacity: 0.9,
                });
            }
        }
    };
}

/**
 * minimalizaSidebar - Directive for minimalize sidebar
*/
export function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: ["$scope", "$element", function ($scope, $element) {
            $scope.minimalize = function () {
                var top_button_panel = $("div.top-button-panel");
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();

                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(400);
                        }, 200);
                } else if ($('body').hasClass('fixed-sidebar')) {
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(400);
                        }, 100);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state 
                    $('#side-menu').removeAttr('style');
                }
            }
        }]
    };
}

export function dateTime() {
    var format = "DD/MM/YYYY HH:mm:ss";
    return {
        restrict: 'A',
        requuire: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datetimepicker({
                format: format,
                keepOpen: true,
                useCurrent: true
            })

            element.on('blur', function () {

                if (element.val()) {
                    ngModelCtrl.$setViewValue(element.val());
                }

            })

        }
    };
}

export function uiIntMask($filter) {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            //ngModelCtrl.$formatters.push(function (a) {
            //    return $filter('number')(ngModelCtrl.$modelValue, 0)
            //});

            ngModelCtrl.$parsers.push(function (val) {
                var clean = val.replace(/[^0-9]/g, '');
                var res = clean.match(/\d+/g);

                if (res && res[0])
                    clean = res[0];

                ngModelCtrl.$setViewValue(clean);
                ngModelCtrl.$render();

                return clean;
            });

            element.on('blur', function (event) {
                //element.val($filter('number')(ngModelCtrl.$modelValue, 0));
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });

        }
    };
}

export function uiNumberMask($filter) {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }
            element.addClass('text-right');

            ngModelCtrl.$formatters.push(function (a) {
                return $filter('number')(ngModelCtrl.$modelValue, 2)
            });

            ngModelCtrl.$parsers.push(function (val) {
                var clean = val.replace(/[^0-9|\.|\-]/g, '');
                var res = clean.match(/\-?\d+\.?\d{0,2}/g);

                if (res && res[0])
                    clean = res[0];

                ngModelCtrl.$setViewValue(clean);
                ngModelCtrl.$render();

                return clean;
            });

            element.on('blur', function (event) {
                element.val($filter('number')(ngModelCtrl.$modelValue, 2));
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });

        }
    }
}

export function myTextbox($compile) {

    var viewTemplate = "<div class='form-control'>{{field}}</div>";
    var editTemplate = "<input class='form-control'  ng-model='field' />";
    var edit = false;
    return {
        scope: {
            field: '='
        },
        link: function (scope, element, $attrs, ngModelCtrl) {

            element.html($compile(viewTemplate)(scope));

            element.on("click", function () {
                scope.$apply(function () {
                    if (!edit) {

                        element.html($compile(editTemplate)(scope));

                        element.find('input').on("blur", function (event) {

                            //scope.field = event.target.value;

                            scope.$apply(function () {
                                if (edit) {

                                    element.html($compile(viewTemplate)(scope));
                                    edit = false;
                                }
                            })
                        }).focus();

                        edit = true;
                    }
                })
            });

        }
    }
}

export function myNumber($compile) {

    var viewTemplate = "<div class='form-control'>{{field}}</div>";
    var editTemplate = "<input class='form-control' ui-number-mask ng-model='field' />";
    var edit = false;
    return {
        scope: {
            field: '='
        },
        link: function (scope, element, $attrs, ngModelCtrl) {

            element.html($compile(viewTemplate)(scope));

            element.on("click", function () {
                scope.$apply(function () {
                    if (!edit) {

                        element.html($compile(editTemplate)(scope));

                        element.find('input').on("blur", function (event) {

                            //scope.field = event.target.value;

                            scope.$apply(function () {
                                if (edit) {

                                    element.html($compile(viewTemplate)(scope));
                                    edit = false;
                                }
                            })
                        }).focus();

                        edit = true;
                    }
                })
            });

        }
    }
}

export function myInt($compile) {

    var viewTemplate = "<div class='form-control'>{{field}}</div>";
    var editTemplate = "<input class='form-control' ui-int-mask ng-model='field' />";
    var edit = false;
    return {
        scope: {
            field: '='
        },
        link: function (scope, element, $attrs, ngModelCtrl) {

            element.html($compile(viewTemplate)(scope));

            element.on("click", function () {
                scope.$apply(function () {
                    if (!edit) {

                        element.html($compile(editTemplate)(scope));

                        element.find('input').on("blur", function (event) {

                            //scope.field = event.target.value;

                            scope.$apply(function () {
                                if (edit) {

                                    element.html($compile(viewTemplate)(scope));
                                    edit = false;
                                }
                            })
                        }).focus();

                        edit = true;
                    }
                })
            });

        }
    }
}

export function mySelect($compile) {

    var viewTemplate = "<div class='form-control'>{{fieldDesc}}</div>";

    return {
        scope: {
            field: '=',
            fieldDesc: '<',
            tableName: '<',
        },
        link: function (scope, element, $attrs) {

            var editTemplate = `
            <ui-select ng-model="fieldObj"
            on-select="onselect(this)" 
            title="Please Select"
            
            >

            <ui-select-match placeholder="Please Select">{{$select.selected.Desc}}</ui-select-match>
            <ui-select-choices repeat="item in generalMaster['${scope.tableName}'] track by $index"
                            >
            <div>
                <span ng-bind-html="item.Desc | highlight: $select.search"></span>
            </div>
            </ui-select-choices>
        </ui-select>
            
            `;


            scope.edit = false;
            scope.generalMaster = scope.$parent.generalMaster;

            scope.fieldDesc = (scope.fieldDesc || scope.field);
            scope.fieldObj = { Code: scope.field, Desc: scope.fieldDesc };

            angular.extend(scope, {
                onselect: function (event) {
                    if (scope.edit) {

                        scope.field = event.fieldObj.Code;
                        scope.fieldDesc = event.fieldObj.Desc;
                        scope.fieldObj = { Code: scope.field, Desc: scope.fieldDesc };

                        element.html($compile(viewTemplate)(scope));
                        scope.edit = false;
                    }
                }
            });

            element.html($compile(viewTemplate)(scope));

            element.on("click", function () {
                scope.$apply(function () {
                    if (!scope.edit) {
                        element.html($compile(editTemplate)(scope));
                        scope.edit = true;
                    }
                })
            });

        }
    }
}

export function myAsyncSelect($compile) {

    var viewTemplate = "<div class='form-control'>{{fieldDesc}}</div>";

    return {
        scope: {
            field: '=',
            fieldDesc: '<',
            tableName: '<',
        },
        link: function (scope, element, $attrs) {


            var editTemplate = `
    <ui-select ng-model="fieldObj"
    on-select="onselect(this)" 
    title="Please Select"
     
    >

    <ui-select-match placeholder="Please Select">{{$select.selected.Desc}}</ui-select-match>
    <ui-select-choices repeat="item in refresh_ui_select_list['${scope.tableName}'] track by $index"
                    refresh="refresh_ui_select('${scope.tableName}', $select.search, 0, 0)"
                    refresh-delay="0">
    <div>
        <span ng-bind-html="item.Desc | highlight: $select.search"></span>
    </div>
    </ui-select-choices>
</ui-select>
       
    `;

            scope.refresh_ui_select = scope.$parent.refresh_ui_select;
            scope.refresh_ui_select_list = scope.$parent.refresh_ui_select_list;
            scope.edit = false;

            scope.fieldDesc = (scope.fieldDesc || scope.field);
            scope.fieldObj = { Code: scope.field, Desc: scope.fieldDesc };

            angular.extend(scope, {
                onselect: function (event) {
                    if (scope.edit) {

                        scope.field = event.fieldObj.Code;
                        scope.fieldDesc = event.fieldObj.Desc;
                        scope.fieldObj = { Code: scope.field, Desc: scope.fieldDesc };

                        element.html($compile(viewTemplate)(scope));
                        scope.edit = false;
                    }
                }
            });

            element.html($compile(viewTemplate)(scope));

            element.on("click", function () {
                scope.$apply(function () {
                    if (!scope.edit) {
                        element.html($compile(editTemplate)(scope));
                        scope.edit = true;
                    }
                })
            });

        }
    }
}

export function datePicker() {
    var format = "DD/MM/YYYY"

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datetimepicker({
                format: format,
                useCurrent: true
            });

            element.on('blur', function () {

                if (element.val()) {
                    console.log("blur");
                    ngModelCtrl.$setViewValue(element.val() + " 00:00:00");
                }

            })

            
            element.on('change', function () {

                console.log("change", element.val());

            })

            scope.$watch(attrs.ngModel, function (v) {
                if (v && v.length >= 10)
                    element.val(v.substring(0, 10));

            });
        }
    };
}
export function timePicker() {
    var format = "HH:mm"

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datetimepicker({
                format: format,
                useCurrent: true
            });

            element.on('blur', function () {

                if (element.val()) {
                    //console.log("blur");
                    ngModelCtrl.$setViewValue(element.val());
                }

            })

            scope.$watch(attrs.ngModel, function (v) {
                element.val(v); 
            });
        }
    };
}

export function yearPicker() {
    var format = "YYYY"

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datetimepicker({
                format: format,
                useCurrent: true
            });

            element.on('blur', function () {

                if (element.val()) {
                    //console.log("blur");
                    ngModelCtrl.$setViewValue(element.val());
                }

            })

            scope.$watch(attrs.ngModel, function (v) {
                element.val(v); 
            });
        }
    };
}

//Added by Ning  ---Start
/**
 * icheck - Directive for custom checkbox icheck
 */
export function icheck($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, element, $attrs, ngModel) {
            return $timeout(function () {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function (newValue) {
                    $(element).iCheck('update');
                })

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function (event) {
                    if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                        $scope.$apply(function () {
                            return ngModel.$setViewValue(event.target.checked);
                        });
                    }
                    if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                        return $scope.$apply(function () {
                            return ngModel.$setViewValue(value);
                        });
                    }
                });
            });
        }
    };
}
//Added by Ning  ---End


export function fileread() {
    return {
        scope: {
            fileread: "=", 
            fileext: "=",
            filename: "=",
            filemime: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        var tmp = loadEvent.target.result.split("base64,");
                        scope.filename = changeEvent.target.files[0].name;
                        scope.filemime = tmp[0].substring(5, tmp[0].length-1);
                        scope.fileread = tmp[1];
                        scope.fileext = changeEvent.target.files[0].name.substr(changeEvent.target.files[0].name.lastIndexOf('.'));
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}

