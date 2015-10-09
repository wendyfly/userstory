angular.module('userCtrl',['userService'])  // inject userService

.controller('UserController', function(User){
    var vm = this;

    User.all()
        .success(function(data){
            vm.users = data; // call api/users api, get data, put all data into users object
        })

})

.controller('UserCreateController', function(User, $location, $window){ // use window because after sign up , will direct to new page
    var vm = this;

    vm.signupUser = function() {
        vm.message = '';
        User.create(vm.userData)
            .then(function(response){
                vm.userData ={};
                vm.message = response.data.message;

                $window.localStorage.setItem('token', response.data.token); // browser store the token
                $location.path('/'); // redirect u to homepage
            })
    }
})

