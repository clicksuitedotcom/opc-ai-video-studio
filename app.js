const photo = (name) => `url("./assets/${name}.jpg")`;

const image = {
  office: photo("office"),
  field: photo("field"),
  car: photo("car"),
  duck: photo("duck"),
  laptop: photo("laptop"),
  product: photo("product"),
};

const projects = [
  { title: "佐藤爱情故事", status: "创作中", date: "2026-06-24", shots: 3, progress: 66, ratio: "16:9", model: "Seedance", image: image.office },
  { title: "完美婚姻的纠缠", status: "可合成", date: "2026-06-23", shots: 12, progress: 92, ratio: "9:16", model: "Kling", image: image.field },
  { title: "重生只为黄金万两", status: "创作中", date: "2026-06-22", shots: 8, progress: 48, ratio: "16:9", model: "Seedance", image: image.product },
  { title: "我的物件能说话", status: "脚本中", date: "2026-06-21", shots: 5, progress: 24, ratio: "1:1", model: "Doubao", image: image.laptop },
  { title: "无人之城的回声", status: "可合成", date: "2026-06-20", shots: 16, progress: 88, ratio: "16:9", model: "Runway", image: image.car },
  { title: "午后杂货店", status: "创作中", date: "2026-06-19", shots: 7, progress: 54, ratio: "9:16", model: "Seedance", image: image.duck },
];

const materials = [
  { type: "角色", name: "sato", desc: "中年办公室大叔", voice: "悠悠君子", image: image.office },
  { type: "角色", name: "miko", desc: "年轻女孩", voice: "妩媚御姐", image: image.field },
  { type: "场景", name: "办公室", desc: "高层窗景办公室", image: image.office },
  { type: "场景", name: "原野", desc: "落日荒野木屋", image: image.field },
  { type: "场景", name: "汽车内部", desc: "商务车驾驶舱", image: image.car },
  { type: "道具", name: "电脑", desc: "办公笔记本电脑", image: image.laptop },
  { type: "道具", name: "鸭子", desc: "原野中出现的线索", image: image.duck },
  { type: "道具", name: "低糖麦片", desc: "商业广告产品", image: image.product },
];

const shots = [
  {
    title: "第 1 镜：办公室相遇",
    prompt: "sato 和 miko 在办公室相遇，sato 正在用电脑办公。镜头为中景，都市白天，自然光，情绪克制。",
    assets: ["sato", "miko", "办公室", "电脑"],
    duration: "5s",
    cost: 750,
    image: image.office,
  },
  {
    title: "第 2 镜：原野散步",
    prompt: "miko 和 sato 手牵手在原野的木屋旁散步，背景有一只鸭子。夕阳逆光，浪漫短剧质感。",
    assets: ["sato", "miko", "原野", "鸭子"],
    duration: "5s",
    cost: 750,
    image: image.field,
  },
  {
    title: "第 3 镜：车内争执",
    prompt: "两人在汽车内部发生分歧，镜头从仪表盘后方拍摄，紧张但不夸张，适合连续剧转场。",
    assets: ["sato", "miko", "汽车内部"],
    duration: "8s",
    cost: 980,
    image: image.car,
  },
];

const scenes = [
  {
    title: "场次 01｜办公室｜白天",
    beat: "sato 办公时被 miko 带来的合作企划打断，人物关系建立。",
    characters: ["sato", "miko"],
    location: "办公室",
    output: "第 1 镜：办公室相遇",
  },
  {
    title: "场次 02｜原野｜黄昏",
    beat: "两人走到木屋旁，谈起离开城市后的生活，情绪转向浪漫。",
    characters: ["sato", "miko"],
    location: "原野",
    output: "第 2 镜：原野散步",
  },
  {
    title: "场次 03｜汽车内部｜夜晚",
    beat: "车内争执推动矛盾升级，给合成阶段的节奏点提供依据。",
    characters: ["sato", "miko"],
    location: "汽车内部",
    output: "第 3 镜：车内争执",
  },
];

const state = {
  materialFilter: "all",
  activeView: "projects",
  query: "",
  generated: new Set([0]),
  apiMode: "mock",
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function setBackground(el, value) {
  el.style.setProperty("--image", value);
}

function toast(message) {
  const node = $("#toast");
  node.textContent = message;
  node.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => node.classList.remove("show"), 2200);
}

function setButtonLoading(button, loadingText) {
  if (!button) return () => {};
  const original = button.innerHTML;
  button.disabled = true;
  button.innerHTML = `<span class="button-icon icon-sync" aria-hidden="true"></span>${loadingText}`;
  return () => {
    button.disabled = false;
    button.innerHTML = original;
  };
}

function updateScriptFacts() {
  const facts = $$(".script-facts span strong");
  if (!facts.length) return;
  facts[0].textContent = scenes.length;
  facts[1].textContent = new Set(scenes.flatMap((scene) => scene.characters)).size;
  facts[2].textContent = new Set(shots.flatMap((shot) => shot.assets)).size;
  facts[3].textContent = `${shots.reduce((sum, shot) => sum + Number.parseInt(shot.duration, 10), 0)}s`;
}

function switchView(view) {
  state.activeView = view;
  $$(".view").forEach((node) => node.classList.remove("active"));
  $(`#${view}View`)?.classList.add("active");
  $$(".nav-item").forEach((node) => node.classList.toggle("active", node.dataset.view === view));
  $$(".workflow-step").forEach((node) => node.classList.toggle("active", node.dataset.step === view));
}

function enterEditor() {
  $("#homepage")?.classList.add("hidden");
  $("#editorApp")?.classList.remove("editor-hidden");
  document.body.classList.remove("home-active");
  switchView("projects");
  toast("已进入编辑态：从项目定义开始");
}

function exitEditor() {
  $("#editorApp")?.classList.add("editor-hidden");
  $("#homepage")?.classList.remove("hidden");
  document.body.classList.add("home-active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  toast("已退出工作台，回到 Homepage");
}

function renderProjects() {
  const grid = $("#projectGrid");
  const q = state.query.trim().toLowerCase();
  const items = projects.filter((item) => item.title.toLowerCase().includes(q));
  grid.innerHTML = items
    .map(
      (project, index) => `
      <article class="project-card" data-project="${index}">
        <div class="thumb"></div>
        <div class="project-body">
          <div class="meta-row">
            <h3>${project.title}</h3>
            <span class="status">${project.status}</span>
          </div>
          <div class="project-progress" aria-label="项目进度 ${project.progress}%">
            <span style="--progress:${project.progress}%"></span>
          </div>
          <div class="meta-row">
            <span>${project.ratio} · ${project.model}</span>
            <span>${project.shots} 镜 · ${project.progress}%</span>
          </div>
          <div class="meta-row">
            <span>${project.date}</span>
            <span>点击进入剧本</span>
          </div>
        </div>
      </article>
    `
    )
    .join("");
  $$(".project-card").forEach((card, index) => {
    setBackground(card.querySelector(".thumb"), items[index].image);
    card.addEventListener("click", () => {
      switchView("screenplay");
      toast(`已进入「${items[index].title}」剧本工作台`);
    });
  });
}

function renderScenes() {
  const root = $("#sceneList");
  if (!root) return;
  root.innerHTML = scenes
    .map(
      (scene, index) => `
      <article class="scene-card">
        <div class="scene-index">${String(index + 1).padStart(2, "0")}</div>
        <div>
          <div class="scene-head">
            <h3>${scene.title}</h3>
            <span class="status">已映射分镜</span>
          </div>
          <p>${scene.beat}</p>
          <div class="scene-tags">
            ${scene.characters.map((name) => `<span>${name}</span>`).join("")}
            <span>${scene.location}</span>
          </div>
        </div>
        <div class="scene-output">
          <span>输出到</span>
          <strong>${scene.output}</strong>
        </div>
      </article>
    `
    )
    .join("");
  updateScriptFacts();
}

function renderMaterials() {
  const root = $("#materialSections");
  const q = state.query.trim().toLowerCase();
  const filtered = materials.filter((item) => {
    const matchesFilter = state.materialFilter === "all" || item.type === state.materialFilter;
    const matchesQuery = `${item.name}${item.desc}${item.type}`.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });
  const groups = ["角色", "场景", "道具"].filter((type) => filtered.some((item) => item.type === type));
  root.innerHTML = groups
    .map((type) => {
      const cards = filtered
        .filter((item) => item.type === type)
        .map(
          (item) => `
          <article class="material-card">
            <div class="material-art"></div>
            <div class="material-body">
              <div class="material-meta">
                <h3>${item.name}</h3>
                <span>${item.type}</span>
              </div>
              <p>${item.desc}</p>
              <div class="material-meta">
                <span>${item.voice ? `音色：${item.voice}` : "可用于分镜引用"}</span>
                <span>已完成</span>
              </div>
              <div class="material-actions">
                <button type="button"><span class="button-icon icon-eye" aria-hidden="true"></span>预览</button>
                <button type="button"><span class="button-icon icon-link" aria-hidden="true"></span>引用</button>
              </div>
            </div>
          </article>
        `
        )
        .join("");
      return `<section class="material-group"><h3>${type} <span class="status">总计 ${filtered.filter((item) => item.type === type).length}</span></h3><div class="material-grid">${cards}</div></section>`;
    })
    .join("");
  $$(".material-card").forEach((card, index) => setBackground(card.querySelector(".material-art"), filtered[index].image));
}

function renderShots() {
  const root = $("#shotList");
  root.innerHTML = shots
    .map((shot, index) => {
      const assetRows = shot.assets
        .map((name) => {
          const material = materials.find((item) => item.name === name);
          return `
            <div class="asset-pill">
              <span class="mini-img" style="--image:${material?.image || image.product}"></span>
              <span>${name}</span>
            </div>`;
        })
        .join("");
      const done = state.generated.has(index);
      return `
        <article class="shot-card">
          <div class="shot-panel">
            <div class="shot-meta">
              <strong>${shot.title}</strong>
              <span class="status">${done ? "已生成" : "待生成"}</span>
            </div>
            <div class="meta-row">
              <span>${shot.duration}</span>
              <span>${shot.cost} 点</span>
            </div>
            <div class="shot-assets">${assetRows}</div>
          </div>
          <div class="prompt-box">
            <textarea aria-label="${shot.title}提示词">${shot.prompt}</textarea>
            <div class="shot-controls">
              <select aria-label="模型"><option>${$("#modelSelect")?.value || "Doubao-Seedance-2.0"}</option><option>Seedance Pro Fast</option></select>
              <select aria-label="时长"><option>${shot.duration}</option><option>8s</option><option>10s</option></select>
              <button class="primary-button generate-one" data-index="${index}" type="button"><span class="button-icon ${done ? "icon-sync" : "icon-play"}" aria-hidden="true"></span>${done ? "重新生成" : "生成视频"}</button>
            </div>
          </div>
          <div class="shot-preview">
            <div class="preview-overlay">
              <span>${done ? "0:00 / " + shot.duration : "等待生成"}</span>
              <span>${shot.cost} 点</span>
            </div>
          </div>
        </article>`;
    })
    .join("");
  $$(".shot-card").forEach((card, index) => setBackground(card.querySelector(".shot-preview"), shots[index].image));
  $$(".generate-one").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      state.generated.add(index);
      renderShots();
      renderTimeline();
      toast(`${shots[index].title} 已加入生成队列`);
    });
  });
}

function renderTimeline() {
  const timeline = $("#timeline");
  timeline.innerHTML = shots
    .map(
      (shot, index) => `
      <button class="timeline-card" type="button" data-index="${index}">
        <div class="timeline-thumb"></div>
        <div class="timeline-meta">
          <strong>${index + 1}</strong>
          <span>${shot.duration}</span>
        </div>
      </button>
    `
    )
    .join("");
  $$(".timeline-card").forEach((card, index) => {
    setBackground(card.querySelector(".timeline-thumb"), shots[index].image);
    card.addEventListener("click", () => {
      $("#playerCaption").textContent = shots[index].title;
      setBackground($(".mock-player"), shots[index].image);
    });
  });
  setBackground($(".mock-player"), shots[0].image);
}

function renderApiEndpoints(health) {
  const root = $("#apiEndpoints");
  if (!root || !window.OPC_API) return;
  root.innerHTML = window.OPC_API.endpoints
    .map(
      (endpoint) => `
      <article class="endpoint-card">
        <div>
          <span>${endpoint.method}</span>
          <strong>${endpoint.path}</strong>
        </div>
        <p>${endpoint.name}</p>
        <small>${health?.ok ? "ready" : endpoint.status}</small>
      </article>
    `
    )
    .join("");
}

async function checkApiHealth() {
  const button = $("#checkApiBtn");
  const done = setButtonLoading(button, "检查中");
  try {
    const health = await window.OPC_API.health();
    renderApiEndpoints(health);
    toast(`后台接口可用：${health.mode} · ${health.latency}`);
  } catch (error) {
    toast("后台接口检查失败，请检查 API 配置");
  } finally {
    done();
  }
}

async function generateScript(event) {
  event?.preventDefault();
  const button = $("#generateScriptBtn");
  const done = setButtonLoading(button, "生成中");
  try {
    const payload = {
      title: $("#scriptTitleInput").value.trim(),
      genre: $("#scriptGenreInput").value,
      length: $("#scriptLengthInput").value,
      tone: $("#scriptToneInput").value,
      characterBrief: $("#characterBriefInput").value.trim(),
      seed: $("#storySeedInput").value.trim(),
    };
    const result = await window.OPC_API.generateScript(payload);
    $("#scriptEditor").value = result.script;
    scenes.splice(0, scenes.length, ...result.scenes);
    shots.splice(0, shots.length, ...result.shots);
    state.generated = new Set();
    renderScenes();
    renderShots();
    renderTimeline();
    $("#scriptApiStatus strong").textContent = "Script Generated";
    $("#scriptApiStatus small").textContent = `${result.scenes.length} 场 · ${result.shots.length} 镜头草稿`;
    toast("AI 剧本已生成，并同步刷新场次与分镜草稿");
  } catch (error) {
    toast("AI 剧本生成失败，请检查接口配置");
  } finally {
    done();
  }
}

async function refineScript() {
  const button = $("#refineScriptBtn");
  const done = setButtonLoading(button, "优化中");
  try {
    await window.OPC_API.breakdownScript($("#scriptEditor").value);
    $("#scriptEditor").value = `${$("#scriptEditor").value.trim()}\n\n导演备注：镜头语言保持现实感，人物动作克制，每场结尾保留一个可剪辑的情绪停顿。`;
    toast("已优化当前剧本：补充导演备注和节奏提示");
  } finally {
    done();
  }
}

function wireEvents() {
  $$(".nav-item").forEach((item) => item.addEventListener("click", () => switchView(item.dataset.view)));
  $$(".workflow-step").forEach((item) => item.addEventListener("click", () => switchView(item.dataset.step)));
  $$(".auth-enter").forEach((button) => button.addEventListener("click", enterEditor));
  $("#logoutBtn").addEventListener("click", exitEditor);
  $("#scriptGeneratorForm").addEventListener("submit", generateScript);
  $("#refineScriptBtn").addEventListener("click", refineScript);
  $("#checkApiBtn").addEventListener("click", checkApiHealth);
  $$(".segmented button").forEach((button) => {
    button.addEventListener("click", () => {
      state.materialFilter = button.dataset.materialFilter;
      $$(".segmented button").forEach((node) => node.classList.toggle("active", node === button));
      renderMaterials();
    });
  });

  $("#searchInput").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderProjects();
    renderMaterials();
  });

  $("#newProjectBtn").addEventListener("click", () => {
    projects.unshift({ title: "新 AI 漫剧项目", status: "脚本中", date: "2026-06-25", shots: 0, progress: 8, ratio: "16:9", model: "Seedance", image: image.product });
    renderProjects();
    switchView("projects");
    toast("已创建新项目，请先完成项目定义");
  });

  $("#addMaterialBtn").addEventListener("click", () => {
    materials.unshift({ type: "角色", name: "新角色", desc: "从一句话描述生成形象", voice: "默认音色", image: image.product });
    renderMaterials();
    toast("已新增一个角色素材草稿");
  });

  $("#batchAssetBtn").addEventListener("click", async () => {
    const done = setButtonLoading($("#batchAssetBtn"), "提交中");
    const result = await window.OPC_API.syncAssets();
    done();
    toast(`已提交素材任务：${result.synced.roles} 个角色、${result.synced.scenes} 个场景、${result.synced.props} 个道具`);
  });

  $("#syncAssetsBtn").addEventListener("click", async () => {
    const done = setButtonLoading($("#syncAssetsBtn"), "同步中");
    const result = await window.OPC_API.syncAssets();
    done();
    toast(`已从剧本同步 ${result.synced.roles} 个角色、${result.synced.scenes} 个场景到素材库`);
  });

  $("#breakdownScriptBtn").addEventListener("click", async () => {
    const done = setButtonLoading($("#breakdownScriptBtn"), "拆解中");
    await window.OPC_API.breakdownScript($("#scriptEditor").value);
    done();
    state.generated = new Set([0]);
    renderShots();
    switchView("storyboard");
    toast(`剧本已拆解为 ${shots.length} 条分镜，并继承角色、场景和对白`);
  });

  $("#batchGenerateBtn").addEventListener("click", async () => {
    const done = setButtonLoading($("#batchGenerateBtn"), "生成中");
    await window.OPC_API.generateVideo({ count: shots.length, model: $("#modelSelect").value });
    done();
    shots.forEach((_, index) => state.generated.add(index));
    renderShots();
    renderTimeline();
    toast(`已使用 ${$("#modelSelect").value} 批量生成 ${shots.length} 条分镜`);
  });

  $("#composeBtn").addEventListener("click", async () => {
    const done = setButtonLoading($("#composeBtn"), "合成中");
    const status = $("#exportStatus");
    status.textContent = "合成中：校准角色一致性、生成字幕、拼接时间线...";
    const result = await window.OPC_API.composeExport();
    done();
    status.textContent = `成片已完成：${result.file}`;
    toast("视频合成完成");
  });

  $("#themeToggle").addEventListener("click", () => document.body.classList.toggle("dark"));
}

renderProjects();
renderMaterials();
renderScenes();
renderShots();
renderTimeline();
renderApiEndpoints({ ok: true });
wireEvents();
