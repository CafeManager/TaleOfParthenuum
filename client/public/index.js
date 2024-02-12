map = $(".map");

// $.ready(function (e) {
//     console.log("loaded!");
//     function start_drag() {
//         img_ele = this;
//         x_img_ele =
//             window.event.clientX - document.getElementById(".map").offsetLeft;
//         y_img_ele =
//             window.event.clientY - document.getElementById(".map").offsetTop;
//     }

//     $("#scaler").on("change", function (e) {
//         console.log(this);
//         console.log(e);
//         $(map).css("zoom", e.target.value);
//     });

//     $(".map").draggable();
//     $(".map").offset({ top: -500, left: -500 });

//     $("body").css("zoom", "300%");
// });
console.log("test");
$(document).ready(function (e) {
    console.log("loaded!");
    function start_drag() {
        img_ele = this;
        x_img_ele =
            window.event.clientX - document.getElementById(".map").offsetLeft;
        y_img_ele =
            window.event.clientY - document.getElementById(".map").offsetTop;
    }

    $("#scaler").on("change", function (e) {
        console.log(this);
        console.log(e);
        $(map).css("zoom", e.target.value);
    });

    $(".map").draggable();
    $(".map").offset({ top: -500, left: -500 });

    // $("body").css("zoom", "300%");
});
console.log("reach");
console.log($(".map"));
// $(".map").draggable();
// $(".map").offset({ top: -500, left: -500 });

// $("body").css("zoom", "300%");
// isDragging = false;

// function start_drag() {
//     img_ele = this;
//     x_img_ele =
//         window.event.clientX - document.getElementById(".map").offsetLeft;
//     y_img_ele =
//         window.event.clientY - document.getElementById(".map").offsetTop;
// }

// $("#scaler").on("change", function (e) {
//     console.log(this);
//     console.log(e);
//     $(map).css("zoom", e.target.value);
// });

// $(".map").draggable();
// $(".map").offset({ top: -500, left: -500 });

// $("body").css("zoom", "300%");
