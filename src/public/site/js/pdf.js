var fileTypes = [ 'jpg', 'jpeg', 'png','pdf'];  //acceptable file types
function readURL(input) {
    let list = document.getElementsByClassName("upl")
    for(let i = 0;i<list.length;i++){
      list[i].style.border = "none"
    }
    if (input.files && input.files[0]) {
        var extension = input.files[0].name.split('.').pop().toLowerCase(),  //file extension from input file
            isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types

        if (isSuccess) { //yes
            var reader = new FileReader();
            reader.onload = function (e) {
                if (extension == 'png'){ 
                  $(input).closest('.fileUpload').find(".icon").attr('src', e.target.result); 
                }
                else if (extension == 'jpg' || extension == 'jpeg'){
                	$(input).closest('.fileUpload').find(".icon").attr('src', e.target.result);
                }

            }

            reader.readAsDataURL(input.files[0]);
        }
        else {
            $("#error").text('Bạn đã tải sai file. Xin vui lòng tải lại')
            setTimeout(function(){
              $("#error").text('')
            },3000)
        }
    }
}
$(document).ready(function(){
   
   $(document).on('change','.up', function(){
   	var id = $(this).attr('id'); /* gets the filepath and filename from the input */
	   var profilePicValue = $(this).val();
	   var fileNameStart = profilePicValue.lastIndexOf('\\'); /* finds the end of the filepath */
	   profilePicValue = profilePicValue.substr(fileNameStart + 1).substring(0,20); /* isolates the filename */
	   //var profilePicLabelText = $(".upl"); /* finds the label text */
	   if (profilePicValue != '') {
	   	//console.log($(this).closest('.fileUpload').find('.upl').length);
	      $(this).closest('.fileUpload').find('.upl').html(profilePicValue); /* changes the label text */
	   }
   });

   $(".btn-new").on('click',function(){
      if(JSON.parse(localStorage.getItem("User")).PriceId){
        $("#uploader").append('<div class="row uploadDoc"><div class="col-sm-3"><div class="docErr">Please upload valid file</div><div class="fileUpload btn btn-orange" style="border:1px solid #ccc;width: 335px;height: 75px;background-color: white;margin-left:-65px;"><img class="icon" style="width:100px;height:60px;border: 2px dashed #ccc;"><span class="upl" id="upload" style="font-size:18px;padding: 30px;color:black;margin-left: 7px;border-right:2px solid #ccc">Chọn File</span><img src="static/site/assest/down.png" class="icon" style="width:20px;height:20px;margin-left: 27px;"><input type="file" name="image" class="upload up" id="up" onchange="readURL(this);" style="width: 360px;height: 73px" /></div></div><div class="col-sm-1 del" style="margin-left:100px;margin-top:28px"><a class="btn-check"  id="del"><i class="fa fa-times"></i></a></div></div>');
      }
      else
      {
        $("#error").text('Bạn phải đăng ký premium mới có thể chuyển đổi nhiều ảnh')
        setTimeout(function(){
          $("#error").text('')
        },3000)
      }
    })
    
   $(document).on("click", ".del" , function() {
     if($(".uploadDoc").length>1){
       console.log('a')
        $(this).closest(".uploadDoc").remove();
      }else{
        alert("You have to upload at least one document.");
      } 
     });
});