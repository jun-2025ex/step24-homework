let currentCategory = "food";

// ---------- SPAページ遷移 ----------
async function navigate(page){
  setActiveMenu(page);

  const res = await fetch(`pages/${page}.html`);
  const html = await res.text();

  document.getElementById("app").innerHTML = html;

  if(page === "home"){
    drawCharts();
  }
  if(page === "record"){
    setupRecordPage();
  }
}

// ---------- グラフ ----------
let charts = {};
function drawCharts(){
  const data = getData();
  const categories = ["food","sleep","exercise","study"];

  categories.forEach(cat => {
    const canvas = document.getElementById(cat + "Chart");
    if(!canvas) return;
    const list = data
      .filter(r => r.category === cat)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = list.map(r => r.date);
    const values = list.map(r => r.value);

    if(charts[cat]) charts[cat].destroy();

    charts[cat] = new Chart(canvas,{
      type:"line",
      data:{
        labels,
        datasets:[{
          label:getCategoryName(cat),
          data:values,
          tension:0.3
        }]
      }
    });
  });
}

function getCategoryName(cat){
  const names = {
    food:"食事カロリー",
    sleep:"睡眠時間",
    exercise:"運動時間",
    study:"勉強時間"
  };

  return names[cat] || cat;
}

// ---------- LocalStorage ----------
function getData(){
  return JSON.parse(localStorage.getItem("records") || "[]");
}

function setData(data){
  localStorage.setItem("records", JSON.stringify(data));
}

function resetData(){
  const confirmReset = confirm("本当に全データを削除しますか？");

  if(!confirmReset) return;
  localStorage.removeItem("records");

  renderTable();
  drawCharts();
}


// ---------- 記録ページ初期化 ----------
function setupRecordPage(){
  setupTabs();
  setupSearch();
  setupForm();

  renderTable();
}

// ---------- タブ ----------
function setupTabs(){
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      currentCategory = tab.dataset.category;

      renderTable();
    });
  });
}

// ---------- テーブル ----------
function renderTable(){
  const tbody = document.getElementById("recordTable");
  if(!tbody) return;
  const keyword = document.getElementById("searchInput")?.value || "";
  const data = getData();

  tbody.innerHTML = "";

  data
    .filter(r => r.category === currentCategory)
    .filter(r => r.content.includes(keyword))
    .forEach((r,index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${r.date}</td>
        <td>${r.content}</td>
        <td>${r.value}</td>
      `;

      tbody.appendChild(tr);
    });
}

// ---------- 検索 ----------
function setupSearch(){
  const input = document.getElementById("searchInput");

  if(input){
    input.addEventListener("input", renderTable);
  }
}

// ---------- フォーム ----------
function setupForm(){
  const form = document.getElementById("recordForm");

  if(!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    saveRecord();
  });
}

// ---------- 保存 ----------
function saveRecord(){
  const data = getData();
  const newRecord = {
    category: currentCategory,
    date: document.getElementById("date").value,
    content: document.getElementById("content").value,
    value: Number(document.getElementById("value").value)
  };

  data.push(newRecord);
  setData(data);

  // 入力リセット
  document.getElementById("recordForm").reset();

  closeModal();
  renderTable();
  drawCharts();
}

// ---------- メニュー ----------
function setActiveMenu(page){
  document.querySelectorAll(".menu-item")
    .forEach(btn => btn.classList.remove("active"));

  const target = document.querySelector(
    `.menu-item[onclick="navigate('${page}')"]`
  );

  if(target){
    target.classList.add("active");
  }
}


// ---------- モーダル ----------
function openModal(){
  document.getElementById("modal").classList.remove("hidden");

  // カテゴリ表示更新
  const labels = {
    food:"食事",
    sleep:"睡眠",
    exercise:"運動",
    study:"勉強"
  };

  const label = document.getElementById("modalCategoryLabel");
  if(label){
    label.textContent = labels[currentCategory];
  }
}

function closeModal(){
  document.getElementById("modal").classList.add("hidden");
}

// ---------- 初期ページ ----------
navigate("home");
