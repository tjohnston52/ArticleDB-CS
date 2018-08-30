<?php

include 'connections.php';

$id = intval($_REQUEST['id']);

$fullquery .= $study_query . "exec delete_article $id";

if ( sqlsrv_begin_transaction( $con ) === false ) {
     $status = 'fail2';
}else{
	$sql = sqlsrv_query($con, $fullquery);

	if( $sql ) {

		 $data = array();
		 $next = sqlsrv_next_result($sql);
		 do{
       while($arr = sqlsrv_fetch_array($sql, SQLSRV_FETCH_ASSOC)){
         $data[] = $arr;
       }
     }while(sqlsrv_next_result($sql));
		 //$data = 'green';

		 //$data = $data['id'];

		 $status = 'ok';
		 sqlsrv_commit( $con );


	} else {

		 $status = 'fail';
		 $data = 'Not Committed';
		 sqlsrv_rollback( $con );

	}
}

//$return_array = array('status'=>$status, 'data'=>$data[0]['id']);
$return_array = array('status'=>$status, 'data'=>$data);
//$return_array = array('status'=>$status, 'data'=>$data);
echo json_encode($return_array);

?>
