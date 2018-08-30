<?php

header("Access-Control-Allow-Origin: *");

$serverName = "699215-WEB4";
$connectionInfo = array( "Database"=>"ArticleSearch", "UID"=>"svrEblOraSr", "PWD"=>"6gV568iU");
$con = sqlsrv_connect($serverName, $connectionInfo);


?>
