var scroller = document.querySelector(".sidebar");

function func()
{
    scroller.setAttribute('special', '1');
    window.setTimeout(() => {scroller.setAttribute('special', '0')}, 500)
}
scroller.addEventListener("scroll", func);
