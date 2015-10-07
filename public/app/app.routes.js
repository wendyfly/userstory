angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'app/view/pages/home.html'
        })
        .when('/login', {
            templateUrl: 'app/view/pages/login.html'
        })

    $locationProvider.html5Mode(true);
})  // will config ur current web applicaiton