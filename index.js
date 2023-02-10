console.log(gsap);
const canvas = document.querySelector("canvas");
const score = document.querySelector("#score");
const finalScore = document.querySelector('#finalScore');
const gameOver = document.querySelector('.gameOver');
document.querySelector('#reloadGame').onclick = () =>{
  location.reload();
}



// console.log(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");

// thuoc tiing nguoi choi
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}
// thuoc tinh cua vien dan
class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  // update de khi requestFrame se thay doi vi tri cua vien dan
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
// thuoc tinh cua ke dich
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
// hieu ung no tung particular
const friction = 0.99;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }
  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;
const player = new Player(x, y, 20, "white");

// const projectile = new Projectile(
//   canvas.width /2,
//   canvas.height /2,
//   5,
//   'red',
//   {
//     x:1,
//     y:1
//   }
// );

const projecttiles = [];
const enemies = [];
const particles = [];

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * 30 + 10;
    console.log(radius);
    // console.log('ke dich moi da xuat hien');

    let x;
    let y;
    // tao ke dich ngau nhien tu 4 canh cua canvas
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width - radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height - radius;
    }

    const color = `hsl(${Math.random() * 360},50%,50%)`;
    // lay tam man hinh tru cho vi tri hien tai cua ke dich
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    // console.log(angle);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

let animationId;
let scoreValue = 0;

function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
  projecttiles.forEach((projectile, index) => {
    projectile.update();
    // remove projectile
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projecttiles.splice(index, 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, index) => {
    enemy.update();
    const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (distance - enemy.radius - player.radius < 1) {
      //console.log("end game");
      cancelAnimationFrame(animationId);
      gameOver.classList.toggle('active');
    }

    projecttiles.forEach((projectile, projectileIndex) => {
      const distance = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      );
      // console.log(distance);

      // khi cham vao ke thu
      if (distance - enemy.radius - projectile.radius < 1) {
        // tang diem so
        scoreValue += 100;
        score.innerHTML = scoreValue;
        finalScore.innerHTML = scoreValue;
        

        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            // gia tri cua velocitty se dao dong tu khoang -0.5 -> 0.5
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 4),
                y: (Math.random() - 0.5) * (Math.random() * 4),
              }
            )
          );
        }
        if (enemy.radius - 10 > 10) {
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });

          setTimeout(() => {
            projecttiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          setTimeout(() => {
            enemies.splice(index, 1);
            projecttiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });
}

// console.log(player);
addEventListener("click", (event) => {
  // console.log(event);
  // console.log(projecttiles);

  // dung atan2() dung de tim ra goc giua noi click chuot voi be mat cua man hinh
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );
  // console.log(angle) projectile;
  const velocity = {
    x: Math.cos(angle) * 9,
    y: Math.sin(angle) * 9,
  };

  // sau khi lay duoc vi tri thi se dua tao ra 1 vien dan moi
  projecttiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
  );
});

animate();
spawnEnemies();
