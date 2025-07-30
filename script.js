// --- script.js (V9.1 - Fixed Hero Counter) ---
document.addEventListener('DOMContentLoaded', () => {

    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const applyTheme = (theme) => {
        if (theme === 'dark') { body.classList.add('dark-mode'); themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; }
        else { body.classList.remove('dark-mode'); themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; }
    };
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
        window.dispatchEvent(new Event('themeChanged'));
    });

    // Staggered Animations on Scroll
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 100}ms`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(element => { animationObserver.observe(element); });

    // Skills Radar Chart
    const radarChartCanvas = document.getElementById('skillsRadarChart');
    if (radarChartCanvas) {
        const drawChart = () => {
            const isDark = document.body.classList.contains('dark-mode');
            const gridColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
            const labelColor = isDark ? '#c9d1d9' : '#57606a';
            if(window.myRadarChart) window.myRadarChart.destroy();
            window.myRadarChart = new Chart(radarChartCanvas.getContext('2d'), {
                type: 'radar',
                data: { labels: ['Python/SQL', 'Cloud & Big Data', 'ML Frameworks', 'Databases', 'Visualization', 'Statistics'], datasets: [{ label: 'Proficiency', data: [95, 85, 90, 88, 92, 80], backgroundColor: 'rgba(9, 105, 218, 0.2)', borderColor: 'rgba(9, 105, 218, 1)', pointBackgroundColor: '#fff', pointBorderColor: 'rgba(9, 105, 218, 1)', borderWidth: 2 }] },
                options: { responsive: true, maintainAspectRatio: false, scales: { r: { angleLines: { color: gridColor }, grid: { color: gridColor }, pointLabels: { font: { size: 12 }, color: labelColor }, ticks: { display: false }, suggestedMin: 0, suggestedMax: 100 } }, plugins: { legend: { display: false } } }
            });
        }
        drawChart();
        window.addEventListener('themeChanged', drawChart);
    }

    // Active Nav Link on Page Load
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) { link.classList.add('active-link'); }
        else { link.classList.remove('active-link'); }
    });

    // Reactive Background Spotlight
    document.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
    });

    // --- REVISED: Stats Counter (FIXED) ---
    // This new version animates the counters directly on load, which is more reliable for content at the top of the page.
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        // The increment determines the speed of the animation.
        const increment = target / 200;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 10); // Run the function again after a short delay
        } else {
            counter.innerText = target; // Ensure the final number is correct
        }
    };

    const heroDashboard = document.querySelector('.stats-dashboard');
    if (heroDashboard) {
        const counters = heroDashboard.querySelectorAll('.stat-number:not(#lines-of-code)');
        counters.forEach(animateCounter); // Start the animation for each counter
    }

    // --- LIVE DASHBOARD FUNCTIONALITY ---

    // 1. 3D Interactive Tilt Effect
    const wrapper = document.getElementById('live-dashboard-wrapper');
    if (wrapper) {
        const homeText = wrapper.querySelector('.home-text');
        const homeImage = wrapper.querySelector('.home-image');
        const maxTilt = 10;
        wrapper.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -maxTilt;
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            if (homeText) homeText.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            if (homeImage) homeImage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        wrapper.addEventListener('mouseleave', () => {
            if (homeText) homeText.style.transform = 'rotateX(0deg) rotateY(0deg)';
            if (homeImage) homeImage.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }

    // 2. "Lines of Code" Live Ticker
    const linesOfCodeElement = document.getElementById('lines-of-code');
    if (linesOfCodeElement) {
        let currentLines = parseInt(linesOfCodeElement.innerText.replace(/,/g, ''));
        setInterval(() => {
            currentLines += Math.floor(Math.random() * 5) + 1;
            linesOfCodeElement.innerText = currentLines.toLocaleString('en-US');
        }, 1000);
    }

    // 3. "Live Status" Text Cycler
    const statusTextElement = document.getElementById('status-text');
    if (statusTextElement) {
        const statuses = ["Analyzing customer churn data...", "Building predictive models...", "Optimizing SQL queries...", "Deploying new Power BI dashboard...", "Training a TensorFlow model...", "Committing to GitHub..."];
        let statusIndex = 0;
        setInterval(() => {
            statusIndex = (statusIndex + 1) % statuses.length;
            statusTextElement.innerText = statuses[statusIndex];
        }, 4000);
    }
});