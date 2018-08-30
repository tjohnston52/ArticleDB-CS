<?php

include 'connections.php';

$search = $_REQUEST['data'];
$dir = $_REQUEST['dir'];
$filter = $_REQUEST['filter'];

$data = "Declare @dir int;Declare @filter varchar(20);Set @dir = ".$dir.";Set @filter = '".$filter."';";
$data .= 'Select id = t1.ID, [title] = Title, LongDescription, Authors, Summary, PubMonth, PubYear, t1.date_inserted, t1.rating, t1.ratingFavor, [comment_user_fname] = t3.fname, [comment_user_lname] = t3.lname,  [comment_text] = t2.CommentText, comment_date = t2.date_inserted, KeyWords from Articles t1 ';
$data .= 'left outer join( select * from( select *, ROW_NUMBER() over (partition by ArticleID order by date_inserted desc) as rn from Comments ) sub where rn = 1 ) t2 on t1.ID = t2.ArticleID left outer join User_Login t3 on t2.user_id = t3.user_id  where ';
$i = 0;
foreach($search as $mydata) {

  $sub = $mydata['subsearch'];

   switch($mydata['name']){
    case "author":
      $data .= "ID in(select ID from Articles where Authors like '%".$sub[0]['author-last']."%')";
      break;
    case "category":
      $data .= 'ID in (select Article_ID from ArticleCategory where Category_ID = '.$sub[0]['category'].')';
      break;
    case "collection":
      $data .= 'ID in (select ArticleID from Collections where BucketID = '.$sub[0]['collection'].')';
      break;
    case "datadate":
      switch($sub[0]['dateselector']){
        case '=':
          $data .= 'ID in (select ID from Articles where (DataStartMonth = '.$sub[1]['month'].' AND DataStartYear = '.$sub[2]['year'].') OR (DataEndMonth = '.$sub[1]['month'].' AND DataEndYear = '.$sub[2]['year'].'))';
          break;
        case '>=':
          $data .= 'ID in (select ID from Articles where (DataStartMonth >= '.$sub[1]['month'].' AND DataStartYear = '.$sub[2]['year'].') OR (DataEndMonth >= '.$sub[1]['month'].' AND DataEndYear = '.$sub[2]['year'].') OR (DataEndYear > '.$sub[2]['year'].') OR (DataStartYear > '.$sub[2]['year'].'))';
          break;
        case '<=':
          $data .= 'ID in (select ID from Articles where (DataStartMonth <= '.$sub[1]['month'].' AND DataStartYear = '.$sub[2]['year'].') OR (DataEndMonth <= '.$sub[1]['month'].' AND DataEndYear = '.$sub[2]['year'].') OR (DataEndYear < '.$sub[2]['year'].') OR (DataStartYear < '.$sub[2]['year'].'))';
          break;
      }
      break;
    case "description":
      $data .= "ID in(select ID from Articles where LongDescription like '%".$sub[0]['description']."%')";
      break;
    case "favorability":
      $data .= 'ID in (select ID from Articles where ratingFavor = '.$sub[0]['favorability'].')';
      break;
    case "issue":
      $data .= "ID in (select ID from Articles where IssueInformation like '%".$sub[0]['issue']."%')";
      break;
    case "keywords":
      $data .= "ID in (select ID from(select *, limit = ROW_NUMBER() OVER(partition by id order by id asc) from Articles tot inner join(select * from dbo.SplitString('".$sub[0]['keys']."', ',')) s1 on tot.KeyWords like '%'+s1.Value+'%') t1 where limit = 1)";
      break;
    case "location":
      $data .= "ID in (select ID from Articles where Location like '%".$sub[0]['location']."%')";
      break;
    case "matrix":
      $data .= 'ID in (select ArticleID from ArticleDetails where MatrixID = '.$sub[0]['operator'].')';
      break;
    case "patientcount":
       switch($sub[0]['operator']){
        case '=':
          $data .= 'ID in (select ArticleID from PatientData where PatientCount = '.$sub[1]['count'].')';
          break;
        case '<=':
          $data .= 'ID in (select ArticleID from PatientData where PatientCount <= '.$sub[1]['count'].')';
          break;
        case '>=':
          $data .= 'ID in (select ArticleID from PatientData where PatientCount >= '.$sub[1]['count'].')';
          break;
       }
       break;
    case "patientdescription":
          $data .= "ID in (select ArticleID from PatientData where Description like '%".$sub[0]['patientdescription']."%')";
          break;
    case "product":
          $data .= "ID in (select ArticleID from ArticleDetails where CompetitorInfo like '%".$sub[0]['product']."%')";
          break;
    case "pubdate":
          switch($sub[0]['dateselector']){
            case '=':
              $data .= 'ID in (select ID from Articles where (PubMonth = '.$sub[1]['month'].' AND PubYear = '.$sub[2]['year'].'))';
              break;
            case '>=':
              $data .= 'ID in (select ID from Articles where (PubMonth >= '.$sub[1]['month'].' AND PubYear = '.$sub[2]['year'].') OR (PubYear > '.$sub[2]['year'].'))';
              break;
            case '<=':
              $data .= 'ID in (select ID from Articles where (PubMonth <= '.$sub[1]['month'].' AND PubYear = '.$sub[2]['year'].') OR (PubYear < '.$sub[2]['year'].'))';
              break;
          }
          break;
    case "rating":
          $data .= 'ID in (select ID from Articles where rating '.$sub[0]['operator'].' '.$sub[1]['rating'].')';
          break;
    case "sensitivity":
          $data .= 'ID in (select ArticleID from ArticleDetails where Sensitivity '.$sub[0]['operator'].' '.$sub[1]['sensitivity'].')';
          break;
    case "source":
          $data .= "ID in (select ArticleID from Articles where SourceCountry like '%".$sub[0]['source']."%')";
          break;
    case "specificity":
          $data .= 'ID in (select ArticleID from ArticleDetails where Specificity '.$sub[0]['operator'].' '.$sub[1]['specificity'].')';
          break;
    case "summary":
          $data .= "ID in (select ArticleID from Articles where Summary like '%".$sub[0]['summary']."%')";
          break;
    case "title":
          $data .= "ID in (select ArticleID from Articles where Title like '%".$sub[0]['title']."%')";
          break;
   }


   if($i < count($search)-1){
    $data .= ' AND ';
   }
   $i++;
}

$data .= " Order By ";
$data .= "case when @dir = 0 and @filter = 'title' then title END asc,";
$data .= "case when @dir = 1 and @filter = 'title' then title END desc,";
$data .= "case when @dir = 0 and @filter = 'author' then Authors END asc,";
$data .= "case when @dir = 1 and @filter = 'author' then Authors END desc,";
$data .= "case when @dir = 0 and @filter = 'publish' then PubYear END asc,";
$data .= "case when @dir = 0 and @filter = 'publish' then PubMonth END asc,";
$data .= "case when @dir = 1 and @filter = 'publish' then PubYear END desc,";
$data .= "case when @dir = 1 and @filter = 'publish' then PubMonth END desc,";
$data .= "case when @dir = 0 and @filter = 'favor' then ratingFavor END asc,";
$data .= "case when @dir = 1 and @filter = 'favor' then ratingFavor END desc,";
$data .= "case when @filter <> 'title' then title end asc";


if(!$con){
echo 'connection error';
}else{
$query = $data;
//$dash = odbc_do($con, $query);
//$dash = sqlsrv_prepare($con, $query);
//$dash2 = sqlsrv_execute($dash);


$sql = sqlsrv_query($con, $query);
  if($sql){
    $status = 'ok';
    $res = array();
    //while($arr = odbc_fetch_array($dash)){
    while($arr = sqlsrv_fetch_array($sql, SQLSRV_FETCH_ASSOC)){
      $res[] = $arr;
    }
//$data = 'green';
}else{
  $status = 'fail';
  //$data = 'orange';
  $data = 'none';
}

//echo 'ok';

$return_array = array('status'=>$status, 'data'=>$res, 'search'=>$data);
echo json_encode($return_array);
//var_dump($return_array);
}

?>
