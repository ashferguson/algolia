'use strict';
var app = angular.module('autoCompletion', ['algoliasearch', 'algolia.autocomplete', 'ngSanitize'])
app.controller('mainController', ['$scope', 'algolia', function($scope, algolia, mainService){

    //TODO: remember bower install algolia-autocomplete.js -S
    var client = algolia.Client('MMO735BJPX', '16b339c5caaf798cfac0159acd201a72');
    var index = client.initIndex('bestBuy');

    $scope.search = {
        'query' : '',
        'hits' : []
    };
        $scope.$watch('search.query', function() {
            index.search($scope.search.query, {
                    attributesToRetrieve: ['name', 'brand'],
                    hitsPerPage: 50,
                    getRankingInfo: true
            })
                .then(function searchSuccess(content) {
                    console.log(content);
                    // add content of search results to scope for display in view
                    $scope.search.hits = content.hits;
                }, function searchFailure(err) {
                    console.log(err);
                });
        });



    index.search('query string', {

    }, function searchDone(err, content) {
        if (err) {
            console.error(err);
            return;
        }

        for (var h in content.hits) {
            console.log('Hit(' + content.hits[h].objectID + '): ' + content.hits[h].toString());
        }
    });

    index.setSettings({
        'customRanking': ['desc(popularity)']
    }, function(err, content) {
        console.log(content);
    });

    index.setSettings({
        'attributesToIndex': [
            'brand',
            'categories',
            'type',
            'name',
        ]
    }, function(err, content) {
        console.log(content);
    });



    //data set for the dropdown
    $scope.getDatasets = function() {

        return {
            displayKey: 'name',
            source: function(q, cb) {
                index.search(q, {
                    attributesToRetrieve: ['name', 'brand'],
                    hitsPerPage: 50,
                    getRankingInfo: true
                }, function(error, content) {
                    if (error) {
                        cb([]);
                        return;
                    }
                    cb(content.hits);
                });
            },
            templates: {
                suggestion: function(suggestion) {
                    return suggestion._highlightResult.name.value;
                }
            }
        };
    };



    $scope.$watch('q', function(v) {
                console.log(v);
            });
            $scope.$on('autocomplete:selected', function(event, suggestion, dataset) {
                console.log(suggestion, dataset);
            });

            index.search('query string', {

            }, function searchDone(err, content) {
                if (err) {
                    console.error(err);
                    return;
                }

                for (var h in content.hits) {
                    console.log('Hit(' + content.hits[h].objectID + '): ' + content.hits[h].toString());
                }
            });

            index.setSettings({
                'customRanking': ['desc(popularity)']
            }, function(err, content) {
                console.log(content);
            });

            index.setSettings({
                'attributesToIndex': [
                    'brand',
                    'categories',
                    'type',
                    'name',
                ]
            }, function(err, content) {
                console.log(content);
            });





            // mainService.getData().then((response) => {
            //         $scope.data = response;
            //     });


        // }
    }]);



app.service('mainService', function($http){
    function getData(){
        return  $http({
            method: 'GET',
            url: 'https://raw.githubusercontent.com/algolia/instant-search-demo/master/data.json'
        }).then(function successCallback(response) {
            return response.data;
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            return response;

        });
    }

    return {
        getData: getData
    }
})






