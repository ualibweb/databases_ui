angular.module('databases', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'databases.common',
    'databases.templates',
    'databases.list'
])

    .constant('DATABASES_API_URL', '//wwwdev2.lib.ua.edu/databases/api/')
    .constant('PROXY_PREPEND_URL', 'http://libdata.lib.ua.edu/login?url=')

    .factory('dbFactory', ['$http', 'DATABASES_API_URL', function dbFactory($http, url){
        return {
            getData: function(request){
                return $http({method: 'GET', url: url + request, params: {}})
            }
        }
    }])

    .controller('mainDatabasesCtrl', ['$scope', '$routeParams', 'dbFactory', 'PROXY_PREPEND_URL',
    function($scope, $routeParams, dbFactory, proxyURL){
        $scope.dbList = {};
        $scope.dbList.searchText = '';
        $scope.dbList.titleFilter = '';
        $scope.dbList.titleStartFilter = '';
        $scope.dbList.descrFilter = '';
        $scope.dbList.subjectFilter = '';
        $scope.dbList.typeFilter = '';

        //need to load all databases only once
        dbFactory.getData("all")
            .success(function(data){
                for (var i = 0; i < data.subjects.length; i++){
                    data.subjects[i].selected = false;
                }
                for (var i = 0; i < data.types.length; i++){
                    data.types[i].selected = true;
                }
                for (var i = 0; i < data.databases.length; i++){
                    data.databases[i].show = false;
                    data.databases[i].primary = true;
                    data.databases[i].class = "";
                    data.databases[i].filterBy = data.databases[i].title + data.databases[i].description;
                    if (data.databases[i].auth == '1')
                        data.databases[i].url = proxyURL + data.databases[i].url;
                    for (var j = 0; j < data.databases[i].subjects.length; j++)
                        for (var k = 0; k < data.subjects.length; k++)
                            if (data.databases[i].subjects[j].sid === data.subjects[k].sid){
                                data.databases[i].subjects[j].index = k;
                                break;
                            }
                    for (var j = 0; j < data.databases[i].types.length; j++)
                        for (var k = 0; k < data.types.length; k++)
                            if (data.databases[i].types[j].tid === data.types[k].tid){
                                data.databases[i].types[j].index = k;
                                break;
                            }
                }
                $scope.dbList = data;
                if (typeof $routeParams.s !== 'undefined')
                    $scope.dbList.searchText = $routeParams.s;
                if (typeof $routeParams.t !== 'undefined')
                    $scope.dbList.titleFilter = $routeParams.t;
                if (typeof $routeParams.ts !== 'undefined')
                    $scope.dbList.titleStartFilter = $routeParams.ts;
                if (typeof $routeParams.d !== 'undefined')
                    $scope.dbList.descrFilter = $routeParams.d;
                if (typeof $routeParams.fs !== 'undefined')
                    $scope.dbList.subjectFilter = $routeParams.fs;
                if (typeof $routeParams.ft !== 'undefined')
                    $scope.dbList.typeFilter = $routeParams.ft;
                console.dir($scope.dbList);
            })
            .error(function(msg){
                console.log(msg);
            });

    }])
    .directive('databasesMain', [function databasesMain(){
        return {
            restrict: 'A',
            controller: 'mainDatabasesCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: 'dbList/databasesMain.tpl.html'
        }
    }])





angular.module('databases.common', [
    'common.databases'
])
angular.module('common.databases', [])


angular.module('databases.list', ['ngSanitize'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/databases/:s?/title/:t?/ts/:ts?/descr/:d?/fs/:fs?/ft/:ft?', {
                templateUrl: 'dbList/dbListMain.tpl.html',
                controller: 'databasesCtrl'
            })
    }])
    .controller('databasesCtrl', ['$scope', '$location', '$rootScope',
        function($scope, $location, $rootScope){

            $scope.search = function(){
                if ($scope.dbList.searchText){
                    var newPath = '/databases/' + $scope.dbList.searchText;
                    newPath += '/title/';
                    if ($scope.dbList.titleFilter)
                        newPath = newPath + $scope.dbList.titleFilter + '/';
                    newPath += 'ts/';
                    if ($scope.dbList.titleStartFilter)
                        newPath = newPath + $scope.dbList.titleStartFilter + '/';
                    newPath += 'descr/';
                    if ($scope.dbList.descrFilter)
                        newPath = newPath + $scope.dbList.descrFilter + '/';
                    newPath += 'fs/';
                    if ($scope.dbList.subjectFilter)
                        newPath = newPath + $scope.dbList.subjectFilter + '/';
                    newPath += 'ft/';
                    if ($scope.dbList.typeFilter)
                        newPath = newPath + $scope.dbList.typeFilter + '/';
                    $location.path(newPath);
                }
            }

            $rootScope.$on('$routeChangeSuccess', function(event, currentRoute){
                if ($scope.dbList.searchText !== currentRoute.params.s)
                    $scope.dbList.searchText = currentRoute.params.s;
                if (typeof currentRoute.params.t !== 'undefined')
                    $scope.dbList.titleFilter = currentRoute.params.t;
                if (typeof currentRoute.params.ts !== 'undefined')
                    $scope.dbList.titleStartFilter = currentRoute.params.ts;
                if (typeof currentRoute.params.d !== 'undefined')
                    $scope.dbList.descrFilter = currentRoute.params.d;
                if (typeof currentRoute.params.fs !== 'undefined')
                    $scope.dbList.subjectFilter = currentRoute.params.fs;
                if (typeof currentRoute.params.ft !== 'undefined')
                    $scope.dbList.typeFilter = currentRoute.params.ft;

            });
        }])

    .controller('dbListCtrl', ['$scope', function dbListCtrl($scope){
        $scope.currentPage = 1;
        $scope.maxPageSize = 10;
        $scope.perPage = 20;
        $scope.subTypSelOpen = false;
        $scope.noSubjSelected = true;

        $scope.compareTitle = function(actual, expected){
            if (!expected)
                return true;
            if (actual.toLowerCase().indexOf(expected.toLowerCase()) > -1)
                return true;
            return false;
        };
        $scope.filterPrimarySubjects = function(actual, expected){
            if ($scope.noSubjSelected)
                return true;

            for (var t = 0; t < expected.length; t++)
                if (expected[t].selected){
                    var isPresent = false;
                    for (var i = 0; i < actual.length; i++)
                        if (expected[t].sid == actual[i].sid){
                            isPresent = true;
                            break;
                        }
                    if (!isPresent)
                        return false;
                }

            return true;
        };
        $scope.filterTypes = function(actual, expected){
            for (var i = 0; i < actual.length; i++)
                if (expected[actual[i].index].selected)
                    return true;
            return false;
        };
        $scope.startTitle = function(actual, expected){
            if (!expected)
                return true;
            if (actual.toLowerCase().indexOf(expected.toLowerCase()) == 0)
                return true;
            return false;
        };

        $scope.selectAllSubjects = function(value){
            for (var i = 0; i < $scope.dbList.subjects.length; i++)
                $scope.dbList.subjects[i].selected = value;
            $scope.noSubjSelected = !value;
            $scope.updatePrimaryStatus();
        };
        $scope.selectAllTypes = function(value){
            for (var i = 0; i < $scope.dbList.types.length; i++)
                $scope.dbList.types[i].selected = value;
        };
        $scope.updateStatus = function(index){
            //btn-checkbox will change value after this function returns
            if (!$scope.dbList.subjects[index].selected){
                $scope.noSubjSelected = false;
            } else {
                $scope.noSubjSelected = true;
                for (var i = 0; i < $scope.dbList.subjects.length; i++)
                    if ($scope.dbList.subjects[i].selected && i != index){
                        $scope.noSubjSelected = false;
                        break;
                    }
            }
            $scope.updatePrimaryStatus();
        };
        $scope.updatePrimaryStatus = function(){
            if ($scope.noSubjSelected)
                for (var i = 0; i < $scope.dbList.databases.length; i++)
                    $scope.dbList.databases[i].primary = true;
            else
                for (var i = 0; i < $scope.dbList.databases.length; i++){
                    $scope.dbList.databases[i].primary = true;
                    for (var t = 0; t < $scope.dbList.subjects.length; t++)
                        if ($scope.dbList.subjects[t].selected){
                            var isPresent = false;
                            for (var j = 0; j < $scope.dbList.databases[i].subjects.length; j++)
                                if ($scope.dbList.subjects[t].sid === $scope.dbList.databases[i].subjects[j].sid &&
                                    $scope.dbList.databases[i].subjects[j].type == '1'){
                                    isPresent = true;
                                    break;
                                }
                            if (!isPresent){
                                $scope.dbList.databases[i].primary = false;
                                break;
                            }
                        }
                }

        };

        $scope.toggleDB = function(db){
            $scope.dbList.databases[$scope.dbList.databases.indexOf(db)].show =
                !$scope.dbList.databases[$scope.dbList.databases.indexOf(db)].show;
        };
    }])

    .directive('databasesList', [function databasesList(){
        return {
            restrict: 'A',
            controller: 'dbListCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: 'dbList/dbList.tpl.html'
        }
    }])
    .filter('startFrom', function() {
        return function(input, start) {
            if (typeof input === 'undefined')
                return null;
            start = +start; //parse to int
            return input.slice(start);
        }
    })
