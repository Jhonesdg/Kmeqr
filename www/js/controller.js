angular.module('lectorQR.controller', ['ionic','ngCordova','ngStorage'])

.controller('lectorController',function($scope,$localStorage,$ionicPopup,$cordovaBarcodeScanner, $http){
	
	if($localStorage.user==undefined && $localStorage.password==undefined) {
		$scope.logged=false;
	}else{
		$scope.logged=true;
		$scope.username=$localStorage.user;
		$scope.password=$localStorage.password;
	}
	$scope.showAlert = function(tittle,message) {
	   var alertPopup = $ionicPopup.alert({
	     title: tittle,
	     template: message
	   });
	 };
	$scope.logout=function(){
		$localStorage.$reset();
		$scope.logged=false;
		$localStorage.user=undefined;
		$localStorage.password=undefined;
		$scope.username=undefined;
		$scope.password=undefined;
		

	}
	$scope.login=function(){
	if($scope.url!= undefined && $scope.username!=undefined && $scope.password !=undefined) {
    	$http.get('http://'+$scope.url+'/api/login_qrapp/?username='+$scope.username+'&password='+$scope.password)
	    .success(function(data, status, headers,config){
	    	if(data.status=='succes'){
	    		$scope.logged=true;
	    		$localStorage.user=$scope.username;
				$localStorage.password=$scope.password;
				
	    	}else{
	    		$scope.showAlert(data.status,data.message);
	    	}
	      
	    })
	    .error(function(data, status, headers,config){
	      console.log(status);
	      if (status==-1){
	      	$scope.showAlert("error","no se pudo establecer conexión a la url ingresada");	
	      }else{
	      $scope.showAlert(data.status,data.message);
}
	    })
	    .then(function(result){
	    	
	     
	    });
	}
	else {
		$scope.showAlert("oops!","parece que no se ingresarón los datos correctamente");
	}	
	
	}

	
	$scope.leercodigo=function () {
		$cordovaBarcodeScanner.scan().then(function(imagenEscaneada){
			$http.get(imagenEscaneada.text+'/?username='+$scope.username+'&password='+$scope.password)
			    .success(function(data, status, headers,config){
			      $scope.showAlert(data.status,data.message);
			      
			    })
			    .error(function(data, status, headers,config){
			      
			      $scope.showAlert(data.status,data.message);

			    })
			    .then(function(result){
			     
			});
		},function(error){
			alert(error);
		})
	}
	
});