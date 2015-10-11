angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'app/view/pages/home.html',
            controller: 'MainController',
            controllerAs:'main'
        })
        .when('/login', {
            templateUrl: 'app/view/pages/login.html'
        })
        .when('/signup',{
            templateUrl: 'app/view/pages/signup.html'
        })
        .when('/all_stories', {
            templateUrl: 'app/view/pages/allStories.html',
            controller: 'AllStoriesController',
            controllerAs:'story',
            resolve: {
                stories: function(Story) {
                    return Story.allStories();
                }
            }
        })


    $locationProvider.html5Mode(true); // configure how application link path to storage
})  // will config ur current web application