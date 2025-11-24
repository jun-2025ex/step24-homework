const datasets = {
    data: {
        labels: data.labels,
        datasets: [{ label: '売上', data: data.sales, fill: true, tension: 0.3 }]
    },
    options: { responsive: true, maintainAspectRatio: false }
};
    
chart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: data.labels,
        datasets: [{ label: '新規ユーザー', data: data.users }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});
    
chart3 = new Chart(ctx3, {
    type: 'doughnut',
    data: {
        labels: ['Web', 'iOS', 'Android', 'Other'],
        datasets: [{ label: 'platform', data: data.platforms }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

chart4 = new Chart(ctx4, {
    type: 'radar',
    data: {
        labels: ['UX', 'Speed', 'Support', 'Price', 'Design'],
        datasets: [{ label: '満足度', data: data.satisfaction }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { r: { beginAtZero: true, max: 5 } }
}
});

initCharts(datasets.A);

document.getElementById('dsA').addEventListener('click', () => initCharts(datasets.A));
document.getElementById('dsB').addEventListener('click', () => initCharts(datasets.B));
document.getElementById('randomize').addEventListener('click', () => {
const base = datasets.A;
const rand = {
    labels: base.labels,
    sales: randomizeArray(base.sales, 0.4),
    users: randomizeArray(base.users, 0.6),
    platforms: randomizeArray(base.platforms, 0.5),
    satisfaction: base.satisfaction.map(v =>
        Math.round(Math.max(1, Math.min(5, v * (1 + (Math.random() * 2 - 1) * 0.3))) * 10) / 10
    )
};

initCharts(rand);
});

document.querySelectorAll('.menu button').forEach(btn => {
    btn.addEventListener('click', e => {
        document.querySelectorAll('.menu button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.dataset.view;

        document.querySelector('.title').textContent =
            view === 'overview'
                ? 'ダッシュボード'
                : view === 'settings'
                ? '設定'
                : view.charAt(0).toUpperCase() + view.slice(1);

        if (view === 'sales') initCharts(datasets.B);
        if (view === 'audience') initCharts(datasets.A);
    });
});

 window.addEventListener('resize', () => {
    [chart1, chart2, chart3, chart4].forEach(c => {
        if (c) {
            c.resize();
        }
    });
});