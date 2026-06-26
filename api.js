const OPC_API_ENDPOINTS = [
  { method: "GET", path: "/api/health", name: "服务健康检查", status: "ready" },
  { method: "POST", path: "/api/script/generate", name: "AI 生成剧本", status: "mock" },
  { method: "POST", path: "/api/script/breakdown", name: "剧本拆解场次/分镜", status: "mock" },
  { method: "POST", path: "/api/assets/sync", name: "从剧本同步素材", status: "mock" },
  { method: "POST", path: "/api/video/generate", name: "分镜视频生成", status: "mock" },
  { method: "POST", path: "/api/compose/export", name: "合成导出", status: "mock" },
];

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

function buildGeneratedScript({ title, genre, tone, length, characterBrief, seed }) {
  const count = Number(length) || 3;
  const sceneTemplates = [
    {
      place: "办公室",
      time: "白天",
      beat: "sato 在高层办公室整理失败项目的数据，miko 带着新的合作企划出现，两人的关系从戒备开始。",
      shot: "第 1 镜：办公室相遇",
      prompt: "sato 和 miko 在办公室相遇，桌面有电脑和企划文件。镜头为中景，都市白天，自然光，情绪克制。",
      assets: ["sato", "miko", "办公室", "电脑"],
      duration: "5s",
      cost: 750,
    },
    {
      place: "原野",
      time: "黄昏",
      beat: "miko 邀请 sato 离开城市去看一间旧木屋，夕阳下两人第一次谈起真正想要的生活。",
      shot: "第 2 镜：原野散步",
      prompt: "miko 和 sato 走在原野木屋旁，远处有一只鸭子穿过草地。夕阳逆光，现实短剧质感。",
      assets: ["sato", "miko", "原野", "鸭子"],
      duration: "5s",
      cost: 750,
    },
    {
      place: "汽车内部",
      time: "夜晚",
      beat: "两人在车内发生争执，sato 承认自己害怕重新开始，miko 要他做出选择。",
      shot: "第 3 镜：车内争执",
      prompt: "汽车内部夜晚，两人沉默后爆发争执。镜头从仪表盘后方拍摄，城市灯光掠过车窗。",
      assets: ["sato", "miko", "汽车内部"],
      duration: "8s",
      cost: 980,
    },
    {
      place: "办公室",
      time: "清晨",
      beat: "sato 回到办公室删除旧方案，打开 miko 的企划，决定独自承担下一轮风险。",
      shot: "第 4 镜：清晨决定",
      prompt: "清晨办公室，sato 独自坐在电脑前修改企划，窗外天色刚亮，情绪从压抑转向坚定。",
      assets: ["sato", "办公室", "电脑"],
      duration: "6s",
      cost: 820,
    },
    {
      place: "原野",
      time: "日出",
      beat: "miko 在木屋前等到 sato，两人没有拥抱，只是并肩看向远处，留下可继续连载的开放结尾。",
      shot: "第 5 镜：开放结尾",
      prompt: "日出原野木屋前，sato 和 miko 并肩站立看向远方。镜头缓慢推进，现实浪漫短剧质感。",
      assets: ["sato", "miko", "原野"],
      duration: "6s",
      cost: 820,
    },
    {
      place: "办公室",
      time: "上午",
      beat: "两人把企划拆成可执行清单，sato 第一次把决策权交给 miko，关系从对抗转向协作。",
      shot: "第 6 镜：共同拆解",
      prompt: "办公室上午，sato 和 miko 面对电脑一起拆解企划，桌面有笔记本和纸质清单，镜头稳定克制。",
      assets: ["sato", "miko", "办公室", "电脑"],
      duration: "6s",
      cost: 820,
    },
    {
      place: "汽车内部",
      time: "雨夜",
      beat: "路上突遇大雨，miko 说出真正的合作条件，sato 明白这不只是项目，也是一次自我修复。",
      shot: "第 7 镜：雨夜条件",
      prompt: "汽车内部雨夜，挡风玻璃有雨痕，两人低声谈判。近景切换，情绪压迫但真实。",
      assets: ["sato", "miko", "汽车内部"],
      duration: "8s",
      cost: 980,
    },
    {
      place: "原野",
      time: "傍晚",
      beat: "旧木屋前，sato 把最终方案交给 miko，两人决定用一个小团队完成第一条 AI 短剧。",
      shot: "第 8 镜：小团队出发",
      prompt: "傍晚原野木屋前，sato 递出最终方案，miko 点头。远景收束，适合短剧第一集结尾。",
      assets: ["sato", "miko", "原野"],
      duration: "7s",
      cost: 900,
    },
  ];
  const selected = sceneTemplates.slice(0, Math.min(count, sceneTemplates.length));
  const scriptText = [
    `《${title || "未命名短剧"}》`,
    "",
    `类型：${genre}`,
    `风格：${tone}`,
    `角色：${characterBrief}`,
    `故事种子：${seed}`,
    "",
    ...selected.flatMap((scene, index) => [
      `场次 ${String(index + 1).padStart(2, "0")}｜${scene.place}｜${scene.time}`,
      scene.beat,
      "",
    ]),
  ].join("\n").trim();

  return {
    script: scriptText,
    scenes: selected.map((scene, index) => ({
      title: `场次 ${String(index + 1).padStart(2, "0")}｜${scene.place}｜${scene.time}`,
      beat: scene.beat,
      characters: scene.assets.filter((asset) => ["sato", "miko"].includes(asset)),
      location: scene.place,
      output: scene.shot,
    })),
    shots: selected.map((scene) => ({
      title: scene.shot,
      prompt: scene.prompt,
      assets: scene.assets,
      duration: scene.duration,
      cost: scene.cost,
      image: scene.place === "办公室" ? image.office : scene.place === "原野" ? image.field : image.car,
    })),
  };
}

window.OPC_API = {
  endpoints: OPC_API_ENDPOINTS,

  async health() {
    await wait(180);
    return {
      ok: true,
      mode: "mock",
      latency: "180ms",
      endpoints: OPC_API_ENDPOINTS,
    };
  },

  async generateScript(payload) {
    await wait(760);
    return buildGeneratedScript(payload);
  },

  async breakdownScript(script) {
    await wait(420);
    return { ok: true, scenes: script ? "updated" : "empty" };
  },

  async syncAssets() {
    await wait(360);
    return { ok: true, synced: { roles: 2, scenes: 3, props: 2 } };
  },

  async generateVideo({ count, model }) {
    await wait(580);
    return { ok: true, count, model };
  },

  async composeExport() {
    await wait(900);
    return { ok: true, file: "OPC_AI_Drama_1080p.mp4" };
  },
};
