angular.module('storyCtrl',['storyService'])

.controller('StoryController', function(Story, socketio){
    var vm = this;
    Story.allStory()
        .success(function(data){
            vm.stories = data;
        });

    vm.createStory = function() {
        vm.message ='';
        Story.create(vm.storyData)
            .success(function(data){
                vm.storyData = ''; // once put story data api succeed,  go ahead, clear the form
                vm.message = data.message;
                vm.stories.push(data);
            });
    };

    socketio.on('story', function(data){  // this is event listening. whenever u create a new story, immediately push
        vm.stories.push(data);
    })

})

.controller('AllStoriesController', function(stories, socketio){
    var vm = this;
    vm.stories = stories.data;
    socketio.on('story', function(data){  // this is event listening. whenever u create a new story, immediately push
           vm.stories.push(data);
    })

});