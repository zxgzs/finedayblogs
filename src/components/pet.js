/**
 * 伊布宠物类
 * https://github.com/oorzc/pet2
 */

// 宠物 HTML 结构
const eeveeHTML = `
  <div class="eevee">
    <div class="tail"></div>
    <div class="tail-end"></div>
    <div class="body"></div>
    <div class="chest"></div>
    <div class="fur-center"></div>
    <div class="fur-center-patch-left"></div>
    <div class="fur-center-patch-right"></div>
    <div class="fur-right"></div>
    <div class="fur-right-patch"></div>
    <div class="leg front-left">
      <div class="leg-inner"></div>
      <div class="paw-inner"></div>
    </div>
    <div class="leg front-right">
      <div class="leg-inner"></div>
      <div class="paw-inner"></div>
    </div>
    <div class="leg back-left">
      <div class="leg-inner"></div>
      <div class="paw"></div>
    </div>
    <div class="leg back-right">
      <div class="leg-inner"></div>
      <div class="paw"></div>
    </div>
    <div class="head"></div>
    <div class="head-shadow"></div>
    <div class="ear left"></div>
    <div class="ear right"></div>
    <div class="eyes">
      <div class="eye left"></div>
      <div class="eyelid left"></div>
      <div class="eye right"></div>
      <div class="eyelid right"></div>
    </div>
    <div class="nose"></div>
    <div class="mouth">
      <div class="mouth-move"></div>
      <div class="mouth-side left"></div>
      <div class="mouth-side right"></div>
    </div>
  </div>
`;

// 宠物样式
const eeveeCSS = `
  .pet-main {
    position: fixed;
    right: 60px;
    bottom: 40px;
    z-index: 9999;
    display: block;
    width: 120px;
    height: 150px;
    overflow: visible;
    font-family: "Microsoft Yahei", Helvetica, Arial, sans-serif;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    user-select: none;
  }
  
  .pet-main .eevee {
    position: absolute;
    top: 28px;
    left: 0px;
    z-index: 99;
    cursor: grab;
    cursor: -webkit-grab;
    transform: scale(0.5);
    width: 300px;
    height: 300px;
  }
  
  .pet-main .eevee:active {
    cursor: grabbing;
    cursor: -webkit-grabbing;
  }
  
  .pet-main .eevee * {
    position: absolute;
  }
  
  .pet-main .pet-chat {
    position: absolute;
    left: -210px;
    top: 32px;
    z-index: 102;
    width: 200px;
    border: 1px solid #955d27;
    background: #ffe;
    font-size: 12px;
    border-radius: 4px;
    padding: 8px 12px;
  }
  
  .pet-main .pet-chat::before,
  .pet-main .pet-chat::after {
    position: absolute;
    bottom: -4px;
    right: 3px;
    border-bottom: 5px solid transparent;
    border-right: 14px solid #ffe;
    content: "";
  }
  
  .pet-main .pet-chat::before {
    bottom: -5px;
    right: 2px;
    border-right: 16px solid #955d27;
  }
  
  .pet-main .pet-word {
    padding: 0.5em;
    color: #9d7442;
    min-height: 15px;
    word-wrap: break-word;
  }
  
  /* 伊布身体各部分 */
  .eevee .tail {
    width: 120px;
    height: 80px;
    background: #9d7442;
    border-radius: 60px 60px 0 0;
    left: 30px;
    top: 180px;
    transform: rotate(-30deg);
    transform-origin: bottom right;
  }
  
  .eevee .tail-end {
    width: 60px;
    height: 40px;
    background: #efe1af;
    border-radius: 30px 30px 0 0;
    left: 130px;
    top: 145px;
    transform: rotate(-30deg);
  }
  
  .eevee .body {
    width: 140px;
    height: 120px;
    background: #9d7442;
    border-radius: 70px 70px 60px 60px;
    left: 80px;
    top: 130px;
  }
  
  .eevee .chest {
    width: 80px;
    height: 70px;
    background: #efe1af;
    border-radius: 40px 40px 35px 35px;
    left: 110px;
    top: 150px;
  }
  
  .eevee .fur-center {
    width: 30px;
    height: 25px;
    background: #9d7442;
    left: 135px;
    top: 155px;
  }
  
  .eevee .fur-center-patch-left {
    width: 25px;
    height: 20px;
    background: #9d7442;
    left: 120px;
    top: 160px;
    border-radius: 0 0 12px 12px;
  }
  
  .eevee .fur-center-patch-right {
    width: 25px;
    height: 20px;
    background: #9d7442;
    left: 155px;
    top: 160px;
    border-radius: 0 0 12px 12px;
  }
  
  .eevee .fur-right {
    width: 35px;
    height: 45px;
    background: #9d7442;
    left: 180px;
    top: 155px;
    border-radius: 0 20px 20px 0;
  }
  
  .eevee .fur-right-patch {
    width: 20px;
    height: 25px;
    background: #9d7442;
    left: 180px;
    top: 175px;
    border-radius: 0 10px 10px 0;
  }
  
  .eevee .leg {
    width: 35px;
    height: 60px;
    background: #9d7442;
    border-radius: 17px 17px 10px 10px;
  }
  
  .eevee .leg.front-left {
    left: 85px;
    top: 220px;
    animation: leg 2s ease-in-out infinite;
  }
  
  .eevee .leg.front-right {
    left: 120px;
    top: 220px;
    animation: leg 2s ease-in-out infinite 0.5s;
  }
  
  .eevee .leg.back-left {
    left: 155px;
    top: 220px;
    animation: leg 2s ease-in-out infinite 0.25s;
  }
  
  .eevee .leg.back-right {
    left: 190px;
    top: 220px;
    animation: leg 2s ease-in-out infinite 0.75s;
  }
  
  .eevee .leg-inner {
    width: 20px;
    height: 35px;
    background: #efe1af;
    border-radius: 10px 10px 5px 5px;
    left: 7px;
    top: 5px;
  }
  
  .eevee .paw-inner {
    width: 18px;
    height: 12px;
    background: #efe1af;
    border-radius: 9px 9px 5px 5px;
    left: 8px;
    top: 40px;
  }
  
  .eevee .paw {
    width: 22px;
    height: 14px;
    background: #9d7442;
    border-radius: 11px 11px 5px 5px;
    left: 6px;
    top: 48px;
  }
  
  .eevee .head {
    width: 130px;
    height: 110px;
    background: #9d7442;
    border-radius: 65px 65px 55px 55px;
    left: 85px;
    top: 60px;
    animation: head 3s ease-in-out infinite;
    z-index: 10;
  }
  
  .eevee .head-shadow {
    width: 100px;
    height: 30px;
    background: rgba(0,0,0,0.1);
    border-radius: 50%;
    left: 100px;
    top: 155px;
    animation: head-shadow 3s ease-in-out infinite;
  }
  
  .eevee .ear {
    width: 50px;
    height: 70px;
    background: #9d7442;
    border-radius: 25px 25px 15px 15px;
    top: 10px;
  }
  
  .eevee .ear.left {
    left: 75px;
    transform: rotate(-15deg);
    animation: ear 3s ease-in-out infinite;
  }
  
  .eevee .ear.right {
    right: 75px;
    transform: rotate(15deg);
    animation: ear 3s ease-in-out infinite 0.1s;
  }
  
  .eevee .ear.left::after,
  .eevee .ear.right::after {
    content: '';
    width: 25px;
    height: 35px;
    background: #260f02;
    border-radius: 12px 12px 8px 8px;
    position: absolute;
    top: 15px;
    left: 12px;
  }
  
  .eevee .eyes {
    width: 80px;
    height: 30px;
    left: 110px;
    top: 95px;
    animation: eyes 3s ease-in-out infinite;
  }
  
  .eevee .eye {
    width: 25px;
    height: 30px;
    background: #260f02;
    border-radius: 50%;
    top: 0;
  }
  
  .eevee .eye.left {
    left: 0;
  }
  
  .eevee .eye.right {
    right: 0;
  }
  
  .eevee .eye::after {
    content: '';
    width: 10px;
    height: 12px;
    background: #955d27;
    border-radius: 50%;
    position: absolute;
    top: 8px;
    left: 7px;
  }
  
  .eevee .eye::before {
    content: '';
    width: 5px;
    height: 6px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
  }
  
  .eevee .eyelid {
    width: 25px;
    height: 30px;
    background: #9d7442;
    border-radius: 50%;
    top: 0;
    animation: eyelid 3s ease-in-out infinite;
  }
  
  .eevee .eyelid.left {
    left: 0;
  }
  
  .eevee .eyelid.right {
    right: 0;
  }
  
  .eevee .nose {
    width: 12px;
    height: 10px;
    background: #260f02;
    border-radius: 6px 6px 4px 4px;
    left: 144px;
    top: 115px;
    animation: nose 3s ease-in-out infinite;
  }
  
  .eevee .mouth {
    width: 30px;
    height: 15px;
    left: 135px;
    top: 125px;
    animation: mouth 3s ease-in-out infinite;
  }
  
  .eevee .mouth-move {
    width: 10px;
    height: 8px;
    background: #260f02;
    border-radius: 0 0 5px 5px;
    left: 10px;
    top: 5px;
    animation: mouth-move 3s ease-in-out infinite;
  }
  
  .eevee .mouth-side {
    width: 15px;
    height: 8px;
    border-bottom: 3px solid #260f02;
    border-radius: 0 0 8px 8px;
    top: 3px;
  }
  
  .eevee .mouth-side.left {
    left: 0;
    animation: mouth-side 3s ease-in-out infinite;
  }
  
  .eevee .mouth-side.right {
    right: 0;
    animation: mouth-side 3s ease-in-out infinite 0.05s;
  }
  
  /* 动画关键帧 */
  @keyframes head {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  
  @keyframes head-shadow {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-3px); }
  }
  
  @keyframes eyes {
    0%, 45%, 55%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }
  
  @keyframes eyelid {
    0%, 40%, 60%, 100% { height: 0; top: 15px; }
    45%, 55% { height: 30px; top: 0; }
  }
  
  @keyframes nose {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }
  
  @keyframes mouth-move {
    0%, 100% { height: 8px; }
    50% { height: 4px; }
  }
  
  @keyframes mouth-side {
    0%, 100% { transform: scaleX(1); }
    50% { transform: scaleX(0.8); }
  }
  
  @keyframes ear {
    0%, 100% { transform: rotate(-15deg); }
    50% { transform: rotate(-20deg); }
  }
  
  @keyframes leg {
    0%, 100% { transform: translateY(0); }
    25% { transform: translateY(-3px); }
    75% { transform: translateY(2px); }
  }
  
  /* 宠物体泡 */
  .pet-main .pet-word {
    line-height: 1.4;
  }
  
  /* 浮动动画 */
  @keyframes petFloat {
    0%, 100% { transform: translateY(0) scale(0.5); }
    50% { transform: translateY(-8px) scale(0.5); }
  }
  
  .pet-main .eevee {
    animation: petFloat 3s ease-in-out infinite;
  }
  
  /* 鼠标悬停暂停动画 */
  .pet-main:hover .eevee {
    animation-play-state: paused;
  }
  
  /* 点击特效 */
  @keyframes petBounce {
    0%, 100% { transform: translateY(0) scale(0.5); }
    25% { transform: translateY(-15px) scale(0.5); }
    50% { transform: translateY(0) scale(0.55); }
    75% { transform: translateY(-5px) scale(0.52); }
  }
  
  .pet-main.bounce .eevee {
    animation: petBounce 0.6s ease;
  }
  
  /* 睡眠状态 */
  .pet-main.sleeping .eye,
  .pet-main.sleeping .eyelid {
    height: 4px !important;
    top: 13px !important;
    border-radius: 2px !important;
  }
  
  .pet-main.sleeping .eye::after,
  .pet-main.sleeping .eye::before {
    display: none;
  }
  
  .pet-main.sleeping .mouth-move {
    height: 2px !important;
  }
`;

export class Pet {
  constructor() {
    this.container = null;
    this.eevee = null;
    this.chat = null;
    this.word = null;
    this.sayTimer = null;
    this.isSleeping = false;
    this.randomSayInterval = null;
    this.options = {
      drag: true,
      showChat: true,
      words: [
        '欢迎来到我的博客~',
        '今天也要开心哦！',
        '点击我可以互动哦',
        '记得常来看看呀',
        '写的文章真不错！',
        '给你比个心~',
        '加油加油！',
        '有什么问题可以问我哦'
      ]
    };
  }

  init(opt = {}) {
    this.options = { ...this.options, ...opt };
    
    // 注入样式
    if (!document.getElementById('pet-styles')) {
      const style = document.createElement('style');
      style.id = 'pet-styles';
      style.textContent = eeveeCSS;
      document.head.appendChild(style);
    }

    // 创建容器
    this.container = document.createElement('div');
    this.container.className = 'pet-main';
    this.container.innerHTML = eeveeHTML + `
      <div class="pet-chat" style="display: ${this.options.showChat ? 'block' : 'none'}">
        <div class="pet-word"></div>
      </div>
    `;
    document.body.appendChild(this.container);

    this.eevee = this.container.querySelector('.eevee');
    this.chat = this.container.querySelector('.pet-chat');
    this.word = this.container.querySelector('.pet-word');

    // 绑定事件
    this.bindEvents();
    
    // 开始随机说话
    this.startRandomSay();

    return this;
  }

  bindEvents() {
    // 点击事件
    this.eevee.addEventListener('click', (e) => {
      e.stopPropagation();
      this.onClick();
    });

    // 拖拽
    if (this.options.drag) {
      this.eevee.addEventListener('mousedown', this.startDrag.bind(this));
      this.eevee.addEventListener('touchstart', this.startDrag.bind(this), { passive: false });
    }

    // 双击睡觉
    this.eevee.addEventListener('dblclick', () => {
      this.toggleSleep();
    });
  }

  startDrag(e) {
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    const startX = touch.clientX - this.container.offsetLeft;
    const startY = touch.clientY - this.container.offsetTop;

    const onMove = (e) => {
      const t = e.touches ? e.touches[0] : e;
      const left = t.clientX - startX;
      const top = t.clientY - startY;
      this.container.style.left = Math.max(0, left) + 'px';
      this.container.style.top = Math.max(0, top) + 'px';
      this.container.style.right = 'auto';
      this.container.style.bottom = 'auto';
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  }

  onClick() {
    // 弹跳动画
    this.container.classList.add('bounce');
    setTimeout(() => {
      this.container.classList.remove('bounce');
    }, 600);

    // 随机说话
    const words = this.options.words;
    const randomWord = words[Math.floor(Math.random() * words.length)];
    this.say(randomWord);
  }

  toggleSleep() {
    this.isSleeping = !this.isSleeping;
    if (this.isSleeping) {
      this.container.classList.add('sleeping');
      this.say('zzZ... 晚安~');
    } else {
      this.container.classList.remove('sleeping');
      this.say('醒啦醒啦！');
    }
  }

  say(text, duration = 3000) {
    if (!this.word) return;
    this.word.textContent = text;
    this.chat.style.display = 'block';
    
    clearTimeout(this.sayTimer);
    this.sayTimer = setTimeout(() => {
      this.chat.style.display = 'none';
    }, duration);
  }

  startRandomSay() {
    this.randomSayInterval = setInterval(() => {
      if (!this.isSleeping && Math.random() > 0.7) {
        const words = this.options.words;
        const randomWord = words[Math.floor(Math.random() * words.length)];
        this.say(randomWord, 4000);
      }
    }, 10000);
  }

  show() {
    if (this.container) {
      this.container.style.display = 'block';
    }
  }

  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  destroy() {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
    clearTimeout(this.sayTimer);
    if (this.randomSayInterval) {
      clearInterval(this.randomSayInterval);
    }
  }
}

export default new Pet();
