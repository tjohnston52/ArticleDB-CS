<?php

include 'connections.php';


$req = $_REQUEST['data'];

// Main
$title = str_replace("'", "''", $req['title']);
$desc = ($req['description'] == "") ? 'Null' : "'". str_replace("'", "''", $req['description'])."'";
$author = ($req['author'] == "") ? 'Null' : "'". str_replace("'", "''", $req['author'])."'";
$summary = ($req['summary'] == "") ? 'Null' : "'". str_replace("'", "''", $req['summary'])."'";
$journal = ($req['journal'] == "") ? 'Null' : "'". str_replace("'", "''", $req['journal'])."'";
$issue = ($req['issue'] == "") ? 'Null' : "'". str_replace("'", "''", $req['issue'])."'";
$source_country = ($req['source_country'] == "") ? 'Null' : "'". str_replace("'", "''", $req['source_country'])."'";
$data_start_month = ($req['data_start_month'] == "") ? 'Null' : "'".$req['data_start_month']."'";
$data_start_year = ($req['data_start_year'] == "") ? 'Null' : $req['data_start_year'];
$data_end_month = ($req['data_end_month'] == "") ? 'Null' : "'".$req['data_end_month']."'";
$data_end_year = ($req['data_end_year'] == "") ? 'Null' : $req['data_end_year'];
$pub_month = ($req['pub_month'] == "") ? 'Null' : "'".$req['pub_month']."'";
$pub_year = ($req['pub_year'] == "") ? 'Null' : $req['pub_year'];
$keywords = ($req['keywords'] == "") ? 'Null' : "'". str_replace("'", "''", $req['keywords'])."'";
$user = intval($req['user']);
$rating = $req['rating'];
$ratingFavor = intval($req['ratingFavor']);


// Sub
$comments = ($req['comments'] == "") ? 'Null' : "'". str_replace("'", "''", $req['comments'])."'";

// Cats
$category = $req['category'];

// Studies
$study = $req['study_details'];
$patient = $req['patient_details'];



$fullquery = "exec create_article '$title', $desc, $author, $summary, $journal, $issue, $source_country, $data_start_month, $data_start_year, $data_end_month, $data_end_year, $pub_month, $pub_year, $keywords, $user, $rating, $ratingFavor;";
$fullquery .= "Declare @art_id int;Set @art_id = @@identity;";

if($req['comments'] != ""){
  $fullquery .= "Insert into Comments Values(@art_id, $user, $comments, GETDATE());";
}else{
  $fullquery .= 'select id = 0 from Articles where ID = 0;';
}

foreach($category as $mydata){

  $category = (intval($mydata) == "") ? 'Null' : intval($mydata);

  $study_query.= "exec upload_article_category @art_id, $category;";

}



foreach($study as $mydata){

  $id = intval($mydata['id']);
  $product = ($mydata['product'] == "") ? 'Null' : "'". str_replace("'", "''", $mydata['product'])."'";
  $sens = (floatval($mydata['sensitivity']) == "") ? 'Null' : floatval($mydata['sensitivity']);
  $sens_note = ($mydata['sensitivity_note'] == "") ? 'Null' : "'". str_replace("'", "''", $mydata['sensitivity_note'])."'";
  $spec = (floatval($mydata['specificity']) == "") ? 'Null' : floatval($mydata['specificity']);
  $spec_note = ($mydata['specificity_note'] == "") ? 'Null' : "'". str_replace("'", "''", $mydata['specificity_note'])."'";

  $study_query.= "exec upload_article_study @art_id, $id, $product, $sens, $sens_note, $spec, $spec_note;";

}


foreach($patient as $mydata){

  $count = (intval($mydata['count']) == "") ? 'Null' : intval($mydata['count']);
  $desc = ($mydata['desc'] == "") ? 'Null' : "'". str_replace("'", "''", $mydata['desc'])."'";

  $study_query.= "exec upload_article_patient @art_id, $count, $desc;";

}

$fullquery .= $study_query . "Select id from Articles where ID = @art_id;";


//$status = 'ok';


//$fullquery = "Insert into testTable values (1);select * from testTable;";
//$fullquery = "declare @id int; Insert into testTable values (1); set @id = @@identity; Insert into testTable values (@id); select id from testTable where id = 2;";


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
