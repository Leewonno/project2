
    $(document).on('click', 'a', function(e){
        history.pushState(null, null, e.target.href);
        scriptSend(e.target.href);
        $('main').load(e.target.href + " main>section");
        e.preventDefault();
    })

    $(window).on('popstate', function(e){
        console.log(location.href);
        scriptSend(location.href);
        $('main').load(location.href+ " main>section");
        
    })

    $(".search_bar").on('keydown', function(e){
        var search_term = document.querySelector(".search_bar").value;
        if(e.keyCode == 13){
            let move_href = "/search?q=" + search_term;
            console.log(move_href);
            history.pushState(null, null, move_href);
            $('main').load(move_href+ " main>section");
        }
    })


function scriptSend(hrefs){
    $.get(hrefs, function(data) {
        // 가져온 페이지의 내용을 jQuery 객체로 만듭니다.
        var $data = $(data);

        // jQuery 객체에서 <script> 태그를 선택합니다.
        var $scriptTags = $data.filter('script');

        // 선택된 <script> 태그를 현재 페이지에 추가합니다.
        $scriptTags.each(function() {
            var script = document.createElement('script');
            script.id = "sc";
            script.type = 'text/javascript';
            script.text = $(this).text();
            if(script.text.length>0){
                document.getElementById("sc").remove();
                document.body.appendChild(script);
            }
            
        });
    });
}