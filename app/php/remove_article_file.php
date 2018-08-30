<?php

include 'connections.php';

$art_id = $_REQUEST['article'];
$file_id = $_REQUEST['file'];

$connectionInfo = array( "Database"=>"ArticleSearch", "UID"=>"svrEblOraSr", "PWD"=>"6gV568iU");
$con = sqlsrv_connect($serverName, $connectionInfo);

if(!$con){
  echo 'connection error';
}else{

  $query = "exec remove_article_file $art_id, $file_id";
  //$query = "select * from Articles";
  //$dash = odbc_do($con, $query);
  //$dash = sqlsrv_prepare($con, $query);
  //$dash2 = sqlsrv_execute($dash);
  $sql = sqlsrv_query($con, $query);
  if($sql){


    $data = array();
    //while($arr = odbc_fetch_array($dash)){
    while($arr = sqlsrv_fetch_array($sql, SQLSRV_FETCH_ASSOC)){
      $data[] = $arr;
    }
    $status = 'ok';
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
