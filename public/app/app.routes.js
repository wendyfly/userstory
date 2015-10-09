angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'app/view/pages/home.html'
        })
        .when('/login', {
            templateUrl: 'app/view/pages/login.html'
        })
        .when('/signup',{
            templateUrl: 'app/view/pages/signup.html'
        })

    $locationProvider.html5Mode(true); // configure how application link path to storage
})  // will config ur current web application