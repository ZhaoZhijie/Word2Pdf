$(function(){
    const MAX_FILE_SIZE = 10;//unit:MB

    $('#submit').click(function(){
        var files = $('#filepath').prop('files');
        if(files.length == 0){
            alert("Please select the file to upload");
            return;
        }
        var file = files[0];
        if(file.size > MAX_FILE_SIZE*1024*1024){
            alert('File size cannot exceed '+MAX_FILE_SIZE+'M');
            return;
        }
        console.log('file size', files[0].size)
        var data = new FormData();
        data.append('avatar', files[0]);
        $.ajax({
            type: 'POST',
            url: 'upload',
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            success:function(res){
                alert("Upload successfully");
            },
            error:function(res){
                console.log('Upload failed');
            }
        });
    })
});























