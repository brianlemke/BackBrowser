/**
 * Created by Jeremy on 11/16/13.
 */
    //Turn the div into an accordion

    $(".acord").accordion({
        header: ">h3",
        heightStyle: "content",
        active: false,
        collapsible: true
    });



    //capture the click on the a tag
    /*
    $(".acord h3 a").click(function() {
        window.location = $(this).attr('href');
        return false;
    });
    */
