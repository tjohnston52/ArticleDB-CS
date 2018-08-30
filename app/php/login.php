<?php
include 'connections.php';

$user = $_REQUEST['user'];
$pass = md5($_REQUEST['pass']);

if(!$con){
  echo 'connection error';
}else{

  $query = "exec login '$user', '$pass'";

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
    if(count($data) == 1){
      $status = 'yes';
    }else{
      $status = 'no';
      $data = count($data);
    }
  }else{
    $status = 'fail';
    //$data = 'orange';
    $data = 'no';
  }

  //echo 'ok';

  $return_array = array('status'=>$status, 'data'=>$data);
  echo json_encode($return_array);
}
?>
