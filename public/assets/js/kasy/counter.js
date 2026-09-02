const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const speed = 300;
            const target = +counter.getAttribute("data-target");
            const updateCount = () => {
                const count = +counter.innerText;
                const inc = target / speed;
                if (count < target) {
                    counter.innerText = (count + inc).toFixed(0);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
            observer.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll(".counter_value").forEach(counter => {
    counter.innerText = "0";
    observer.observe(counter);
});