$(document).ready(function(){
    $(document).on('click', 'a', function(e){
        history.pushState(null, null, e.target.href);
        // document.querySelector(".style_box").appendChild(load(e.target.href + " #pagestyle"))
        $('main').load(e.target.href+ " main>section");
        
        e.preventDefault();
    })

    $(window).on('popstate', function(e){
        console.log(location.href);
        // document.head.appendChild(load(location.href + " #pagestyle"))
        $('main').load(location.href+ " main>section");
        
    })
})