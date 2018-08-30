<?php

include 'connections.php';

$art_id = intval($_REQUEST['article']);
$bucket = intval($_REQUEST['bucket']);
//$cur_bucket = intval($_REQUEST['cur_bucket']);

if(!$con){
  echo 'connection error';
}else{
  $query = "select * from Collections where ArticleID = $art_id and BucketID = $bucket";
  $query2 = "exec add_article_to_collection $art_id, $bucket";

  //$dash = odbc_do($con, $query);
  //$dash = sqlsrv_prepare($con, $query);
  //$dash2 = sqlsrv_execute($dash);
  $sql = sqlsrv_query($con, $query);
    if($sql){
      $status = 'ok';
      $exist = array();
      //while($arr = odbc_fetch_array($dash)){
      while($arr = sqlsrv_fetch_array($sql, SQLSRV_FETCH_ASSOC)){
        $exist[] = $arr;
      }


      if(count($exist) < 1){
        $sql = sqlsrv_query($con, $query2);
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
      }else{
        $status = 'exists';
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
