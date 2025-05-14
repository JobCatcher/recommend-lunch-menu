import {useEffect, useRef, useState} from 'react';

export default function useDrawLots() {
  // const data = await fetch('/api/');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [makeLots, setMakeLots] = useState<() => void | null>(() => {});

  const restaurants = ['햄버거', '순대국', '정식당', '중국집', '구내식당'];
  const colors: string[] = [
    'rgb(241, 169, 74)',
    'rgb(249,158,151)',
    'rgb(186, 156, 208)',
    'rgb(158, 193, 230)',
    'rgb(175, 212, 100)',
  ];

  let c: HTMLCanvasElement | null;
  let _ctx: CanvasRenderingContext2D | null;

  useEffect(() => {
    c = canvasRef.current;
    if (!c) return;
    _ctx = c.getContext(`2d`);
    if (!_ctx) return;

    const size = 400;
    const $c = c;
    const ctx = _ctx;

    $c.width = size;
    $c.height = size;

    const _makeLots = () => {
      const [cw, ch] = [$c.width / 2, $c.height / 2];
      const arc = Math.PI / (restaurants.length / 2);
      for (let i = 0; i < restaurants.length; i++) {
        ctx.beginPath();
        if (colors.length == 0) {
          for (var l = 0; l < restaurants.length; l++) {
            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);
            colors.push('rgb(' + r + ',' + g + ',' + b + ')');
          }
        }
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(cw, ch);
        ctx.arc(cw, ch, cw, arc * (i - 1), arc * i);
        ctx.fill();
        ctx.closePath();
      }

      ctx.fillStyle = '#fff';
      ctx.font = '18px Pretendard';
      ctx.textAlign = 'center';

      for (let i = 0; i < restaurants.length; i++) {
        const angle = arc * i + arc / 2;

        ctx.save();

        ctx.translate(cw + Math.cos(angle) * (cw - 50), ch + Math.sin(angle) * (ch - 50));

        ctx.rotate(angle + Math.PI / 2);

        restaurants[i].split(' ').forEach((text, j) => {
          ctx.fillText(text, 0, 30 * j);
        });

        ctx.restore();
      }
    };
    setMakeLots(() => _makeLots);
  }, []);

  const getCurrentRotation = () => {
    const matrix = window.getComputedStyle(c!).transform;

    if (matrix === 'none') return 0;

    // transform matrix에서 회전 각도 추출
    const values = matrix.split('(')[1].split(')')[0].split(',');
    const a = parseFloat(values[0]);
    const b = parseFloat(values[1]);

    let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

    // 음수 각도를 양수로 변환
    return angle < 0 ? angle + 360 : angle;
  };

  const rotate = () => {
    if (!c) return;
    c.style.transform = `initial`;
    c.style.transition = `initial`;

    setTimeout(() => {
      const ran = Math.floor(Math.random() * restaurants.length);
      const arc = 360 / restaurants.length;

      // 랜덤한 섹션을 정하고 3600도를 추가해서 여러 바퀴 돌도록 설정
      const rotateAngle = 360 - arc * (ran + 1) + 3600 + arc / 3;
      c!.style.transform = `rotate(${rotateAngle}deg)`;
      c!.style.transition = `2s`;

      setTimeout(() => {
        // 최종 회전 각도 계산
        const finalAngle = getCurrentRotation();
        const index = (Math.floor((360 - finalAngle) / arc) - 1 + restaurants.length) % restaurants.length;

        alert(`${restaurants[index]} 당첨!`);
      }, 2000);
    }, 1);
  };

  return {canvasRef, rotate, makeLots};
}
