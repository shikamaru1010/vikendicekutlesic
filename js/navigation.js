document.addEventListener('DOMContentLoaded',() => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');

    hamburger.addEventListener('click',function(){
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () =>{
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        })
    })

})