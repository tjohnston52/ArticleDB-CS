<?php

include 'connections.php';

$new = intval($_REQUEST['new']);
$old = intval($_REQUEST['old']);
$dir = intval($_REQUEST['relation']);

if(!$con){
echo 'connection error';
}else{
/*
$query = "exec check_article_relation $new, $old, $dir";
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

  $data = $data[0]['ct'];
  if(intval($data) < 1){
  */
    $query = "exec create_article_relation $new, $old, $dir";
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
    $data = 'none';
    }
    /*
  }else{
    $status = 'ok';
    $data = 'exist';
  }
//$data = 'green';
}else{
  $status = 'fail';
  //$data = 'orange';
  $data = 'none';

}
*/
//echo 'ok';

$return_array = array('status'=>$status, 'data'=>$data);
echo json_encode($return_array);
//var_dump($return_array);
}

?>
