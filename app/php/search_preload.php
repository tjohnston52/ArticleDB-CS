<?php

include 'connections.php';

$id = $_REQUEST['id'];

if(!$con){
echo 'connection error';
}else{
$query = "exec search_preload $id;";
//$dash = odbc_do($con, $query);
//$dash = sqlsrv_prepare($con, $query);
//$dash2 = sqlsrv_execute($dash);
$sql = sqlsrv_query($con, $query);
  if($sql){
    $status = 'ok';
    $count = 0;
    $subdata = array("matrix", "collections", "category");

    $next = sqlsrv_next_result($query);
    $data = array();
    //while($arr = odbc_fetch_array($dash))
    do{
      while($arr = sqlsrv_fetch_array($sql, SQLSRV_FETCH_ASSOC)){
        $data[$subdata[$count]][] = $arr;
      }
      $count++;
    } while(sqlsrv_next_result($sql));
//$data = 'green';
}else{
$status = 'fail';
//$data = 'orange';

}
if(count($data) == 0){
  $data = 'none';
}

//echo 'ok';

$return_array = array('status'=>$status, 'data'=>$data, 'subdata'=>$count);
echo json_encode($return_array);
//var_dump($return_array);
}

?>
