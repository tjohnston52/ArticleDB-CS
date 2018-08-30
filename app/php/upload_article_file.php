<?php

include 'connections.php';

$art_id = $_REQUEST['art_id'];
$friendly = $_REQUEST['friendly'];
$type = intval($_REQUEST['type']);
$print = $_REQUEST['print'];
$save = $_REQUEST['save'];


$allow = array("jpg", "jpeg", "gif", "png", "pdf", "ppt", "pptx", "doc", "docx", "xls", "xlsx");

$todir = '../article_files/';

// is the file uploaded yet?
if (!!$_FILES['file']['tmp_name']){

    $info = explode('.', strtolower($_FILES['file']['name'])); // whats the extension of the file

	// is this file allowed
    if (in_array(end($info), $allow)){

      if(!file_exists($todir . basename($_FILES['file']['name']))){

        if (move_uploaded_file($_FILES['file']['tmp_name'], $todir . basename($_FILES['file']['name']))){
          //chmod($todir . basename($_FILES['file']['name']), 0755);
            // the file has been moved correctly
          $filename = $_FILES['file']['name'];

           if(!$con){

             echo 'connection error';

           }else{

             $query = "exec upload_article_file $art_id, '$friendly', '$filename', $type, '$print', '$save'";
             //$query = "select * from Articles";
             //$dash = odbc_do($con, $query);
             //$dash = sqlsrv_prepare($con, $query);
             //$dash2 = sqlsrv_execute($dash);
             $sql = sqlsrv_query($con, $query);


             if($sql){
               $status = 'ok';
               $data = array();
               //while($arr = odbc_fetch_array($dash)){
              do{
                 while($arr = sqlsrv_fetch_array($sql, SQLSRV_FETCH_ASSOC)){
                   $data[] = $arr;
                 }
               }while(sqlsrv_next_result($sql));
               //$data = 'green';
             }else{
               $status = 'fail';
               //$data = 'orange';
               //$data = 'none';
             }

             //echo 'ok';

             //$return_array = array('status'=>$status, 'data'=>$data);
             //echo json_encode($return_array);
             //var_dump($return_array);
			   }
      }else{
        $status = 'error';
        $data = 'move failed';
      }
    }else{
      $status = 'error';
      $data = 'exists';
    }
  }else{
      // error this file ext is not allowed
      $status = 'error';
      $data = 'File type not allowed';
  }
}else{
  $status = 'error';
  $data = 'file not uploaded';
}

$return_array = array('status'=>$status, 'data'=>$data);
echo json_encode($return_array);

/**
$connectionInfo = array( "Database"=>"ArticleSearch", "UID"=>"svrEblOraSr", "PWD"=>"6gV568iU");
$con = sqlsrv_connect($serverName, $connectionInfo);

if(!$con){
  echo 'connection error';
}else{

  $query = "exec upload_article_url $art_id, '$friendly', '$path'";
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
**/
?>
