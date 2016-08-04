'use strict';
var app = angular.module('autoCompletion', ['algoliasearch',  'ngSanitize', 'algolia.autocomplete'])
app.controller('mainController', ['$scope', 'algolia', function($scope, algolia, mainService){

    var client = algolia.Client('MMO735BJPX', 'da32b5d7551d0d21bc5539789514a3d7',{
        protocol:'https:'
    });
    var totalIndex = client.initIndex('bestBuy');
    var typeIndex = client.initIndex('typeIndex');

    /** Function used to create the type Index through the API
     function createTypeIndex(){
        mainService.getData().then((response) => {
            var types = mainService.createIndices(response);

            _.forEach(types, function(value, key){
                console.log(key,  value.products);

                index.addObject({type: key, products: value.products}, function(err, content){
                    console.log('obj', content.type);
                 })
            });
         });
    })();
     **/


    $scope.search = {
        'query' : '',
        'hits' : []
    };
    
    $scope.getOptions = function(){
        var options = {
            autoselect: true,
            templates: {
                empty: '<div>Sorry No Results</div>'
            },
            cssClasses: {
                prefix: 'idx-result'
            }
        };
        return options;
    };


    $scope.$watch('search.query', function() {
        totalIndex.search($scope.search.query, {
                attributesToRetrieve: ['name', 'brand', 'type', 'image'],
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

    totalIndex.setSettings({
        'customRanking': ['desc(popularity)']
    }, function(err, content) {
        console.log(content);
    });
    //
    totalIndex.setSettings({
        'attributesToIndex': [
            'name',
            'brand',
            'categories',
            'type',
            'image'
        ]
    }, function(err, content) {
        console.log(content);
    });

    typeIndex.setSettings({
        'attributesToIndex': [
            'name',
            'categories',
            'type'
        ]
    }, function(err, content) {
        console.log(content);
    });



    //data set for the dropdown
    $scope.getDatasets = function() {

        return [
            {
                name: 'type',
                displayKey: 'type',
                source: function (q, cb) {
                    typeIndex.search(q, {
                        attributesToRetrieve: ['name', 'categories'],
                        hitsPerPage: 50,
                        getRankingInfo: true
                    }, function (error, content) {
                        if (error) {
                            cb([]);
                            return;
                        }
                        cb(content.hits);
                    });
                },
                templates: {
                    //suggestion returns only one record
                    suggestion: function (suggestion) {
                        var display = suggestion._highlightResult.name.value + ' in ';
                        display += suggestion._highlightResult.categories[0].value;
                        return display;
                    }
                }
            },

            {
            name: 'name',
            displayKey: 'name',
            source: function (q, cb) {
                totalIndex.search(q, {
                    attributesToRetrieve: ['name', 'categories'],
                    hitsPerPage: 50,
                    getRankingInfo: true
                }, function (error, content) {
                    if (error) {
                        cb([]);
                        return;
                    }
                    cb(content.hits);
                });
            },
            templates: {
                //suggestion returns only one record
                suggestion: function (suggestion) {
                    var display = suggestion._highlightResult.name.value + ' in ';
                    display += suggestion._highlightResult.categories[0].value;
                    return display;
                }
            }
        }
        ];
    };




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
            //return the cb when it's available (asynchronously)
            return response.data;
        }, function errorCallback(response) {
            //return the error cb if it occurs (asynchronously)
            return response;

        });
    }

    function createIndices(data){
        var typeIndex = {};
        var typeObj = {};

        for(var i=0; i<data.length; i++){
            var item = data[i];
            if(item.type in typeIndex){
                typeObj[item.type].products(item);
                typeIndex[item.type] = typeObj[item.type];
            }
            else{
                typeObj[item.type] = {
                    name: item.type,
                    products: []
                };
                typeObj[item.type].products(item);
                typeIndex[item.type] = typeObj[item.type];
            }
        }

        return typeIndex;
    }

    return {
        getData: getData,
        createIndices: createIndices
    }
})






