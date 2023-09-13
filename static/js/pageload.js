
    $(document).on('click', 'a', async function(e){
        history.pushState(null, null, e.target.href);
        await $('main').load(e.target.href + " main>section");
        scriptSend(e.target.href);
        e.preventDefault();
    })

    $(window).on('popstate', async function(e){
        console.log(location.href);
        await $('main').load(location.href+ " main>section");
        scriptSend(location.href);
    })

    $(".search_bar").on('keydown', function(e){
        var search_term = document.querySelector(".search_bar").value;
        const encodedQ = encodeURIComponent(search_term);
        if(e.keyCode == 13){
            let move_href = "/search?q=" + encodedQ;
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
            // document.getElementById("sc").textContent = $(this).text();
            var script = document.createElement('script');
            script.id = "sc";
            script.text = $(this).text();
            if(script.text.length>0){
                document.querySelector("#sc").remove();
                document.body.appendChild(script);
            }
            
        });

        
    });

    // fetch(hrefs)
    // .then(response => response.text())
    // .then(data => {
    //     var $data = $(data);
    //     // jQuery 객체에서 <script> 태그를 선택합니다.
    //     var $scriptTags = $data.filter('script');
    //     console.log($scriptTags)

    //     console.log(data);
    //     // 받아온 데이터로 DOM을 업데이트합니다.
    //     document.getElementById("sc").innerHTML = data;
    // });
}