<?php

include 'connections.php';

$id = $_REQUEST['id'];


$connectionInfo = array( "Database"=>"ArticleSearch", "UID"=>"svrEblOraSr", "PWD"=>"6gV568iU");
$con = sqlsrv_connect($serverName, $connectionInfo);

if(!$con){
  echo 'connection error';
}else{

  $query = "exec load_my_collection_articles $id";
  //$query = "select * from Articles";
  //$dash = odbc_do($con, $query);
  //$dash = sqlsrv_prepare($con, $query);
  //$dash2 = sqlsrv_execute($dash);
  $sql = sqlsrv_query($con, $query);
    if($sql){
      $status = 'ok';
      $data = array();
      //while($arr = odbc_fetch_array($dash)){
      while($arr = sqlsrv_fetch_array($sql, SQLSRV_FETCH_ASSOC)){
        $data[] = $arr;
      }
    //$data = 'green';
  }else{
    $status = 'fail';
    //$data = 'orange';
    //$data = 'none';
  }

  //echo 'ok';

  $return_array = array('status'=>$status, 'data'=>$data);
  echo json_encode($return_array);
  //var_dump($return_array);
}

?>
